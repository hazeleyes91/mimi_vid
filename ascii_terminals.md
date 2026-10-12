# Terminal ASCII Wireframes & Layout Templates

This document contains raw ASCII visual layouts for Terminals 1 through 4 and their respective operational states.
* **Non-visual text (telemetry, log headers, odometers, status pills)** is delineated with high-contrast formatting markers `[[ BOLD / HIGH-CONTRAST ]]`.
* **The circular genome** is explicitly rendered as a ribbon of active `A T C G` nucleotide bases following the circular ring perimeter.

---

## Terminal 1: Raw Nucleotide Ingestion Stream (Scene 1)
```text
+----------------------------------------------------------------------------------------------------+
| A T G C A A T G C T T A C G T A T G C A A T G C T T A C G T A T G C A A T G C T T A C G T A T G C |
| G C T A A C G T A T T G C A T A G C T A A C G T A T T G C A T A G C T A A C G T A T T G C A T A G |
| T A C G T A T G C A A T G C T T T A C G T A T G C A A T G C T T T A C G T A T G C A A T G C T T T |
| C T T A C G T A T G C A A T G C C T T A C G T A T G C A A T G C C T T A C G T A T G C A A T G C C |
|                                                                                                    |
| ╔════════════════════════════════════════════════════════════════════════════════════════════════╗ |
| ║ [[ BOLD WHITE / 1.3X ]] >seq_read_09821 [phiX174_ref_anchor: 5386bp]                           ║ |
| ║ [[ BOLD CYAN  / 1.3X ]] 0001: G A G T T T T A T C G C T T C C A T G A C G C A G A A G T T      ║ |
| ║ [[ BOLD WHITE / 1.3X ]] [TOKENIZER_STREAM]: 4,096 tokens/sec | seq_window: 131,072 nt         ║ |
| ╚════════════════════════════════════════════════════════════════════════════════════════════════╝ |
|                                                                                                    |
| A A T G C T T A C G T A T G C A A A T G C T T A C G T A T G C A A A T G C T T A C G T A T G C A A |
| C G T A T T G C A T A G C T A A C C G T A T T G C A T A G C T A A C C G T A T T G C A T A G C T A A|
| T G C A A T G C T T T A C G T A T T G C A A T G C T T T A C G T A T T G C A A T G C T T T A C G T A|
| T A C G T A T G C A A T G C C T T T A C G T A T G C A A T G C C T T T A C G T A T G C A A T G C C T|
| A T G C A A T G C T T A C G T A T G C A A T G C T T A C G T A T G C A A T G C T T A C G T A T G C |
| G C T A A C G T A T T G C A T A G C T A A C G T A T T G C A T A G C T A A C G T A T T G C A T A G |
|                                                                                                    |
| ╔════════════════════════════════════════════════════════════════════════════════════════════════╗ |
| ║ [[ BOLD WHITE / 1.3X ]] >seq_read_09822 [phiX174_ref_anchor: 5386bp]                           ║ |
| ║ [[ BOLD CYAN  / 1.3X ]] 0032: C C T C A C G C C A T C G T C A G G T T A A C G T C C A T G A    ║ |
| ║ [[ BOLD WHITE / 1.3X ]] [TOKENIZER_STREAM]: 4,096 tokens/sec | seq_window: 131,072 nt         ║ |
| ╚════════════════════════════════════════════════════════════════════════════════════════════════╝ |
|                                                                                                    |
| T A C G T A T G C A A T G C T T T A C G T A T G C A A T G C T T T A C G T A T G C A A T G C T T T |
| C T T A C G T A T G C A A T G C C T T A C G T A T G C A A T G C C T T A C G T A T G C A A T G C C |
+----------------------------------------------------------------------------------------------------+
```

---

## Terminal 2: Interactive Prompt & Next-Token Generation (Scenes 2 & 3)

