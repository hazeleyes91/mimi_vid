import React, { useState, useEffect, useRef } from 'react';
import { Terminal2SubState, PHIX174_GENES } from '../types';

interface Terminal2Props {
  initialState?: Terminal2SubState;
}

const BASE_PROMPT = 'GAGTTTTATCG';
// Sequence of tokens predicted in HUD mode before looping
const PREDICTED_TOKENS = [
  { base: 'C', confidence: 84 },
  { base: 'T', confidence: 88 },
  { base: 'T', confidence: 82 },
  { base: 'C', confidence: 86 },
  { base: 'C', confidence: 85 },
  { base: 'A', confidence: 91 },
];

const BASES = ['A', 'C', 'T', 'G'];
const BASE_COLORS: Record<string, string> = {
  A: '#00FF66',
  T: '#00CC55',
  C: '#33FF88',
  G: '#009944',
};

export const Terminal2: React.FC<Terminal2Props> = ({ initialState = 'TYPING' }) => {
  const [subState, setSubState] = useState<Terminal2SubState>(initialState);

  // STATE 1: TYPING STATE
  const [typedText, setTypedText] = useState('');
  const [isTypingDone, setIsTypingDone] = useState(false);

  // STATE 2: SEQUENTIAL HUD PROBABILITY STATE
  const [hudTokenIndex, setHudTokenIndex] = useState(0);
  const [committedTokens, setCommittedTokens] = useState<string[]>([]);
  const [hudProbabilities, setHudProbabilities] = useState({ A: 12, C: 28, T: 40, G: 20 });
  const [isCurrentTokenLocked, setIsCurrentTokenLocked] = useState(false);
  const [isHudSequenceComplete, setIsHudSequenceComplete] = useState(false);

  // STATE 3: STREAM BURST STATE
  const [streamRows, setStreamRows] = useState<string[]>([]);
  const [streamProgress, setStreamProgress] = useState(0);
  const [isStreamComplete, setIsStreamComplete] = useState(false);

  // STATE 4: CIRCULAR GENOME ROTATION
  const [ringAngle, setRingAngle] = useState(0);

  // Sync subState with prop changes
  useEffect(() => {
    setSubState(initialState);
  }, [initialState]);

  // ==========================================
  // STATE 1: Looping Mechanical Typing Effect
  // ==========================================
  useEffect(() => {
    if (subState !== 'TYPING') return;
    let isActive = true;
    let loopTimeout: ReturnType<typeof setTimeout>;

    const runTypingCycle = () => {
      setTypedText('');
      setIsTypingDone(false);

      let charIdx = 0;
      const interval = setInterval(() => {
        if (!isActive) {
          clearInterval(interval);
          return;
        }

        if (charIdx < BASE_PROMPT.length) {
          setTypedText(BASE_PROMPT.slice(0, charIdx + 1));
          charIdx++;
        } else {
          clearInterval(interval);
          setIsTypingDone(true);
          // Pause 2.5s and loop
          loopTimeout = setTimeout(() => {
            if (isActive) runTypingCycle();
          }, 2500);
        }
      }, 90);
    };

    runTypingCycle();

    return () => {
      isActive = false;
      clearTimeout(loopTimeout);
    };
  }, [subState]);

  // =======================================================
  // STATE 2: Sequential Multi-Token HUD Looping Progression
  // =======================================================
  useEffect(() => {
    if (subState !== 'HUD') return;
    let isActive = true;
    let stepTimer: ReturnType<typeof setTimeout>;
    let loopTimer: ReturnType<typeof setTimeout>;

    const runTokenPrediction = (index: number, currentAccumulated: string[]) => {
      if (!isActive) return;

      if (index >= PREDICTED_TOKENS.length) {
        setIsHudSequenceComplete(true);
        loopTimer = setTimeout(() => {
          if (!isActive) return;
          setIsHudSequenceComplete(false);
          setCommittedTokens([]);
          setHudTokenIndex(0);
          runTokenPrediction(0, []);
        }, 3200);
        return;
      }

      setHudTokenIndex(index);
      setIsCurrentTokenLocked(false);
      const target = PREDICTED_TOKENS[index];

      let frame = 0;
      const flucInterval = setInterval(() => {
        if (!isActive) {
          clearInterval(flucInterval);
          return;
        }
        frame++;

        if (frame < 14) {
          const a = Math.floor(Math.random() * 25) + 5;
          const t = Math.floor(Math.random() * 25) + 5;
          const g = Math.floor(Math.random() * 25) + 5;
          const c = 100 - (a + t + g);
          setHudProbabilities({ A: a, C: Math.max(5, c), T: t, G: g });
        } else {
          clearInterval(flucInterval);
          const lockedDist: Record<string, number> = { A: 4, C: 4, T: 4, G: 4 };
          lockedDist[target.base] = target.confidence;
          const remaining = (100 - target.confidence) / 3;
          BASES.forEach(b => {
            if (b !== target.base) lockedDist[b] = Math.floor(remaining);
          });

          setHudProbabilities(lockedDist as { A: number; C: number; T: number; G: number });
          setIsCurrentTokenLocked(true);

          stepTimer = setTimeout(() => {
            if (!isActive) return;
            const updated = [...currentAccumulated, target.base];
            setCommittedTokens(updated);

            setTimeout(() => {
              if (isActive) runTokenPrediction(index + 1, updated);
            }, 600);
          }, 450);
        }
      }, 50);
    };

    setCommittedTokens([]);
    setIsHudSequenceComplete(false);
    runTokenPrediction(0, []);

    return () => {
      isActive = false;
      clearTimeout(stepTimer);
      clearTimeout(loopTimer);
    };
  }, [subState]);

  // ==============================================
  // STATE 3: Hyper-Speed Stream Acceleration Loop
  // ==============================================
  useEffect(() => {
    if (subState !== 'STREAM') return;
    let isActive = true;
    let loopTimeout: ReturnType<typeof setTimeout>;

    const generateRow = (offset: number) => {
      let line = `${String(offset).padStart(4, '0')}: `;
      for (let i = 0; i < 48; i++) {
        line += BASES[Math.floor(Math.random() * 4)] + ' ';
      }
      return line;
    };

    const runStreamCycle = () => {
      let totalBases = 0;
      const targetBases = 5386;
      let rate = 1800;
      const startTime = performance.now();
      setIsStreamComplete(false);
      setStreamRows([]);

      const interval = setInterval(() => {
        if (!isActive) {
          clearInterval(interval);
          return;
        }

        const elapsed = (performance.now() - startTime) / 1000;
        rate = Math.min(5400, Math.floor(1800 + elapsed * 1200));

        totalBases = Math.min(targetBases, totalBases + Math.floor(rate / 25));
        setStreamProgress(totalBases);

        setStreamRows(prev => {
          const nextRows = [...prev, generateRow(totalBases)];
          return nextRows.slice(-18);
        });

        if (totalBases >= targetBases) {
          clearInterval(interval);
          setIsStreamComplete(true);
          loopTimeout = setTimeout(() => {
            if (isActive) runStreamCycle();
          }, 2500);
        }
      }, 40);
    };

    runStreamCycle();

    return () => {
      isActive = false;
      clearTimeout(loopTimeout);
    };
  }, [subState]);

  // ========================================================
  // STATE 4: Circular Nucleotide Ring Rotation (Continuous)
  // ========================================================
  const animRef = useRef<number | null>(null);
  useEffect(() => {
    if (subState !== 'RING') return;
    let lastTime = performance.now();

    const updateRotation = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      setRingAngle(prev => (prev + (360 / 20) * delta) % 360);
      animRef.current = requestAnimationFrame(updateRotation);
    };

    animRef.current = requestAnimationFrame(updateRotation);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [subState]);

  // Generate Circular Nucleotide Track Bases
  const ringRadius = 240;
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

  const currentTargetToken = PREDICTED_TOKENS[hudTokenIndex] || PREDICTED_TOKENS[0];

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', padding: '32px', display: 'flex', flexDirection: 'column' }}>
      {/* High-Visibility Header Banner - Clearly Labeled as PROMPT for State 1 */}
      <div className="telemetry-banner" style={{ width: '100%', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="telemetry-bold telemetry-cyan" style={{ fontSize: '1.4rem' }}>
            {subState === 'TYPING'
              ? 'INTERACTIVE PROMPT ENTRY // GENERATIVE INGESTION'
              : 'CORE GENERATIVE RECEPTOR // PHIX174_ANCHOR'}
          </span>
          <span className="telemetry-bold telemetry-white" style={{ fontSize: '1.1rem' }}>
            {subState === 'TYPING' ? 'STAGE: [PROMPT] (LOOPING)' : `MODE: ${subState} [LOOPING]`}
          </span>
        </div>
        <div className="telemetry-bold telemetry-white" style={{ fontSize: '1.05rem', opacity: 0.9 }}>
          {subState === 'TYPING' && 'SYS_STATUS: PROMPT SEQUENCE TYPING ACTIVE // PHIX174_ANCHOR'}
          {subState === 'HUD' && `SYS_STATUS: SEQUENTIAL TOKEN PREDICTION [TOKEN ${hudTokenIndex + 1}/${PREDICTED_TOKENS.length}]`}
          {subState === 'STREAM' && 'SYS_STATUS: DE NOVO CHROMOSOME EXPANSION // 5,386 BASES'}
          {subState === 'RING' && 'SYS_STATUS: TOPOLOGY WRAPPED // CONTINUOUS ROTATION (5,386 BP)'}
        </div>
      </div>

      {/* STATE 1: TYPING SEQUENCE - CLEARLY LABELED AS PROMPT */}
      {subState === 'TYPING' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '40px' }}>
          {/* Explicit Prompt Label Callout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <span className="telemetry-pill telemetry-cyan" style={{ fontSize: '1.2rem', borderColor: '#00E5FF' }}>
              PROMPT ENTRY
            </span>
            <span className="telemetry-pill telemetry-white" style={{ fontSize: '1.05rem' }}>
              ANCHOR: PHIX174_REF
            </span>
          </div>

          <div style={{ fontSize: '2.6rem', fontWeight: 700, color: '#00FF66' }} className="dna-matrix-text">
            <span style={{ color: '#00E5FF', marginRight: '16px', fontWeight: 900 }}>PROMPT &gt;</span>
            <span>{typedText}</span>
            <span className="cursor-pulse">█</span>
          </div>

          <div style={{ marginTop: '40px', display: 'flex', gap: '16px' }}>
            <span className="telemetry-pill telemetry-cyan">
              {isTypingDone ? 'PROMPT BUFFER: SEALED // RECYCLING PROMPT LOOP...' : 'MECHANICAL PROMPT INGESTION IN PROGRESS...'}
            </span>
          </div>
        </div>
      )}

      {/* STATE 2: SEQUENTIAL TOKEN PROBABILITY HUD (ZERO BLUR) */}
      {subState === 'HUD' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div
            style={{
              background: 'rgba(2, 22, 12, 0.98)',
              border: `2px solid ${isCurrentTokenLocked ? '#FFB800' : '#00E5FF'}`,
              borderRadius: '6px',
              padding: '20px 28px',
              width: '480px',
              marginBottom: '32px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid #00E5FF', paddingBottom: '8px' }}>
              <span className="telemetry-bold telemetry-white" style={{ fontSize: '1.2rem' }}>
                TOKEN PREDICTION [{hudTokenIndex + 1}/{PREDICTED_TOKENS.length}]
              </span>
              {isCurrentTokenLocked ? (
                <span className="telemetry-bold telemetry-amber" style={{ fontSize: '1.2rem' }}>
                  [LOCKED: '{currentTargetToken.base}']
                </span>
              ) : (
                <span className="telemetry-bold telemetry-cyan" style={{ fontSize: '1.1rem' }}>
                  [COMPUTING SOFTMAX]
                </span>
              )}
            </div>

            {/* Probability Bars (Zero Blur) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(['A', 'C', 'T', 'G'] as const).map(base => {
                const val = hudProbabilities[base];
                const isWinner = isCurrentTokenLocked && base === currentTargetToken.base;
                return (
                  <div key={base} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span
                      style={{
                        width: '28px',
                        fontSize: '1.3rem',
                        fontWeight: 800,
                        color: isWinner ? '#FFB800' : BASE_COLORS[base],
                      }}
                    >
                      {base}
                    </span>
                    <div style={{ flex: 1, height: '16px', background: 'rgba(0, 40, 20, 0.9)', border: '1px solid rgba(0, 255, 102, 0.4)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${val}%`,
                          backgroundColor: isWinner ? '#FFB800' : BASE_COLORS[base],
                          transition: 'width 0.08s ease',
                        }}
                      />
                    </div>
                    <span
                      style={{
                        width: '56px',
                        textAlign: 'right',
                        fontSize: '1.2rem',
                        fontWeight: 800,
                        color: isWinner ? '#FFB800' : '#FFFFFF',
                      }}
                    >
                      {val}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sequence Prompt with Committed Tokens (Zero Blur) */}
          <div style={{ fontSize: '2.4rem', fontWeight: 700 }} className="dna-matrix-text">
            <span style={{ color: '#00E5FF', marginRight: '12px' }}>PROMPT &gt;</span>
            <span style={{ color: '#00FF66' }}>{BASE_PROMPT}</span>
            {committedTokens.map((token, i) => (
              <span key={i} style={{ color: '#00FFAA', fontWeight: 900 }}>
                {token}
              </span>
            ))}
            {isCurrentTokenLocked && hudTokenIndex === committedTokens.length && (
              <span style={{ color: '#FFB800', fontWeight: 900 }}>
                [{currentTargetToken.base}]
              </span>
            )}
            <span className="cursor-pulse">█</span>
          </div>

          <div style={{ marginTop: '28px' }}>
            <span className="telemetry-pill telemetry-emerald">
              {isHudSequenceComplete
                ? `ALL ${PREDICTED_TOKENS.length} TOKENS COMMITTED // RECYCLING HUD LOOP...`
                : isCurrentTokenLocked
                ? `COMMITTING TOKEN '${currentTargetToken.base}' (${currentTargetToken.confidence}%) -> ADVANCING`
                : `CALCULATING NEXT-TOKEN PROBABILITY FOR POSITION ${BASE_PROMPT.length + committedTokens.length}...`}
            </span>
          </div>
        </div>
      )}

      {/* STATE 3: HYPER-SPEED STREAM */}
      {subState === 'STREAM' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span className="telemetry-pill telemetry-white">
              SYNTHESIS PASS: DE NOVO SEQUENCE GENERATION
            </span>
            <span className="telemetry-pill telemetry-cyan">
              PROGRESS: {streamProgress} / 5,386 BP (PHIX174 CHROMOSOME)
            </span>
          </div>

          <div
            style={{
              flex: 1,
              background: 'rgba(2, 14, 8, 0.95)',
              border: '1px solid rgba(0, 229, 255, 0.4)',
              borderRadius: '4px',
              padding: '16px',
              overflow: 'hidden',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '1.1rem',
              lineHeight: '1.6',
              color: '#00FF66',
            }}
          >
            {streamRows.map((r, idx) => (
              <div key={idx} style={{ opacity: 0.4 + (idx / streamRows.length) * 0.6 }} className="dna-matrix-text">
                {r}
              </div>
            ))}
          </div>

          <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center' }}>
            <span className="telemetry-pill telemetry-emerald">
              {isStreamComplete
                ? '5,386 BP GENERATIVE BURST COMPLETE // RECYCLING STREAM LOOP...'
                : 'SYNTHESIS BURST ACTIVE: 5,400 BASES SYNTHESIZING...'}
            </span>
          </div>
        </div>
      )}

      {/* STATE 4: CIRCULAR NUCLEOTIDE RING MORPH (ZERO BLUR) */}
      {subState === 'RING' && (
        <div style={{ flex: 1, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <svg width="680" height="680" viewBox="-340 -340 680 680" style={{ transform: `rotate(${ringAngle}deg)` }}>
            <circle cx="0" cy="0" r={ringRadius - 20} fill="none" stroke="rgba(0, 255, 102, 0.2)" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="0" cy="0" r={ringRadius + 20} fill="none" stroke="rgba(0, 255, 102, 0.2)" strokeWidth="1" strokeDasharray="4 4" />

            {/* 11 Gene Arcs with Boundaries */}
            {PHIX174_GENES.map(gene => {
              const startRad = ((gene.startAngle - 90) * Math.PI) / 180;
              const endRad = ((gene.endAngle - 90) * Math.PI) / 180;
              const arcLength = gene.endAngle >= gene.startAngle ? gene.endAngle - gene.startAngle : 360 - gene.startAngle + gene.endAngle;
              const largeArcFlag = arcLength > 180 ? 1 : 0;

              const x1 = (ringRadius + 28) * Math.cos(startRad);
              const y1 = (ringRadius + 28) * Math.sin(startRad);
              const x2 = (ringRadius + 28) * Math.cos(endRad);
              const y2 = (ringRadius + 28) * Math.sin(endRad);

              const pathData = `M ${x1} ${y1} A ${ringRadius + 28} ${ringRadius + 28} 0 ${largeArcFlag} 1 ${x2} ${y2}`;

              return (
                <path
                  key={gene.id}
                  d={pathData}
                  fill="none"
                  stroke={gene.color}
                  strokeWidth="3"
                  strokeOpacity="0.9"
                />
              );
            })}

            {/* Preserved ATCG Nucleotide Bases (Zero Blur) */}
            {ringBases.map((base, idx) => {
              const rad = ((base.angleDeg - 90) * Math.PI) / 180;
              const x = ringRadius * Math.cos(rad);
              const y = ringRadius * Math.sin(rad);

              return (
                <text
                  key={idx}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={BASE_COLORS[base.char]}
                  fontSize="12px"
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="bold"
                  transform={`rotate(${base.angleDeg}, ${x}, ${y})`}
                >
                  {base.char}
                </text>
              );
            })}
          </svg>

          {/* Gene Callout Overlay Tags (Zero Blur) */}
          <div style={{ position: 'absolute', pointerEvents: 'none', width: '680px', height: '680px' }}>
            {PHIX174_GENES.map(gene => {
              const midAngle = gene.endAngle >= gene.startAngle ? (gene.startAngle + gene.endAngle) / 2 : ((gene.startAngle + gene.endAngle + 360) / 2) % 360;
              const rad = ((midAngle + ringAngle - 90) * Math.PI) / 180;
              const labelDist = ringRadius + 64;
              const lx = 340 + labelDist * Math.cos(rad);
              const ly = 340 + labelDist * Math.sin(rad);

              return (
                <div
                  key={gene.id}
                  style={{
                    position: 'absolute',
                    left: `${lx}px`,
                    top: `${ly}px`,
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(0, 18, 10, 0.95)',
                    border: `1px solid ${gene.color}`,
                    borderRadius: '4px',
                    padding: '2px 8px',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    color: gene.color,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {gene.name}
                </div>
              );
            })}
          </div>

          {/* Central Topology HUD (Zero Blur) */}
          <div
            style={{
              position: 'absolute',
              textAlign: 'center',
              pointerEvents: 'none',
              background: 'rgba(2, 20, 12, 0.96)',
              border: '1px solid #00E5FF',
              borderRadius: '8px',
              padding: '16px 24px',
            }}
          >
            <div className="telemetry-bold telemetry-cyan" style={{ fontSize: '1.25rem', marginBottom: '6px' }}>
              PHI-X174 CIRCULAR CHROMOSOME
            </div>
            <div className="telemetry-bold telemetry-white" style={{ fontSize: '1.05rem', marginBottom: '4px' }}>
              LENGTH: 5,386 BP // ssDNA
            </div>
            <div className="telemetry-bold telemetry-emerald" style={{ fontSize: '0.95rem' }}>
              11 CODING ARCS // CONTINUOUS ROTATION
            </div>
          </div>
        </div>
      )}

      <div className="crt-overlay" />
    </div>
  );
};
