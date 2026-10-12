import React, { useEffect, useState } from 'react';
import { SceneMode } from '../types';

interface SceneTransitionProps {
  scene: SceneMode;
  onComplete: () => void;
}

const TRANSITION_COMMANDS: Record<SceneMode, { stage: string; lines: string[] }> = {
  '1': {
    stage: 'INGESTION_STREAM_INITIALIZATION',
    lines: [
      '>>> MOUNTING ILLUMINA SHORT-READ STREAM PIPELINE...',
      '>>> REFERENCING CHROMOSOME ANCHOR: PHIX174 (5,386 BP)...',
      '>>> INGESTING CONTINUOUS BASE MATRIX [A, C, T, G]...',
      '>>> [PIPELINE ENGAGED: ACTIVE]',
    ],
  },
  '2': {
    stage: 'INTERACTIVE_PROMPT_ENTRY',
    lines: [
      '>>> ENGAGING GENERATIVE PROMPT INGESTION CONSOLE...',
      '>>> VERIFYING SEED SEQUENCE INTEGRITY...',
      '>>> AWAITING OPERATOR PROMPT BUFFER...',
      '>>> [PROMPT READY]',
    ],
  },
  '3': {
    stage: 'GENERATIVE_SYNTHESIS // PREDICTION_MATRIX',
    lines: [
      '>>> INITIALIZING DE NOVO INFERENCE PIPELINE...',
      '>>> INGESTING PROMPT SEQUENCE ANCHOR...',
      '>>> ENGAGING SOFTMAX NEXT-TOKEN PREDICTION...',
      '>>> [PREDICTION MATRIX LOCKED]',
    ],
  },
  '4': {
    stage: 'GENERATIVE_SYNTHESIS // SEQUENCE_EXPANSION',
    lines: [
      '>>> DE NOVO CHROMOSOME EXPANSION INITIATED...',
      '>>> ALLOCATING 5,386 BASE NUCLEOTIDE BUFFER...',
      '>>> EXPANDING FULL PHIX174 CHROMOSOME CODING REGIONS...',
      '>>> [EXPANSION STREAM ENGAGED]',
    ],
  },
  '5': {
    stage: 'GENERATIVE_SYNTHESIS // TOPOLOGY_CIRCULARIZATION',
    lines: [
      '>>> STRUCTURING 5,386 BP CIRCULAR GENOME TOPOLOGY...',
      '>>> MAPPING 11 CORE VIRAL CODING ARCS (GENES A THROUGH K)...',
      '>>> ASSEMBLING CONTINUOUS CIRCULAR NUCLEOTIDE TRACK...',
      '>>> [CIRCULAR CHROMOSOME VERIFIED]',
    ],
  },
  '6': {
    stage: 'IN_SILICO_FILTERING // FILTER_01_ARCHITECTURE_SCAN',
    lines: [
      '>>> EXECUTING FILTER 01: GENETIC ARCHITECTURE INTEGRITY SCAN...',
      '>>> CALIBRATING 360° RADAR VECTOR OVER CIRCULAR GENOME...',
      '>>> VERIFYING 11/11 ESSENTIAL CODING ARCS FOR READING FRAME INTACTNESS...',
      '>>> [ARCHITECTURE SCAN ACTIVE]',
    ],
  },
  '7': {
    stage: 'IN_SILICO_FILTERING // FILTER_02_TROPISM_SPECIFICITY_LOCK',
    lines: [
      '>>> EXECUTING FILTER 02: HOST TROPISM TARGET LOCK...',
      '>>> ISOLATING MAJOR SPIKE PROTEIN (GENE G - CODONS 2395-2922)...',
      '>>> TARGETING HOST RECEPTOR: E. COLI C LIPOPOLYSACCHARIDE CORE...',
      '>>> [HOST SPECIFICITY LOCKED]',
    ],
  },
  '8': {
    stage: 'IN_SILICO_FILTERING // FILTER_03_DIVERSIFICATION_MATCH',
    lines: [
      '>>> EXECUTING FILTER 03: SPECIES NOVELTY DIVERSIFICATION...',
      '>>> MOUNTING WILD-TYPE REFERENCE: NC_001422.1 (WT PHIX174)...',
      '>>> RUNNING PAIRWISE AMINO ACID IDENTITY (AAI) BENCHMARK...',
      '>>> [DIVERSIFICATION SCREENING ACTIVE]',
    ],
  },
  '9': {
    stage: 'IN_VITRO_REBOOT // BACTERIAL_TRANSFORMATION',
    lines: [
      '>>> PREPARING IN VITRO REBOOT ASSAY SIMULATION...',
      '>>> TARGET HOST: E. COLI C // STRAIN: SAFE LAB STOCK...',
      '>>> MONITORING MEMBRANE TRANSLOCATION & VIRION CAPSID ASSEMBLY...',
      '>>> [REBOOT ASSAY ACTIVE]',
    ],
  },
};

export const SceneTransition: React.FC<SceneTransitionProps> = ({ scene, onComplete }) => {
  const [displayedLineCount, setDisplayedLineCount] = useState(0);
  const data = TRANSITION_COMMANDS[scene] || TRANSITION_COMMANDS['1'];

  useEffect(() => {
    let lineIdx = 0;
    const interval = setInterval(() => {
      lineIdx++;
      setDisplayedLineCount(lineIdx);
      if (lineIdx >= data.lines.length) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 350);
      }
    }, 180);

    return () => clearInterval(interval);
  }, [scene, data.lines.length, onComplete]);

  // Allow clicking anywhere to skip transition immediately
  return (
    <div
      onClick={onComplete}
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#050b07',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          width: '760px',
          maxWidth: '90vw',
          background: 'rgba(2, 22, 12, 0.98)',
          border: '2px solid #00E5FF',
          borderRadius: '6px',
          padding: '28px 36px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '18px', borderBottom: '1px solid #00E5FF', paddingBottom: '10px' }}>
          <span className="telemetry-bold telemetry-cyan" style={{ fontSize: '1.25rem' }}>
            PIPELINE TRANSITION // {data.stage}
          </span>
          <span className="telemetry-bold telemetry-amber" style={{ fontSize: '1.05rem' }}>
            [EXECUTING]
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontFamily: '"JetBrains Mono", monospace' }}>
          {data.lines.slice(0, displayedLineCount).map((line, i) => (
            <div key={i} style={{ color: line.includes('[') ? '#00FFAA' : '#FFFFFF', fontSize: '1.15rem', fontWeight: 700 }}>
              {line}
            </div>
          ))}
        </div>

        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
          <span style={{ color: 'rgba(0, 229, 255, 0.6)', fontSize: '0.85rem' }}>
            (CLICK TO BYPASS)
          </span>
        </div>
      </div>

      <div className="crt-overlay" />
    </div>
  );
};