### State 1 — Typing Sequence (Scene 2)
```text
+----------------------------------------------------------------------------------------------------+
| ╔════════════════════════════════════════════════════════════════════════════════════════════════╗ |
| ║ [[ BOLD CYAN / 1.4X ]] CORE GENERATIVE RECEPTOR // PHIX174_ANCHOR                              ║ |
| ║ [[ BOLD CYAN / 1.2X ]] SYS_STATUS: READY FOR TOKEN INGESTION                                   ║ |
| ╚════════════════════════════════════════════════════════════════════════════════════════════════╝ |
|                                                                                                    |
|                                                                                                    |
| > GAGTTTTATCG█                                                                                     |
|                                                                                                    |
|                                                                                                    |
|                                                                                                    |
|                                                                                                    |
|                                                                                                    |
|                                                                                                    |
|                                                                                                    |
| ╔════════════════════════════════════════════════════════════════════════════════════════════════╗ |
| ║ [[ BOLD WHITE / 1.2X ]] [HOTKEY: '2' REPLAY TYPING | '3' TRIGGER NEXT-TOKEN HUD]               ║ |
| ╚════════════════════════════════════════════════════════════════════════════════════════════════╝ |
+----------------------------------------------------------------------------------------------------+
```

### State 2 — Token Probability HUD (Scene 3 Beat 1)
```text
+----------------------------------------------------------------------------------------------------+
| ╔════════════════════════════════════════════════════════════════════════════════════════════════╗ |
| ║ [[ BOLD CYAN / 1.4X ]] CORE GENERATIVE RECEPTOR // PHIX174_ANCHOR                              ║ |
| ╚════════════════════════════════════════════════════════════════════════════════════════════════╝ |
|                                                                                                    |
|             ╔══════════════════════════════════════════════════╗                                   |
|             ║ [[ BOLD WHITE / 1.3X ]] NEXT-TOKEN PREDICTION    ║                                   |
|             ║ A [████░░░░░░] 08%                               ║                                   |
|             ║ C [██████████] 84% -> [[ BOLD AMBER ]] [LOCKED]  ║                                   |
|             ║ T [██░░░░░░░░] 05%                               ║                                   |
|             ║ G [█░░░░░░░░░] 03%                               ║                                   |
|             ╚═════════════════════════╤════════════════════════╝                                   |
|                                       V                                                            |
| > GAGTTTTATCG[[ BOLD AMBER / 1.5X ]][C]█                                                           |
|                                                                                                    |
| ╔════════════════════════════════════════════════════════════════════════════════════════════════╗ |
| ║ [[ BOLD EMERALD / 1.3X ]] SEQ_APPEND_COMMITTED: 'C' (CONF: 0.842)                              ║ |
| ║ [[ BOLD WHITE   / 1.2X ]] [TRANSITIONING TO HIGH-SPEED STREAM IN 1.2S...]                      ║ |
| ╚════════════════════════════════════════════════════════════════════════════════════════════════╝ |
+----------------------------------------------------------------------------------------------------+
```

### State 3 — Hyper-Speed Stream (Scene 3 Beat 2)
```text
+----------------------------------------------------------------------------------------------------+
| ╔════════════════════════════════════════════════════════════════════════════════════════════════╗ |
| ║ [[ BOLD WHITE / 1.4X ]] >> STREAM BURST ACTIVE: 5,400 BASES SYNTHESIZING                       ║ |
| ║ [[ BOLD CYAN  / 1.3X ]] RATE: 1,800 NT/SEC ^ ACCELERATING -> 5,400 NT/SEC (60 FPS)             ║ |
| ╚════════════════════════════════════════════════════════════════════════════════════════════════╝ |
|                                                                                                    |
| 0120: G T A C G T T C A G G T A A T G C G T C A T T G A C G A T G C A A T G T C A G G C A T T     |
| 0160: A C G T T G C A A T T G C A T G T A C G T C A T G C T T G A A T C G C A T T G C A T A C     |
| 0200: C G T T A G C A T C G T C A T G C A A T G T C A A T G T G T A C G T T G C A T G C A T T     |
| 0240: T T A C G T A T G C A A T G C T T T A C G T A T G C A A T G C T T T A C G T A T G C A T     |
| 0280: C T T A C G T A T G C A A T G C C T T A C G T A T G C A A T G C C T T A C G T A T G C C     |
| 0320: G C T A A C G T A T T G C A T A G C T A A C G T A T T G C A T A G C T A A C G T A T T G     |
| 0360: A T G C A A T G C T T A C G T A T G C A A T G C T T A C G T A T G C A A T G C T T A C G     |
| 0400: C C T C A C G C C A T C G T C A G G T T A A C G T C C A T G A G T C A A T G C T T A C G     |
| 0440: T A C G T A T G C A A T G C T T T A C G T A T G C A A T G C T T T A C G T A T G C A A T     |
| 0480: A T G C A A T G C T T A C G T A T G C A A T G C T T A C G T A T G C A A T G C T T A C G     |
|                                                                                                    |
| ╔════════════════════════════════════════════════════════════════════════════════════════════════╗ |
| ║ [[ BOLD CYAN  / 1.3X ]] PROGRESS: [========================================] 5,386 / 5,386 BP  ║ |
| ║ [[ BOLD WHITE / 1.3X ]] STATUS: CLOSING SEQUENCE TO NUCLEOTIDE CIRCULAR RING...                ║ |
| ╚════════════════════════════════════════════════════════════════════════════════════════════════╝ |
+----------------------------------------------------------------------------------------------------+
```

