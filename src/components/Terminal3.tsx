import React, { useState, useEffect } from 'react';
import { Terminal3Pass, PHIX174_GENES } from '../types';

interface Terminal3Props {
  initialPass?: Terminal3Pass;
}

const BASES = ['A', 'C', 'T', 'G'];
const BASE_COLORS: Record<string, string> = {
  A: '#00FF66',
  T: '#00CC55',
  C: '#33FF88',
  G: '#009944',
};

// Alignment Dataset for Pass 3
const ALIGNMENT_DATA = [
  { index: '0001', cand: 'M S Q V Q Q K L K E L G A S L G', ref: 'M S Q V Q Q K L K E L G A S L G', diff: false },
  { index: '0017', cand: 'A T D L V A A F S A S D P A T A', ref: 'A T D L V A A F S A S D P A T A', diff: false },
  { index: '0033', cand: 'Y G N A A L T T S K N L F P N A', ref: 'Y G N A A L T T S K Y L F P N V', diff: true },
  { index: '0049', cand: 'V K G V F S A S V D K L A S G D', ref: 'V K G I F S A S V D K L T S G E', diff: true },
  { index: '0065', cand: 'Q W R D K M T T L G A V A R A G', ref: 'Q W R N K M T T L G A I A R A G', diff: true },
  { index: '0081', cand: 'T V R V I T L T A S G K E V E L', ref: 'T V R V I T L T A S G K E V E L', diff: false },
  { index: '0097', cand: 'L V E T G K I L P D L Q Y V D V', ref: 'L V E T G K I L P D M Q Y V D V', diff: true },
];

