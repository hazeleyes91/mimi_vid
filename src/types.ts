export type SceneMode = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export type Terminal2SubState = 'TYPING' | 'HUD' | 'STREAM' | 'RING';

export type Terminal3Pass = 'SWEEP' | 'RETICLE' | 'ODOMETER';

export interface ViralGene {
  id: string;
  name: string;
  fullName: string;
  startBp: number;
  endBp: number;
  startAngle: number; // 0 to 360
  endAngle: number;
  color: string;
  sampleBases: string;
}

export const PHIX174_GENES: ViralGene[] = [
  { id: 'A', name: 'Gene A', fullName: 'Viral Replication Initiator', startBp: 3981, endBp: 136, startAngle: 266, endAngle: 9, color: '#33FF88', sampleBases: 'GAGTTTTATCGCTTCCATGACGCAGAAGTT' },
  { id: 'A_STAR', name: 'Gene A*', fullName: 'Host DNA Replication Inhibitor', startBp: 4499, endBp: 136, startAngle: 300, endAngle: 9, color: '#00E5FF', sampleBases: 'CCATGACGCAGAAGTTAACACTTTCGGATA' },
  { id: 'B', name: 'Gene B', fullName: 'Internal Scaffolding Protein', startBp: 5075, endBp: 51, startAngle: 339, endAngle: 3, color: '#00FF66', sampleBases: 'ATGGAACAACAGACAGTTACAGTTTGTCCA' },
  { id: 'K', name: 'Gene K', fullName: 'Overlapping Regulator', startBp: 51, endBp: 221, startAngle: 3, endAngle: 15, color: '#00FFAA', sampleBases: 'ATGCGAATTTATTCAGATACTTTTGAGGCA' },
  { id: 'C', name: 'Gene C', fullName: 'DNA Synthesis & Packaging', startBp: 133, endBp: 393, startAngle: 9, endAngle: 26, color: '#33FF88', sampleBases: 'ATGCCTGAGTTTTTTCACTTACTGATCGAG' },
  { id: 'D', name: 'Gene D', fullName: 'External Scaffolding Protein', startBp: 390, endBp: 848, startAngle: 26, endAngle: 57, color: '#00CC55', sampleBases: 'ATGTCTACTCAACTCGCAACACTACTTCCA' },
  { id: 'E', name: 'Gene E', fullName: 'Cell Lysis Transmembrane Domain', startBp: 568, endBp: 843, startAngle: 38, endAngle: 56, color: '#009944', sampleBases: 'ATGGTACGCTGGACTTTGTGGGATACCCTC' },
  { id: 'J', name: 'Gene J', fullName: 'Core DNA Packaging Oligomer', startBp: 848, endBp: 964, startAngle: 57, endAngle: 64, color: '#33FF88', sampleBases: 'ATGAGTCAGGTTCAACAAAAACTAAAAGAG' },
  { id: 'F', name: 'Gene F', fullName: 'Major Capsid Coat Protein', startBp: 1001, endBp: 2284, startAngle: 67, endAngle: 153, color: '#00FF66', sampleBases: 'ATGTTTGGTAAATTTGATTTCGCTACTGGA' },
  { id: 'G', name: 'Gene G', fullName: 'Major Spike Protein (LPS Tropism)', startBp: 2395, endBp: 2922, startAngle: 160, endAngle: 195, color: '#FFB800', sampleBases: 'ATGGTTCGTCACGGCTTTTTAGCATTAGCG' },
  { id: 'H', name: 'Gene H', fullName: 'Minor Spike Pilot Protein', startBp: 2931, endBp: 3917, startAngle: 196, endAngle: 262, color: '#00CC55', sampleBases: 'ATGTTTTCTCAACCAACTGTTTCTTCAGCA' }
];
