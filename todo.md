## Full Terminal Technical Requirements Specification

---

### Terminal 1: Raw Nucleotide Ingestion Stream

* **Placement:** Scene 1 (Dual monitor background glow; transitions physical DNA to digital tokens).
* **Display Mode:** Fullscreen auto-scrolling terminal canvas.
* **Functional Requirements:**
* **DNA Base Matrix:** Continuous vertical/horizontal stream of monospace `A`, `C`, `T`, `G` characters flowing across the full width and height.
* **Color Gradients:** Phosphor terminal green scheme with subtle distinct shades for each base:
* `A`: `#00FF66`
* `T`: `#00CC55`
* `C`: `#33FF88`
* `G`: `#009944`


* **FASTA & Model Logging Injection:** Intermittent log banners appearing every 8–12 lines:
* `>seq_read_09821 [phiX174_ref_anchor: 5386bp]`

* `0001: G A G T T T T A T C G C T T C C A T G A C G C A G A A G T T`

* `[TOKENIZER_STREAM]: 4,096 tokens/sec | seq_window: 131,072 nt`



* **Visual Polish:** CRT scanline overlay (CSS repeating linear gradient) and faint green glow (`text-shadow: 0 0 8px rgba(0, 255, 102, 0.6)`).



---

### Terminal 2: Interactive Prompt & Next-Token Generation

* **Placement:** Scene 2 & Scene 3 (Direct camera close-up on monitor).
* **Display Mode:** Interactive terminal view with state-driven transitions.
* **Functional Requirements:**
* **State 1 — Typing Sequence (Scene 2):**
* Blinking rectangular cursor (`_` or `█`).
* Mechanical typing effect printing: `> GAGTTTTATCG`.


* Fixed pause on completion with cursor pulsing at 1 Hz.


* **State 2 — Token Probability HUD (Scene 3 Beat 1):**
* Pinned tooltip directly above the active cursor.
* 4 vertical dynamic progress bars for `A`, `C`, `T`, `G`.


* Fluctuating random values that lock with `C` spiking to **84%**, instantly appending `C` to the sequence.


* **State 3 — Hyper-Speed Stream (Scene 3 Beat 2):**
* Full terminal bursts into a rapid stream of random `A, C, T, G` characters generated across 15–20 rows at ~60 FPS.


* Speed accelerates over 3 seconds to represent 5,400 bases generating.




* **State 4 — Vector Circular Ring Morph (Scene 3 Beat 3):**
* High-speed character stream wraps and snaps into a centralized circular vector ring:
* Arc length represents **5,386 bp** (or `5.4 kb`).


* Distinct segmented arcs representing the 11 core viral genes (A, A*, B, C, D, E, J, F, G, H, K).


* Ring slowly rotates on its center axis ($360^\circ$ rotation every 20s).







---

### Terminal 3: In Silico Screening Diagnostics

* **Placement:** Scene 4 (Diagnostics and computational filtering).
* **Display Mode:** High-contrast technical diagnostic console built over the circular genome ring from Terminal 2.


* **Functional Requirements:**
* **Pass 1 — Genetic Architecture Scanline:**
* A radar sweep line rotating $0^\circ \rightarrow 360^\circ$ over the circular genome.
* Each of the 11 gene segments flashes bright white/green when intersected by the sweep line.


* Bottom diagnostic readout: `> SCANNING ARCHITECTURE... 11/11 GENES VALIDATED [OK]`.




* **Pass 2 — Host Tropism Reticle (Target Lock):**
* Camera/canvas zoom focusing directly onto **Gene G** (spike protein) on the ring.


* Animated SVG target reticle/crosshair snaps over the Gene G sector.


* Gene G shifts color to warning amber/red.
* Bottom diagnostic readout: `> ISOLATING SPIKE PROTEIN (GENE G)... HOST TROPISM LOCKED: E. COLI C`.




* **Pass 3 — Diversification Database Match:**
* Split terminal layout: Left side displays generated candidate; right side displays natural reference alignment.


* Digital countdown odometer ticker rapidly dropping from `100.0%` down to `< 94.7%`.


* Status pill: `> DIVERSIFICATION: PASSED (<95% AAI DIVERGENCE MET) // NOVEL SPECIES`.







---

### Terminal 4: Transformation & Reboot Video Frame

* **Placement:** Scene 5 (Background monitor behind Scientist holding the microcentrifuge tube).
* **Display Mode:** Fullscreen video player shell with a custom diagnostic HUD overlay.
* **Functional Requirements:**
* **Media Playback:**
* Fullscreen HTML5 `<video>` running borderless (`object-cover w-full h-full`).
* Sourced/rendered animation showing bacterial membrane permeability, plasmid-like DNA ring entering *E. coli*, and viral icosahedral assembly inside the cell.




* **Diagnostic HUD Frame (SVG/CSS Overlay):**
* Corner framing reticles on all four screen corners.
* Top-right live recording indicator: `REC [●] 00:04:12:19`.
* Bottom diagnostic bar: `ASSAY: IN VITRO REBOOT // HOST: E. COLI C // STRAIN: SAFE LAB STOCK`.




* **Playback Hotkeys:** Keyboard listeners binding `Spacebar` or `5` to trigger `play()` / `pause()`.



---

### System Control & Orchestration Architecture

* **Single Web App Controller:** A single Next.js / React page accessible on a local port (e.g., `localhost:3000`).
* **Scene Switcher:** Bind number keys `1`, `2`, `3`, `4`, `5` to switch active terminal states instantly during shooting:
* Key `1` $\rightarrow$ Terminal 1 (Raw DNA Stream)
* Key `2` $\rightarrow$ Terminal 2 - State 1 (Prompt Typing)


* Key `3` $\rightarrow$ Terminal 2 - States 2 to 4 (HUD $\rightarrow$ Acceleration $\rightarrow$ Ring)


* Key `4` $\rightarrow$ Terminal 3 (Screening Passes 1, 2, 3)


* Key `5` $\rightarrow$ Terminal 4 (Transformation Video Player)