### State 4 — Nucleotide Circular Ring Morph (Scene 3 Beat 3)
*Preserves actual ATCG bases arranged in a circular ribbon topology:*
```text
+----------------------------------------------------------------------------------------------------+
| ╔════════════════════════════════════════════════════════════════════════════════════════════════╗ |
| ║ [[ BOLD CYAN / 1.4X ]] GENOME TOPOLOGY: CIRCULAR SINGLE-STRANDED DNA // PHIX174 [5,386 BP]     ║ |
| ║ [[ BOLD WHITE / 1.2X ]] ROTATION: 360 DEG / 20.0S | TRACK: 5,386 MONOSPACE NUCLEOTIDE BASES     ║ |
| ╚════════════════════════════════════════════════════════════════════════════════════════════════╝ |
|                                                                                                    |
|                                   [[ BOLD WHITE ]] [ GENE A / A* ]                                 |
|                                       G A G T T T T A T C G C                                      |
|                                     C T T C C A T G A C G C A G                                    |
|                              T A A C                             A A G T                           |
|                          C G T                                       T T C                         |
|                      G C A        [[ BOLD WHITE ]] [GENE B]              T T A                     |
|                    A T C                                                   C G C                   |
|                  G C T   [[ BOLD WHITE ]] [GENE C]                           T T C                 |
|                A T C                                           [GENE K]        C A T               |
|               C G T      [[ BOLD WHITE ]] [GENE D]                               G A C             |
|               T A G                                                               G C A            |
|      [GENE E] C G T                                                               G A A            |
|      [[ BOLD  A T C                                                               G T T [[ BOLD    |
|       WHITE]] C G T                                                               C C T  AMBER ]]  |
|               T A G      [[ BOLD WHITE ]] [GENE J]             [GENE H]          C A C [GENE G:    |
|                A T C                                                             G C C  SPIKE]     |
|                  G C T   [[ BOLD WHITE ]] [GENE F]                             A T C               |
|                    T A G                                                   G T C                   |
|                      A T C                                               A G G                     |
|                          C G A                                       T T A                         |
|                              G C T                               A A C                             |
|                                     A T C G G C T A A T C G A T C                                  |
|                                       T A G C C G A T T A G C G                                    |
|                                                                                                    |
| ╔════════════════════════════════════════════════════════════════════════════════════════════════╗ |
| ║ [[ BOLD EMERALD / 1.3X ]] 11 SEGMENTED CODING REGIONS MAPPED // TOPOLOGY VERIFIED             ║ |
| ╚════════════════════════════════════════════════════════════════════════════════════════════════╝ |
+----------------------------------------------------------------------------------------------------+
```

---

## Terminal 3: In Silico Screening Diagnostics (Scene 4)

