import React, { useEffect, useRef } from 'react';

const BASES = ['A', 'C', 'T', 'G'];
const BASE_COLORS: Record<string, string> = {
  A: '#00FF66',
  T: '#00CC55',
  C: '#33FF88',
  G: '#009944',
};

const LOG_BANNERS = [
  {
    header: '>seq_read_09821 [phiX174_ref_anchor: 5386bp]',
    seq: '0001: G A G T T T T A T C G C T T C C A T G A C G C A G A A G T T',
    stat: '[READ_ALIGNMENT]: SYNCHRONIZED TO PHIX174 CHROMOSOME [5386 BP]',
  },
  {
    header: '>seq_read_09822 [phiX174_ref_anchor: 5386bp]',
    seq: '0032: C C T C A C G C C A T C G T C A G G T T A A C G T C C A T G A',
    stat: '[INGESTION_STATUS]: CONTINUOUS DE NOVO SHORT-READ INGESTION',
  },
  {
    header: '>seq_read_09823 [phiX174_ref_anchor: 5386bp]',
    seq: '0064: A G T C A A T G C T T A C G T A T G C A A T G C C T T T A C G',
    stat: '[ANCHOR_VERIFIED]: MAPPED TO HOST COMPATIBILITY LOCUS',
  },
];

interface HistoryLine {
  type: 'dna' | 'banner';
  text?: string;
  chars?: string[];
  bannerHeader?: string;
  bannerSeq?: string;
  bannerStat?: string;
}

