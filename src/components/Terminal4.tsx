import React, { useState, useEffect, useRef } from 'react';

interface Terminal4Props {
  videoSrc?: string;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
}

export const Terminal4: React.FC<Terminal4Props> = ({ videoSrc, isPlaying: externalPlaying, onTogglePlay }) => {
  const [internalPlaying, setInternalPlaying] = useState(true);
  const isPlaying = externalPlaying !== undefined ? externalPlaying : internalPlaying;

  const togglePlay = () => {
    if (onTogglePlay) {
      onTogglePlay();
    } else {
      setInternalPlaying(prev => !prev);
    }
  };

  // Keyboard shortcut listener for Spacebar and 5/9
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === '5' || e.key === '9') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Timecode generator: 00:04:12:19
  const [timecode, setTimecode] = useState({ h: 0, m: 4, s: 12, frames: 19 });

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTimecode(prev => {
        let f = prev.frames + 1;
        let s = prev.s;
        let m = prev.m;
        let h = prev.h;
        if (f >= 30) {
          f = 0;
          s += 1;
        }
        if (s >= 60) {
          s = 0;
          m += 1;
        }
        if (m >= 60) {
          m = 0;
          h += 1;
        }
        return { h, m, s, frames: f };
      });
    }, 1000 / 30); // 30 FPS timecode

    return () => clearInterval(interval);
  }, [isPlaying]);

  const formattedTimecode = `${String(timecode.h).padStart(2, '0')}:${String(timecode.m).padStart(2, '0')}:${String(timecode.s).padStart(2, '0')}:${String(timecode.frames).padStart(2, '0')}`;

  // Canvas biological simulation fallback if no external video file is provided
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (videoSrc) return; // Use native HTML5 video if provided
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    let t = 0;

    const render = () => {
      if (isPlaying) {
        t += 0.02;
      }

      ctx.fillStyle = '#030805';
      ctx.fillRect(0, 0, width, height);

      // Disable canvas blur
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';

      const cx = width / 2;
      const cy = height / 2;

      // 1. Bacterial Cell Membrane (rod-shaped capsule)
      ctx.save();
      ctx.strokeStyle = '#00CC55';
      ctx.lineWidth = 3;

      const cellW = 540;
      const cellH = 260;
      const radius = 120;
      ctx.beginPath();
      ctx.roundRect(cx - cellW / 2, cy - cellH / 2, cellW, cellH, radius);
      ctx.stroke();

      // Inner membrane lipid bilayer
      ctx.strokeStyle = 'rgba(0, 255, 102, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(cx - cellW / 2 + 10, cy - cellH / 2 + 10, cellW - 20, cellH - 20, radius - 10);
      ctx.stroke();
      ctx.restore();

      // 2. Translocating Circular Plasmid-Like DNA Ring entering bacterial cell
      const ringEntrancePhase = Math.sin(t * 0.5);
      const ringX = cx - 220 + ringEntrancePhase * 160;
      const ringY = cy - 20 + Math.cos(t) * 15;
      const ringR = 48;

      ctx.save();
      ctx.strokeStyle = '#00E5FF';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(ringX, ringY, ringR, 0, Math.PI * 2);
      ctx.stroke();

      // Nucleotide base rungs on plasmid ring
      for (let i = 0; i < 20; i++) {
        const a = (i / 20) * Math.PI * 2 + t;
        const px1 = ringX + (ringR - 6) * Math.cos(a);
        const py1 = ringY + (ringR - 6) * Math.sin(a);
        const px2 = ringX + (ringR + 6) * Math.cos(a);
        const py2 = ringY + (ringR + 6) * Math.sin(a);
        ctx.beginPath();
        ctx.moveTo(px1, py1);
        ctx.lineTo(px2, py2);
        ctx.stroke();
      }
      ctx.restore();

      // 3. Icosahedral Viral Assembly Centers inside cytoplasm
      const virionCenters = [
        { x: cx + 110, y: cy - 40, rot: t * 0.8 },
        { x: cx + 160, y: cy + 30, rot: -t * 0.6 },
        { x: cx + 50, y: cy + 40, rot: t * 0.4 },
      ];

      virionCenters.forEach(v => {
        ctx.save();
        ctx.translate(v.x, v.y);
        ctx.rotate(v.rot);
        ctx.strokeStyle = '#FFB800';
        ctx.fillStyle = 'rgba(255, 184, 0, 0.2)';
        ctx.lineWidth = 2;

        ctx.beginPath();
        for (let s = 0; s < 6; s++) {
          const a = (s / 6) * Math.PI * 2;
          const vx = 32 * Math.cos(a);
          const vy = 32 * Math.sin(a);
          if (s === 0) ctx.moveTo(vx, vy);
          else ctx.lineTo(vx, vy);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 12 Spike protein nodules on capsid vertices
        for (let s = 0; s < 6; s++) {
          const a = (s / 6) * Math.PI * 2;
          const sx = 40 * Math.cos(a);
          const sy = 40 * Math.sin(a);
          ctx.fillStyle = '#FF3333';
          ctx.beginPath();
          ctx.arc(sx, sy, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      // 4. In-Cell Annotation Labels
      ctx.font = 'bold 13px "JetBrains Mono", monospace';
      ctx.fillStyle = '#00E5FF';
      ctx.fillText('[MEMBRANE TRANSLOCATION]', ringX - 90, ringY - 60);

      ctx.fillStyle = '#FFB800';
      ctx.fillText('[VIRION ASSEMBLY]', cx + 70, cy - 80);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [videoSrc, isPlaying]);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#030805' }}>
      {videoSrc ? (
        <video
          src={videoSrc}
          autoPlay={isPlaying}
          loop
          muted
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
      )}

      {/* DIAGNOSTIC HUD OVERLAY */}
      {/* 4-Corner Targeting Reticles */}
      <div style={{ position: 'absolute', top: '24px', left: '24px', width: '48px', height: '48px', borderTop: '3px solid #00E5FF', borderLeft: '3px solid #00E5FF' }} />
      <div style={{ position: 'absolute', top: '24px', right: '24px', width: '48px', height: '48px', borderTop: '3px solid #00E5FF', borderRight: '3px solid #00E5FF' }} />
      <div style={{ position: 'absolute', bottom: '24px', left: '24px', width: '48px', height: '48px', borderBottom: '3px solid #00E5FF', borderLeft: '3px solid #00E5FF' }} />
      <div style={{ position: 'absolute', bottom: '24px', right: '24px', width: '48px', height: '48px', borderBottom: '3px solid #00E5FF', borderRight: '3px solid #00E5FF' }} />

      {/* Top-Right Recording Indicator */}
      <div
        style={{
          position: 'absolute',
          top: '32px',
          right: '80px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'rgba(2, 18, 10, 0.96)',
          border: '1px solid #00E5FF',
          borderRadius: '4px',
          padding: '8px 18px',
        }}
      >
        <span className="rec-dot" style={{ display: isPlaying ? 'inline-block' : 'none' }} />
        <span className="telemetry-bold telemetry-white" style={{ fontSize: '1.3rem', letterSpacing: '0.05em' }}>
          REC [●] {formattedTimecode}
        </span>
      </div>

      {/* Top-Left Assay Mode */}
      <div style={{ position: 'absolute', top: '32px', left: '80px' }}>
        <span className="telemetry-pill telemetry-cyan" style={{ fontSize: '1.15rem' }}>
          REBOOT STAGE 05 // TRANSFORMATION CAPTURE
        </span>
      </div>

      {/* Bottom Diagnostic Bar (Zero Blur) */}
      <div
        style={{
          position: 'absolute',
          bottom: '32px',
          left: '80px',
          right: '80px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(2, 18, 10, 0.98)',
          border: '2px solid #00E5FF',
          borderRadius: '6px',
          padding: '12px 24px',
        }}
      >
        <span className="telemetry-bold telemetry-cyan" style={{ fontSize: '1.3rem' }}>
          ASSAY: IN VITRO REBOOT // HOST: E. COLI C // STRAIN: SAFE LAB STOCK
        </span>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <span className="telemetry-bold telemetry-white" style={{ fontSize: '1.05rem' }}>
            STATUS: {isPlaying ? 'REBOOT TRANSFORMATION ACTIVE' : 'REBOOT ASSAY PAUSED'}
          </span>
          <span
            onClick={togglePlay}
            style={{
              background: '#00FFAA',
              color: '#050B07',
              padding: '4px 12px',
              borderRadius: '4px',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            SPACE / 5 / 9: TOGGLE
          </span>
        </div>
      </div>

      <div className="crt-overlay" />
    </div>
  );
};