### Pass 1 — Genetic Architecture Scanline
```text
+----------------------------------------------------------------------------------------------------+
| ╔════════════════════════════════════════════════════════════════════════════════════════════════╗ |
| ║ [[ BOLD CYAN / 1.4X ]] IN SILICO DIAGNOSTICS CONSOLE // PASS 1 OF 3                            ║ |
| ║ [[ BOLD WHITE / 1.3X ]] SWEEP: 284° / 360° [RADAR VECTOR ACTIVE]                                ║ |
| ╚════════════════════════════════════════════════════════════════════════════════════════════════╝ |
|                                                                                                    |
|                                   [[ BOLD CYAN ]] [ GENE A: OK ]                                   |
|                                       G A G T T T T A T C G C   <-- [[ BRIGHT FLASH ILLUMINATION ]] |
|                                     C T T C C A T G A C G C A G                                    |
|                              T A A C                             A A G T                           |
|                          C G T                                       T T C                         |
|                      G C A        [GENE B: OK]                           T T A                     |
|                    A T C                                                   C G C                   |
|                  G C T   [GENE C: OK]                                        T T C                 |
|                A T C            \                              [GENE K: OK]    C A T               |
|               C G T      [D: OK] \------(SWEEP RAY 284°)                         G A C             |
|               T A G               \                                              G C A             |
|    [GENE E:   C G T                \                                             G A A   [GENE G:  |
|      OK]      A T C                 \                                            G T T     OK]     |
|               C G T                  \                                           C C T             |
|               T A G      [J: OK]      \                        [H: OK]           C A C             |
|                A T C                   \                                         G C C             |
|                  G C T   [GENE F: OK]   \                                      A T C               |
|                    T A G                 \                                 G T C                   |
|                      A T C                V                              A G G                     |
|                          C G A                                       T T A                         |
|                              G C T                               A A C                             |
|                                     A T C G G C T A A T C G A T C                                  |
|                                       T A G C C G A T T A G C G                                    |
|                                                                                                    |
| ╔════════════════════════════════════════════════════════════════════════════════════════════════╗ |
| ║ [[ BOLD EMERALD / 1.4X ]] > SCANNING ARCHITECTURE... 11/11 GENES VALIDATED [OK]                ║ |
| ╚════════════════════════════════════════════════════════════════════════════════════════════════╝ |
+----------------------------------------------------------------------------------------------------+
```

### Pass 2 — Host Tropism Reticle (Target Lock: Gene G Bases)
```text
+----------------------------------------------------------------------------------------------------+
| ╔════════════════════════════════════════════════════════════════════════════════════════════════╗ |
| ║ [[ BOLD CYAN  / 1.4X ]] IN SILICO DIAGNOSTICS CONSOLE // PASS 2 OF 3                            ║ |
| ║ [[ BOLD AMBER / 1.3X ]] TARGET LOCUS: GENE G [MAJOR SPIKE PROTEIN - CODONS 2395-2922]           ║ |
| ╚════════════════════════════════════════════════════════════════════════════════════════════════╝ |
|                                                                                                    |
|                          ╔═══════════════════════════════════════╗                                 |
|                          ║ [[ BOLD WHITE / 1.3X ]] CAMERA ZOOM   ║                                 |
|                          ║ LOCUS: GENE G NUCLEOTIDE TRACK        ║                                 |
|                          ║                                       ║                                 |
|                          ║            [ + RETICLE + ]            ║                                 |
|                          ║       ┌───────────────────────┐       ║                                 |
|                          ║       │ [[ BOLD AMBER ]]      │       ║                                 |
|                          ║       │ G T T C C T C A C G C │       ║                                 |
|                          ║       │ C A T C G T C A G G T │       ║                                 |
|                          ║       │ [GENE G SPIKE BASES]  │       ║                                 |
|                          ║       └───────────────────────┘       ║                                 |
|                          ║             [ LOCKED ]                ║                                 |
|                          ║                                       ║                                 |
|                          ║ RESIDUES: 175 AA SPIKE COMPLEX        ║                                 |
|                          ║ RECEPTOR: LPS RECOGNITION MOTIF       ║                                 |
|                          ╚═══════════════════════════════════════╝                                 |
|                                                                                                    |
| ╔════════════════════════════════════════════════════════════════════════════════════════════════╗ |
| ║ [[ BOLD AMBER / 1.4X ]] > ISOLATING SPIKE PROTEIN (GENE G)... HOST TROPISM LOCKED: E. COLI C   ║ |
| ╚════════════════════════════════════════════════════════════════════════════════════════════════╝ |
+----------------------------------------------------------------------------------------------------+
```