export const Terminal3: React.FC<Terminal3Props> = ({ initialPass = 'SWEEP' }) => {
  const [activePass, setActivePass] = useState<Terminal3Pass>(initialPass);

  // Pass 1: Radar Sweep Angle & Validated Genes count
  const [sweepAngle, setSweepAngle] = useState(0);
  const [validatedGeneCount, setValidatedGeneCount] = useState(0);

  // Pass 2: Gene G Reticle Lock
  const [isReticleLocked, setIsReticleLocked] = useState(false);

  // Pass 3: Odometer value
  const [odometerValue, setOdometerValue] = useState(100.0);

  // Sync activePass with prop changes
  useEffect(() => {
    setActivePass(initialPass);
  }, [initialPass]);

  // Self-Contained Pass Loops
  useEffect(() => {
    let isActive = true;
    let loopTimeout: ReturnType<typeof setTimeout>;

    // PASS 1: Continuous 360-degree Radar Sweep Loop
    if (activePass === 'SWEEP') {
      const runSweepCycle = () => {
        const startTime = performance.now();
        const sweepDuration = 4500;

        const sweepInterval = setInterval(() => {
          if (!isActive) {
            clearInterval(sweepInterval);
            return;
          }

          const elapsed = performance.now() - startTime;
          const progress = Math.min(1, elapsed / sweepDuration);
          const currentAngle = progress * 360;
          setSweepAngle(currentAngle);

          const count = Math.min(11, Math.floor((currentAngle / 360) * 11) + 1);
          setValidatedGeneCount(count);

          if (progress >= 1) {
            clearInterval(sweepInterval);
            loopTimeout = setTimeout(() => {
              if (isActive) runSweepCycle();
            }, 1200);
          }
        }, 30);
      };

      runSweepCycle();
      return () => {
        isActive = false;
        clearTimeout(loopTimeout);
      };
    }

    // PASS 2: Persistent Reticle Lock & Amber Pulse Loop
    if (activePass === 'RETICLE') {
      const runReticleCycle = () => {
        setIsReticleLocked(false);
        loopTimeout = setTimeout(() => {
          if (!isActive) return;
          setIsReticleLocked(true);
          loopTimeout = setTimeout(() => {
            if (isActive) runReticleCycle();
          }, 4500);
        }, 1100);
      };

      runReticleCycle();
      return () => {
        isActive = false;
        clearTimeout(loopTimeout);
      };
    }

    // PASS 3: Continuous Odometer Countdown Loop (100.0% -> 94.6%)
    if (activePass === 'ODOMETER') {
      const runOdometerCycle = () => {
        const startVal = 100.0;
        const targetVal = 94.6;
        const startTime = performance.now();
        const duration = 2800;

        const odoInterval = setInterval(() => {
          if (!isActive) {
            clearInterval(odoInterval);
            return;
          }

          const elapsed = performance.now() - startTime;
          const progress = Math.min(1, elapsed / duration);
          const ease = 1 - Math.pow(1 - progress, 3);
          const val = startVal - (startVal - targetVal) * ease;
          setOdometerValue(parseFloat(val.toFixed(1)));

          if (progress >= 1) {
            clearInterval(odoInterval);
            loopTimeout = setTimeout(() => {
              if (isActive) runOdometerCycle();
            }, 3500);
          }
        }, 35);
      };

      runOdometerCycle();
      return () => {
        isActive = false;
        clearTimeout(loopTimeout);
      };
    }
  }, [activePass]);

  // Nucleotide ring layout (Enlarged Scale)
  const ringRadius = 320;
  const numRingBases = 180;
  const ringBases = Array.from({ length: numRingBases }, (_, i) => {
    const angleDeg = (i / numRingBases) * 360;
    const gene = PHIX174_GENES.find(g => {
      if (g.startAngle <= g.endAngle) {
        return angleDeg >= g.startAngle && angleDeg < g.endAngle;
      } else {
        return angleDeg >= g.startAngle || angleDeg < g.endAngle;
      }
    }) || PHIX174_GENES[0];
    const baseChar = BASES[i % 4];
    return { char: baseChar, angleDeg, gene };
  });

  // Calculate sweep ray coordinates
  const sweepRad = ((sweepAngle - 90) * Math.PI) / 180;
  const sweepX = (ringRadius + 38) * Math.cos(sweepRad);
  const sweepY = (ringRadius + 38) * Math.sin(sweepRad);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', padding: '32px', display: 'flex', flexDirection: 'column' }}>
      {/* Header Banner */}
      <div className="telemetry-banner" style={{ width: '100%', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="telemetry-bold telemetry-cyan" style={{ fontSize: '1.8rem' }}>
            {activePass === 'SWEEP' && 'FILTER 01: GENETIC ARCHITECTURE INTEGRITY SCAN'}
            {activePass === 'RETICLE' && 'FILTER 02: HOST TROPISM & SPIKE SPECIFICITY LOCK'}
            {activePass === 'ODOMETER' && 'FILTER 03: NOVEL SPECIES DIVERSIFICATION MATCH'}
          </span>
          <div style={{ display: 'flex', gap: '10px' }}>
            {[
              { id: 'SWEEP', label: '[6] ARCHITECTURE SCAN' },
              { id: 'RETICLE', label: '[7] TROPISM LOCK' },
              { id: 'ODOMETER', label: '[8] DIVERSIFICATION' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActivePass(tab.id as Terminal3Pass)}
                style={{
                  background: activePass === tab.id ? '#00FFAA' : 'rgba(0, 30, 15, 0.9)',
                  color: activePass === tab.id ? '#050B07' : '#00E5FF',
                  border: '1.5px solid #00E5FF',
                  borderRadius: '5px',
                  padding: '6px 14px',
                  fontFamily: 'inherit',
                  fontWeight: 800,
                  fontSize: '1.0rem',
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="telemetry-bold telemetry-white" style={{ fontSize: '1.25rem', opacity: 0.95, marginTop: '6px' }}>
          {activePass === 'SWEEP' && `SCANNING 11 ESSENTIAL CODING ARCS FOR READING FRAME INTACTNESS [${validatedGeneCount}/11 VALIDATED]`}
          {activePass === 'RETICLE' && 'TARGETING MAJOR SPIKE PROTEIN (GENE G) FOR E. COLI C RECEPTOR BINDING [LOCKED]'}
          {activePass === 'ODOMETER' && 'PAIRWISE SEQUENCE ALIGNMENT AGAINST NATURAL PHIX174 WILD-TYPE (<95.0% DIVERGENCE THRESHOLD)'}
        </div>
      </div>

      {/* PASS 1: ARCHITECTURE SCANLINE RADAR (ENLARGED DISPLAY, ZERO BLUR) */}
      {activePass === 'SWEEP' && (
        <div style={{ flex: 1, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <svg width="880" height="880" viewBox="-440 -440 880 880">
            <circle cx="0" cy="0" r={ringRadius - 38} fill="none" stroke="rgba(0, 229, 255, 0.3)" strokeWidth="1.5" />
            <circle cx="0" cy="0" r={ringRadius} fill="none" stroke="rgba(0, 255, 102, 0.3)" strokeWidth="1.5" strokeDasharray="4 4" />
            <circle cx="0" cy="0" r={ringRadius + 38} fill="none" stroke="rgba(0, 229, 255, 0.3)" strokeWidth="1.5" />

            {/* Gene Arc Sectors */}
            {PHIX174_GENES.map(gene => {
              const isPassed = sweepAngle >= (gene.startAngle <= gene.endAngle ? gene.endAngle : gene.endAngle + 360);
              const startRad = ((gene.startAngle - 90) * Math.PI) / 180;
              const endRad = ((gene.endAngle - 90) * Math.PI) / 180;
              const arcLength = gene.endAngle >= gene.startAngle ? gene.endAngle - gene.startAngle : 360 - gene.startAngle + gene.endAngle;
              const largeArcFlag = arcLength > 180 ? 1 : 0;
              const x1 = (ringRadius + 36) * Math.cos(startRad);
              const y1 = (ringRadius + 36) * Math.sin(startRad);
              const x2 = (ringRadius + 36) * Math.cos(endRad);
              const y2 = (ringRadius + 36) * Math.sin(endRad);

              return (
                <path
                  key={gene.id}
                  d={`M ${x1} ${y1} A ${ringRadius + 36} ${ringRadius + 36} 0 ${largeArcFlag} 1 ${x2} ${y2}`}
                  fill="none"
                  stroke={isPassed ? '#00FFAA' : gene.color}
                  strokeWidth="7"
                  strokeOpacity={isPassed ? 1 : 0.75}
                />
              );
            })}

            {/* Circular Monospace ATCG Bases (Enlarged 16px/18px, Zero Blur) */}
            {ringBases.map((base, idx) => {
              const rad = ((base.angleDeg - 90) * Math.PI) / 180;
              const x = ringRadius * Math.cos(rad);
              const y = ringRadius * Math.sin(rad);
              const angleDiff = Math.abs((sweepAngle - base.angleDeg + 360) % 360);
              const isIlluminated = angleDiff < 15;

              return (
                <text
                  key={idx}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isIlluminated ? '#FFFFFF' : BASE_COLORS[base.char]}
                  fontSize={isIlluminated ? '18px' : '16px'}
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="bold"
                  transform={`rotate(${base.angleDeg}, ${x}, ${y})`}
                >
                  {base.char}
                </text>
              );
            })}

            {/* Rotating Sweep Vector Line (Zero Blur) */}
            <line
              x1="0"
              y1="0"
              x2={sweepX}
              y2={sweepY}
              stroke="#00E5FF"
              strokeWidth="3"
            />
          </svg>

          {/* Sweep Diagnostic Readout Badge (Enlarged 1.85rem) */}
          <div style={{ position: 'absolute', bottom: '24px' }}>
            <span className="telemetry-pill telemetry-emerald" style={{ fontSize: '1.85rem', padding: '12px 28px' }}>
              &gt; SCANNING ARCHITECTURE... {validatedGeneCount}/11 GENES VALIDATED [OK]
            </span>
          </div>
        </div>
      )}

      {/* PASS 2: HOST TROPISM RETICLE (TARGET LOCK ON GENE G, ENLARGED DISPLAY) */}
      {activePass === 'RETICLE' && (
        <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div
            style={{
              background: 'rgba(2, 20, 10, 0.98)',
              border: `2.5px solid ${isReticleLocked ? '#FFB800' : '#00E5FF'}`,
              borderRadius: '10px',
              padding: '36px 48px',
              width: '840px',
              position: 'relative',
            }}
          >
            <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '1.6rem', color: '#FFB800' }}>┌</div>
            <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '1.6rem', color: '#FFB800' }}>┐</div>
            <div style={{ position: 'absolute', bottom: '10px', left: '10px', fontSize: '1.6rem', color: '#FFB800' }}>└</div>
            <div style={{ position: 'absolute', bottom: '10px', right: '10px', fontSize: '1.6rem', color: '#FFB800' }}>┘</div>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <span className="telemetry-bold telemetry-white" style={{ fontSize: '1.5rem' }}>
                CAMERA ZOOM // LOCUS GENE G (MAJOR SPIKE COMPLEX)
              </span>
            </div>

            {/* Target Reticle Crosshair SVG (Enlarged 440x220) */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0' }}>
              <svg width="440" height="220" viewBox="0 0 440 220">
                <rect x="15" y="15" width="410" height="190" fill="none" stroke={isReticleLocked ? '#FFB800' : '#00E5FF'} strokeWidth="2" strokeDasharray="8 5" />
                <line x1="220" y1="0" x2="220" y2="220" stroke={isReticleLocked ? '#FF4400' : '#00E5FF'} strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="0" y1="110" x2="440" y2="110" stroke={isReticleLocked ? '#FF4400' : '#00E5FF'} strokeWidth="1.5" strokeDasharray="4 4" />

                <text x="220" y="95" fill={isReticleLocked ? '#FFB800' : '#00FF66'} fontSize="22px" fontWeight="bold" fontFamily="JetBrains Mono, monospace" textAnchor="middle">
                  A T G G T T C G T C A C
                </text>
                <text x="220" y="140" fill={isReticleLocked ? '#FFB800' : '#00FF66'} fontSize="22px" fontWeight="bold" fontFamily="JetBrains Mono, monospace" textAnchor="middle">
                  G G C T T T T T A G C A
                </text>
              </svg>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontSize: '1.35rem' }}>
              <span className="telemetry-bold telemetry-cyan">CODONS: 2395 - 2922 (175 AA)</span>
              <span className="telemetry-bold telemetry-amber">{isReticleLocked ? '[TARGET LOCKED]' : '[ACQUIRING...]'}</span>
            </div>
            <div style={{ marginTop: '12px', fontSize: '1.25rem' }}>
              <span className="telemetry-bold telemetry-white">RECEPTOR MOTIF: LIPOPOLYSACCHARIDE (LPS) GLYCAN CORE</span>
            </div>
          </div>

          <div style={{ marginTop: '32px' }}>
            <span className="telemetry-pill telemetry-amber" style={{ fontSize: '1.85rem', padding: '12px 28px' }}>
              &gt; ISOLATING SPIKE PROTEIN (GENE G)... HOST TROPISM LOCKED: E. COLI C
            </span>
          </div>
        </div>
      )}

      {/* PASS 3: DIVERSIFICATION DATABASE MATCH (ENLARGED DISPLAY) */}
      {activePass === 'ODOMETER' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {/* Dual Alignment Panel */}
          <div style={{ display: 'flex', gap: '24px', marginBottom: '28px' }}>
            <div
              style={{
                flex: 1,
                background: 'rgba(2, 20, 10, 0.98)',
                border: '1.5px solid #00E5FF',
                borderRadius: '8px',
                padding: '24px',
              }}
            >
              <div className="telemetry-bold telemetry-cyan" style={{ fontSize: '1.55rem', marginBottom: '16px', borderBottom: '1px solid #00E5FF', paddingBottom: '8px' }}>
                GENERATED CANDIDATE: CAND_8812
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '1.3rem' }}>
                {ALIGNMENT_DATA.map((row, i) => (
                  <div key={i} style={{ color: row.diff ? '#00FFAA' : '#FFFFFF', fontWeight: row.diff ? 800 : 500 }}>
                    <span style={{ color: '#00E5FF', marginRight: '12px' }}>{row.index}:</span>
                    <span>{row.cand}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                flex: 1,
                background: 'rgba(2, 20, 10, 0.98)',
                border: '1.5px solid #00E5FF',
                borderRadius: '8px',
                padding: '24px',
              }}
            >
              <div className="telemetry-bold telemetry-white" style={{ fontSize: '1.55rem', marginBottom: '16px', borderBottom: '1px solid #00E5FF', paddingBottom: '8px' }}>
                NATURAL REFERENCE: NC_001422.1 (WT)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '1.3rem' }}>
                {ALIGNMENT_DATA.map((row, i) => (
                  <div key={i} style={{ color: row.diff ? '#FFB800' : '#88AA99', fontWeight: row.diff ? 800 : 500 }}>
                    <span style={{ color: '#00E5FF', marginRight: '12px' }}>{row.index}:</span>
                    <span>{row.ref}</span>
                    {row.diff && <span style={{ marginLeft: '14px', color: '#FFB800' }}>[MUTATION]</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* High-Visibility Digital Odometer (Enlarged 4.2rem) */}
          <div
            style={{
              background: 'rgba(0, 18, 10, 0.98)',
              border: '2.5px solid #00FFAA',
              borderRadius: '10px',
              padding: '20px 36px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div className="telemetry-bold telemetry-white" style={{ fontSize: '1.6rem', marginBottom: '6px' }}>
                AMINO ACID IDENTITY (AAI) ODOMETER
              </div>
              <div className="telemetry-bold telemetry-cyan" style={{ fontSize: '1.25rem' }}>
                DIVERSIFICATION CUTOFF THRESHOLD: &lt; 95.0% [LOOPING]
              </div>
            </div>

            <div
              style={{
                background: '#021008',
                border: '2.5px solid #00FFAA',
                borderRadius: '8px',
                padding: '10px 32px',
                fontSize: '4.2rem',
                fontWeight: 900,
                color: odometerValue < 95.0 ? '#00FFAA' : '#FFFFFF',
                letterSpacing: '0.08em',
              }}
            >
              {odometerValue.toFixed(1)}%
            </div>
          </div>

          <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'center' }}>
            <span className="telemetry-pill telemetry-emerald" style={{ fontSize: '1.85rem', padding: '12px 28px' }}>
              &gt; DIVERSIFICATION: PASSED (&lt;95% AAI DIVERGENCE MET) // NOVEL SPECIES
            </span>
          </div>
        </div>
      )}

      <div className="crt-overlay" />
    </div>
  );
};