export const Terminal1: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const charWidth = 14;
    const lineHeight = 24;

    // Pre-populate initial history lines so screen is filled above cursor on start
    const history: HistoryLine[] = [];
    const maxCols = Math.max(30, Math.floor((width - 32) / charWidth));
    const cursorY = Math.floor(height * 0.75); // Anchored at 1/4 from bottom
    const linesNeededAbove = Math.ceil(cursorY / lineHeight) + 2;

    for (let i = 0; i < linesNeededAbove; i++) {
      if (i % 9 === 0) {
        const b = LOG_BANNERS[(i / 9) % LOG_BANNERS.length];
        history.push({
          type: 'banner',
          bannerHeader: b.header,
          bannerSeq: b.seq,
          bannerStat: b.stat,
        });
      } else {
        const chars: string[] = [];
        for (let c = 0; c < maxCols; c++) {
          chars.push(BASES[Math.floor(Math.random() * BASES.length)]);
        }
        history.push({ type: 'dna', chars });
      }
    }

    // Active typing line state
    let activeChars: string[] = [];
    let pendingBanner: typeof LOG_BANNERS[0] | null = null;
    let lineCounter = 0;
    let bannerIndex = 0;

    let lastTypeTime = performance.now();
    const typeDelay = 10; // 4x faster typing cadence
    const charsPerStep = 4; // 4x speed batch injection

    // Smooth upward scroll interpolation
    let scrollOffset = 0;

    const render = (now: number) => {
      // 1. Advance character typing (4x faster)
      if (now - lastTypeTime >= typeDelay) {
        lastTypeTime = now;
        const currentCols = Math.max(30, Math.floor((width - 32) / charWidth));

        if (pendingBanner) {
          history.push({
            type: 'banner',
            bannerHeader: pendingBanner.header,
            bannerSeq: pendingBanner.seq,
            bannerStat: pendingBanner.stat,
          });
          pendingBanner = null;
          scrollOffset += lineHeight * 3.2;
        } else {
          // Add 4 characters per step for 4x typing speed
          for (let step = 0; step < charsPerStep; step++) {
            activeChars.push(BASES[Math.floor(Math.random() * BASES.length)]);

            if (activeChars.length >= currentCols) {
              history.push({ type: 'dna', chars: [...activeChars] });
              activeChars = [];
              lineCounter++;
              scrollOffset += lineHeight;

              if (lineCounter % 9 === 0) {
                pendingBanner = LOG_BANNERS[bannerIndex % LOG_BANNERS.length];
                bannerIndex++;
                break;
              }
            }
          }
        }

        if (history.length > 250) {
          history.splice(0, history.length - 200);
        }
      }

      // Fast scroll damping to match 4x throughput
      if (scrollOffset > 0.1) {
        scrollOffset *= 0.78;
      } else {
        scrollOffset = 0;
      }

      // 2. Clear canvas
      ctx.fillStyle = '#050B07';
      ctx.fillRect(0, 0, width, height);

      // Disable all blur/shadow on canvas for razor-sharp legibility
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';

      const baseFont = '14px "JetBrains Mono", monospace';
      const nonVisualHeaderFont = 'bold 16px "JetBrains Mono", monospace';
      const nonVisualBodyFont = 'bold 15px "JetBrains Mono", monospace';

      const currentCursorY = Math.floor(height * 0.75); // Fixed ~25% from bottom

      // 3. Render Completed History Lines
      let currentDrawY = currentCursorY - lineHeight + scrollOffset;

      for (let i = history.length - 1; i >= 0; i--) {
        const item = history[i];

        if (item.type === 'banner') {
          const bannerHeight = lineHeight * 3;
          currentDrawY -= bannerHeight - lineHeight;

          if (currentDrawY + bannerHeight > -20 && currentDrawY < height) {
            ctx.fillStyle = 'rgba(2, 22, 12, 0.96)';
            ctx.fillRect(16, currentDrawY - 4, width - 32, bannerHeight);
            ctx.strokeStyle = '#00E5FF';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(16, currentDrawY - 4, width - 32, bannerHeight);

            ctx.font = nonVisualHeaderFont;
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(item.bannerHeader || '', 28, currentDrawY + 16);

            ctx.font = nonVisualBodyFont;
            ctx.fillStyle = '#00E5FF';
            ctx.fillText(item.bannerSeq || '', 28, currentDrawY + 16 + lineHeight);

            ctx.font = nonVisualHeaderFont;
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(item.bannerStat || '', 28, currentDrawY + 16 + lineHeight * 2);
          }
        } else if (item.type === 'dna' && item.chars) {
          if (currentDrawY > -20 && currentDrawY < height) {
            ctx.font = baseFont;
            for (let c = 0; c < item.chars.length; c++) {
              const char = item.chars[c];
              ctx.fillStyle = BASE_COLORS[char] || '#00FF66';
              ctx.fillText(char, 16 + c * charWidth, currentDrawY + 16);
            }
          }
        }

        currentDrawY -= lineHeight;
        if (currentDrawY < -60) break;
      }

      // 4. Render Active Typing Line at Cursor Baseline (1/4 from bottom)
      const typingY = currentCursorY + scrollOffset;
      ctx.font = baseFont;

      for (let c = 0; c < activeChars.length; c++) {
        const char = activeChars[c];
        ctx.fillStyle = BASE_COLORS[char] || '#00FF66';
        ctx.fillText(char, 16 + c * charWidth, typingY + 16);
      }

      // Draw Active Typing Cursor (█) with zero blur
      const cursorX = 16 + activeChars.length * charWidth;
      const isBlinkOn = Math.floor(now / 350) % 2 === 0;
      if (isBlinkOn) {
        ctx.font = 'bold 16px "JetBrains Mono", monospace';
        ctx.fillStyle = '#00E5FF';
        ctx.fillText('█', cursorX, typingY + 16);
      }

      // 5. Baseline Guide & Telemetry Below the 1/4 Bottom Line
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(16, currentCursorY + lineHeight + 8);
      ctx.lineTo(width - 16, currentCursorY + lineHeight + 8);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.fillStyle = '#00E5FF';
      ctx.fillText(
        `[INGESTION_PIPELINE: ACTIVE CHROMOSOME STREAM // REFERENCE: PHIX174 SS_DNA]`,
        24,
        currentCursorY + lineHeight + 28
      );

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
      <div className="crt-overlay" />
    </div>
  );
};