### Pass 3 — Diversification Database Match
```text
+----------------------------------------------------------------------------------------------------+
| ╔════════════════════════════════════════════════════════════════════════════════════════════════╗ |
| ║ [[ BOLD CYAN / 1.4X ]] IN SILICO DIAGNOSTICS CONSOLE // PASS 3 OF 3                            ║ |
| ║ [[ BOLD WHITE / 1.3X ]] CROSS-ALIGNMENT VALIDATOR // SYNTHETIC CANDIDATE VS WILD-TYPE PHIX174  ║ |
| ╚════════════════════════════════════════════════════════════════════════════════════════════════╝ |
|                                                                                                    |
| ╔════════════════════════════════════════════╗ ╔═════════════════════════════════════════════════╗ |
| ║ [[ BOLD WHITE ]] CANDIDATE: CAND_8812      ║ ║ [[ BOLD WHITE ]] REFERENCE: NC_001422.1 (WT)    ║ |
| ╚════════════════════════════════════════════╝ ╚═════════════════════════════════════════════════╝ |
| 0001: M S Q V Q Q K L K E L G A S L G          0001: M S Q V Q Q K L K E L G A S L G               |
| 0017: A T D L V A A F S A S D P A T A          0017: A T D L V A A F S A S D P A T A               |
| 0033: Y G N A A L T T S K N L F P N A          0033: Y G N A A L T T S K Y L F P N V  [[* DIFF]]   |
| 0049: V K G V F S A S V D K L A S G D          0049: V K G I F S A S V D K L T S G E  [[* DIFF]]   |
| 0065: Q W R D K M T T L G A V A R A G          0065: Q W R N K M T T L G A I A R A G  [[* DIFF]]   |
|                                                                                                    |
| ══════════════════════════════════════════════════════════════════════════════════════════════════ |
| [[ BOLD WHITE / 1.3X ]] AMINO ACID IDENTITY (AAI) ODOMETER:                                        |
|                                                                                                    |
|   [====================================░░░░░]     ╔═══════════════════════╗                        |
|                                                   ║ [[ BOLD WHITE / 2X ]] ║                        |
|                                                   ║        94.6%          ║                        |
|                                                   ╚═══════════════════════╝                        |
|                                                                                                    |
| ╔════════════════════════════════════════════════════════════════════════════════════════════════╗ |
| ║ [[ BOLD EMERALD / 1.4X ]] > DIVERSIFICATION: PASSED (<95% AAI DIVERGENCE MET) // NOVEL SPECIES ║ |
| ╚════════════════════════════════════════════════════════════════════════════════════════════════╝ |
+----------------------------------------------------------------------------------------------------+
```

---

## Terminal 4: Transformation & Reboot Video Frame (Scene 5)
```text
+----------------------------------------------------------------------------------------------------+
| ┌                                                                                                ┐ |
|                                                      ╔═══════════════════════════════════════════╗ |
|                                                      ║ [[ BOLD WHITE / RED DOT / 1.3X ]]         ║ |
|                                                      ║ REC [●] 00:04:12:19                       ║ |
|                                                      ╚═══════════════════════════════════════════╝ |
|                                                                                                    |
|                               [ FULLSCREEN VIDEO PLAYBACK VIEWPORT ]                               |
|                                                                                                    |
|                          - Bacterial Membrane Permeabilization                                     |
|                          - Plasmid-like DNA Ring Translocation                                     |
|                          - Intracellular Icosahedral Virion Assembly                               |
|                                                                                                    |
|                                                                                                    |
|                                                                                                    |
| └                                                                                                ┘ |
| ╔════════════════════════════════════════════════════════════════════════════════════════════════╗ |
| ║ [[ BOLD CYAN / 1.3X ]] ASSAY: IN VITRO REBOOT // HOST: E. COLI C // STRAIN: SAFE LAB STOCK     ║ |
| ║ [[ BOLD WHITE / 1.1X ]] [SPACEBAR / 5: TOGGLE PLAYBACK]                                        ║ |
| ╚════════════════════════════════════════════════════════════════════════════════════════════════╝ |
+----------------------------------------------------------------------------------------------------+
```
