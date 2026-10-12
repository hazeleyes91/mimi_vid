import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Terminal4Props {
  videoSrc?: string;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
}

export const Terminal4: React.FC<Terminal4Props> = ({ videoSrc, isPlaying: externalPlaying, onTogglePlay }) => {
  const [internalPlaying, setInternalPlaying] = useState(true);
  const isPlaying = externalPlaying !== undefined ? externalPlaying : internalPlaying;

  const [activeKeyframe, setActiveKeyframe] = useState<number>(0);
  const [keyframeLabel, setKeyframeLabel] = useState<string>('KEYFRAME 0: BROWNIAN DRIFT & SURFACE RECOGNITION');

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
    }, 1000 / 30);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const formattedTimecode = `${String(timecode.h).padStart(2, '0')}:${String(timecode.m).padStart(2, '0')}:${String(timecode.s).padStart(2, '0')}:${String(timecode.frames).padStart(2, '0')}`;

  const containerRef = useRef<HTMLDivElement | null>(null);

  // =========================================================================
  // RIGOROUS 3D THREE.JS SIMULATION OF BACTERIAL DNA UPTAKE
  // =========================================================================
  useEffect(() => {
    if (videoSrc) return;
    const container = containerRef.current;
    if (!container) return;

    // Scene & Camera (Confocal fluorescence perspective)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020805);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(-8.5, 4.2, 13.5);
    camera.lookAt(-0.5, 0.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Darkfield / Confocal Fluorescence Lighting
    const ambientLight = new THREE.AmbientLight(0x0a2215, 1.8);
    scene.add(ambientLight);

    const rimLight = new THREE.DirectionalLight(0x00ff88, 1.5);
    rimLight.position.set(10, 15, 10);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0x004488, 1.2);
    fillLight.position.set(-15, -10, -5);
    scene.add(fillLight);

    // Pore Localized Electrostatic Light
    const poreLight = new THREE.PointLight(0x00ffff, 0, 12, 1.5);
    poreLight.position.set(-0.2, 1.6, 2.5);
    scene.add(poreLight);

    // -----------------------------------------------------------------------
    // 1. ROD-SHAPED BACILLUS (Dual-Membrane Envelope Architecture)
    // -----------------------------------------------------------------------
    const cellGroup = new THREE.Group();
    cellGroup.position.set(3.8, 0, 0);
    cellGroup.rotation.z = Math.PI / 2; // Lie along X axis
    scene.add(cellGroup);

    // A. Outer Membrane (OM) with LPS layer
    const omGeo = new THREE.CapsuleGeometry(3.2, 7.5, 32, 64);
    const omMat = new THREE.MeshPhysicalMaterial({
      color: 0x052e18,
      emissive: 0x021408,
      roughness: 0.35,
      metalness: 0.1,
      transmission: 0.55,
      opacity: 0.82,
      transparent: true,
      depthWrite: false,
    });
    const omMesh = new THREE.Mesh(omGeo, omMat);
    cellGroup.add(omMesh);

    // Surface LPS Nodules (Instanced Lipid A / O-antigen beads)
    const lpsCount = 420;
    const lpsGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const lpsMat = new THREE.MeshStandardMaterial({
      color: 0x00ff66,
      emissive: 0x00441a,
      roughness: 0.5,
    });
    const lpsInstanced = new THREE.InstancedMesh(lpsGeo, lpsMat, lpsCount);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < lpsCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 7.5;
      const r = 3.22 + Math.random() * 0.12;
      dummy.position.set(r * Math.cos(theta), y, r * Math.sin(theta));
      const s = 0.8 + Math.random() * 0.6;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      lpsInstanced.setMatrixAt(i, dummy.matrix);
    }
    lpsInstanced.instanceMatrix.needsUpdate = true;
    cellGroup.add(lpsInstanced);

    // B. Periplasmic Peptidoglycan (PG) Mesh Lattice
    const pgGeo = new THREE.CapsuleGeometry(2.95, 7.3, 24, 48);
    const pgMat = new THREE.MeshBasicMaterial({
      color: 0x22aa66,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
    });
    const pgMesh = new THREE.Mesh(pgGeo, pgMat);
    cellGroup.add(pgMesh);

    // C. Inner Plasma Membrane (IM)
    const imGeo = new THREE.CapsuleGeometry(2.7, 7.1, 24, 48);
    const imMat = new THREE.MeshStandardMaterial({
      color: 0x021a0e,
      roughness: 0.6,
      transparent: true,
      opacity: 0.65,
    });
    const imMesh = new THREE.Mesh(imGeo, imMat);
    cellGroup.add(imMesh);

    // D. Cytoplasmic Nucleoid Chromatin Density Fibrils
    const fibrilGeo = new THREE.BufferGeometry();
    const fibrilPoints: number[] = [];
    for (let i = 0; i < 280; i++) {
      const theta = Math.random() * Math.PI * 2;
      const rad = Math.random() * 2.1;
      const y = (Math.random() - 0.5) * 5.5;
      fibrilPoints.push(rad * Math.cos(theta), y, rad * Math.sin(theta));
    }
    fibrilGeo.setAttribute('position', new THREE.Float32BufferAttribute(fibrilPoints, 3));
    const fibrilMat = new THREE.PointsMaterial({
      color: 0x00ffa8,
      size: 0.08,
      transparent: true,
      opacity: 0.35,
    });
    const fibrilCloud = new THREE.Points(fibrilGeo, fibrilMat);
    cellGroup.add(fibrilCloud);

    // -----------------------------------------------------------------------
    // 2. MEMBRANE CHANNELS: PilQ/ComEx Outer Secretin & ComEC Translocase
    // -----------------------------------------------------------------------
    const poreLocus = new THREE.Vector3(-0.2, 1.6, 2.5);

    // PilQ / ComEx Outer Membrane Secretin Ring (~6-8 nm lumen)
    const secretinRingGeo = new THREE.TorusGeometry(0.65, 0.22, 16, 32);
    const secretinMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      emissive: 0x004455,
      roughness: 0.2,
      metalness: 0.3,
    });
    const secretinRing = new THREE.Mesh(secretinRingGeo, secretinMat);
    secretinRing.position.copy(poreLocus);
    secretinRing.rotation.x = Math.PI / 2.8;
    secretinRing.rotation.y = -Math.PI / 4;
    scene.add(secretinRing);

    // 12 Dodecameric Subunit Beads around Secretin Pore
    for (let i = 0; i < 12; i++) {
      const ang = (i / 12) * Math.PI * 2;
      const beadGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.35, 8);
      const bead = new THREE.Mesh(beadGeo, secretinMat);
      bead.position.set(0.65 * Math.cos(ang), 0.65 * Math.sin(ang), 0);
      secretinRing.add(bead);
    }

    // ComEC Inner Membrane Translocase Ring
    const comEcGeo = new THREE.TorusGeometry(0.55, 0.18, 16, 24);
    const comEcMat = new THREE.MeshStandardMaterial({
      color: 0x00ffaa,
      emissive: 0x003322,
      roughness: 0.3,
    });
    const comEcRing = new THREE.Mesh(comEcGeo, comEcMat);
    comEcRing.position.set(0.4, 1.4, 2.1);
    comEcRing.rotation.copy(secretinRing.rotation);
    scene.add(comEcRing);

    // Trans-envelope Channel Conduit
    const conduitGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.7, 16, 1, true);
    const conduitMat = new THREE.MeshBasicMaterial({
      color: 0x00cc77,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const conduit = new THREE.Mesh(conduitGeo, conduitMat);
    conduit.position.set(0.1, 1.5, 2.3);
    conduit.rotation.copy(secretinRing.rotation);
    scene.add(conduit);

    // Transient Poration Halo / Depolarization Glow Ring
    const porationHaloGeo = new THREE.RingGeometry(0.3, 1.3, 32);
    const porationHaloMat = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const porationHalo = new THREE.Mesh(porationHaloGeo, porationHaloMat);
    porationHalo.position.copy(poreLocus);
    porationHalo.rotation.copy(secretinRing.rotation);
    scene.add(porationHalo);

    // -----------------------------------------------------------------------
    // 3. DNA SUBSTRATE: Supercoiled Plasmid Loop with Helical Base Periodicity
    // -----------------------------------------------------------------------
    const NUM_DNA_POINTS = 64;
    const basePairsCount = 72;

    // Backbone tube geometry
    let dnaCurve = new THREE.CatmullRomCurve3(
      Array.from({ length: NUM_DNA_POINTS }, () => new THREE.Vector3())
    );
    dnaCurve.closed = true;

    const dnaMat = new THREE.MeshStandardMaterial({
      color: 0x00ffaa,
      emissive: 0x00bb66,
      emissiveIntensity: 0.75,
      roughness: 0.25,
      metalness: 0.1,
    });

    let dnaMesh = new THREE.Mesh(new THREE.BufferGeometry(), dnaMat);
    scene.add(dnaMesh);

    // Helical base pair rungs (periodic ladder rungs across dsDNA)
    const bpGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.32, 6);
    const bpMat = new THREE.MeshStandardMaterial({
      color: 0x33ff88,
      emissive: 0x008844,
      roughness: 0.3,
    });
    const bpInstanced = new THREE.InstancedMesh(bpGeo, bpMat, basePairsCount);
    scene.add(bpInstanced);

    // -----------------------------------------------------------------------
    // 4. ANIMATION & 5-KEYFRAME PHYSICS ENGINE
    // -----------------------------------------------------------------------
    let animId: number;
    let clock = new THREE.Clock();
    let cycleTime = 0;
    const CYCLE_DURATION = 16.0; // 16-second complete loop

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    const render = () => {
      const delta = clock.getDelta();
      if (isPlaying) {
        cycleTime = (cycleTime + delta) % CYCLE_DURATION;
      }
      const u = cycleTime / CYCLE_DURATION; // 0.0 -> 1.0 phase

      // Determine active keyframe stage
      let currentKf = 0;
      let label = '';
      if (u < 0.20) {
        currentKf = 0;
        label = 'KEYFRAME 0: BROWNIAN FLUCTUATION // SURFACE RECOGNITION AT BACTERIAL POLE';
      } else if (u < 0.35) {
        currentKf = 1;
        label = 'KEYFRAME 1: PILQ/COMEX SECRETIN COMPLEX TRANSIENT PORATION // ELECTROSTATIC GLOW';
      } else if (u < 0.55) {
        currentKf = 2;
        label = 'KEYFRAME 2: HYDRODYNAMIC SHEAR // TOPOLOGICAL HAIRPIN LOOP DEFORMATION (6-8nm)';
      } else if (u < 0.80) {
        currentKf = 3;
        label = 'KEYFRAME 3: PERIPLASMIC THREADING & COMEC TRANSLOCASE RATCHETING ENTRY';
      } else {
        currentKf = 4;
        label = 'KEYFRAME 4: PORE RESEALING // PLASMID CYTOPLASMIC NEGATIVE SUPERCOILING RELAXATION';
      }
      setActiveKeyframe(currentKf);
      setKeyframeLabel(label);

      // Low-Reynolds-number microfluidic flutter
      const brownianX = Math.sin(cycleTime * 17) * 0.05 + Math.cos(cycleTime * 29) * 0.03;
      const brownianY = Math.cos(cycleTime * 23) * 0.05 + Math.sin(cycleTime * 31) * 0.03;
      const brownianZ = Math.sin(cycleTime * 19) * 0.04;

      // Outer membrane fluid-mosaic ripple
      omMat.roughness = 0.35 + Math.sin(cycleTime * 3) * 0.06;

      // Poration flare & electrostatic light
      if (currentKf === 1) {
        const kfProgress = (u - 0.20) / 0.15;
        const flare = Math.sin(kfProgress * Math.PI);
        poreLight.intensity = flare * 8.5 + (Math.random() * 1.2);
        porationHaloMat.opacity = flare * 0.85;
        const scaleVal = 1.0 + flare * 0.5;
        porationHalo.scale.set(scaleVal, scaleVal, scaleVal);
        secretinMat.emissiveIntensity = 1.0 + flare * 2.0;
      } else {
        poreLight.intensity = Math.max(0, poreLight.intensity * 0.9);
        porationHaloMat.opacity = Math.max(0, porationHaloMat.opacity * 0.85);
        secretinMat.emissiveIntensity = 0.5;
      }

      // ---------------------------------------------------------------------
      // DYNAMIC DNA TOPOLOGY & TRAJECTORY COMPUTATION
      // ---------------------------------------------------------------------
      const pts: THREE.Vector3[] = [];

      if (currentKf === 0) {
        // KF0: Circular supercoiled ring drifting near pole
        const prog = u / 0.20;
        const cx = -6.2 + prog * 2.2 + brownianX;
        const cy = 2.4 + Math.sin(prog * Math.PI) * 0.3 + brownianY;
        const cz = 3.6 + brownianZ;
        const radius = 1.85;

        for (let i = 0; i < NUM_DNA_POINTS; i++) {
          const theta = (i / NUM_DNA_POINTS) * Math.PI * 2;
          const supercoilFlutter = Math.sin(theta * 8 + cycleTime * 5) * 0.16;
          const px = cx + (radius + supercoilFlutter) * Math.cos(theta) * 0.6;
          const py = cy + (radius + supercoilFlutter) * Math.sin(theta);
          const pz = cz + (radius + supercoilFlutter) * Math.cos(theta) * 0.8;
          pts.push(new THREE.Vector3(px, py, pz));
        }
      } else if (currentKf === 1) {
        // KF1: Approaching the secretin channel mouth
        const prog = (u - 0.20) / 0.15;
        const cx = -4.0 + prog * 2.2 + brownianX * 0.5;
        const cy = 2.4 - prog * 0.5 + brownianY * 0.5;
        const cz = 3.6 - prog * 0.7 + brownianZ * 0.5;
        const radius = 1.75;

        for (let i = 0; i < NUM_DNA_POINTS; i++) {
          const theta = (i / NUM_DNA_POINTS) * Math.PI * 2;
          const supercoilFlutter = Math.sin(theta * 8 + cycleTime * 7) * 0.18;
          const px = cx + (radius + supercoilFlutter) * Math.cos(theta) * 0.55;
          const py = cy + (radius + supercoilFlutter) * Math.sin(theta);
          const pz = cz + (radius + supercoilFlutter) * Math.cos(theta) * 0.75;
          pts.push(new THREE.Vector3(px, py, pz));
        }
      } else if (currentKf === 2) {
        // KF2: Hydrodynamic shear deformation into an elongated hairpin loop
        const prog = (u - 0.35) / 0.20;
        const tipX = -1.8 + prog * 1.5;
        const tipY = 1.9 - prog * 0.2;
        const tipZ = 2.9 - prog * 0.3;

        // Elongated hairpin curve (compressed width, stretched length)
        const loopLen = 3.8;
        const halfWidth = THREE.MathUtils.lerp(1.7, 0.26, prog);

        for (let i = 0; i < NUM_DNA_POINTS; i++) {
          const tPos = (i / NUM_DNA_POINTS) * 2; // 0 to 2
          let xOffset: number;
          let yOffset: number;
          let zOffset: number;

          if (tPos <= 1) {
            // Forward arm
            xOffset = tipX - tPos * loopLen;
            yOffset = tipY + Math.sin(tPos * Math.PI) * halfWidth;
            zOffset = tipZ + Math.cos(tPos * Math.PI) * halfWidth * 0.7;
          } else {
            // Return arm
            const rev = 2 - tPos;
            xOffset = tipX - rev * loopLen;
            yOffset = tipY - Math.sin(rev * Math.PI) * halfWidth;
            zOffset = tipZ - Math.cos(rev * Math.PI) * halfWidth * 0.7;
          }

          // Helical micro-twist along hairpin backbone
          const twist = Math.sin(i * 0.8 + cycleTime * 8) * 0.08;
          pts.push(new THREE.Vector3(xOffset, yOffset + twist, zOffset + twist));
        }
      } else if (currentKf === 3) {
        // KF3: Translocation & Entry: Threading linearly through PilQ pore into cytoplasm
        const prog = (u - 0.55) / 0.25;
        const startX = -0.3 + prog * 4.2; // Penetrating from -0.3 to 3.9
        const pathY = 1.6;
        const pathZ = 2.4;

        const loopLen = 3.8;
        const halfWidth = 0.24;

        for (let i = 0; i < NUM_DNA_POINTS; i++) {
          const tPos = (i / NUM_DNA_POINTS) * 2;
          let xVal: number;
          let yVal: number;
          let zVal: number;

          if (tPos <= 1) {
            xVal = startX - tPos * loopLen;
            yVal = pathY + Math.sin(tPos * Math.PI) * halfWidth;
            zVal = pathZ + Math.cos(tPos * Math.PI) * halfWidth * 0.6;
          } else {
            const rev = 2 - tPos;
            xVal = startX - rev * loopLen;
            yVal = pathY - Math.sin(rev * Math.PI) * halfWidth;
            zVal = pathZ - Math.cos(rev * Math.PI) * halfWidth * 0.6;
          }

          // Draw tension ratcheting ripple
          const ratchet = Math.sin(i * 0.9 - cycleTime * 20) * 0.05;
          pts.push(new THREE.Vector3(xVal, yVal + ratchet, zVal + ratchet));
        }
      } else {
        // KF4: Post-uptake relaxation inside cytoplasm into negative supercoiling
        const prog = (u - 0.80) / 0.20;
        const cx = 3.9 + prog * 0.8;
        const cy = 1.3 - prog * 0.6;
        const cz = 1.8 - prog * 0.6;

        // Relax from hairpin width (0.24) back to circular supercoil (1.5)
        const radius = THREE.MathUtils.lerp(0.5, 1.6, prog);
        const squish = THREE.MathUtils.lerp(0.2, 1.0, prog);

        for (let i = 0; i < NUM_DNA_POINTS; i++) {
          const theta = (i / NUM_DNA_POINTS) * Math.PI * 2;
          const supercoil = Math.sin(theta * 9 + cycleTime * 4) * (0.12 + prog * 0.1);
          const px = cx + (radius + supercoil) * Math.cos(theta) * squish * 0.7;
          const py = cy + (radius + supercoil) * Math.sin(theta);
          const pz = cz + (radius + supercoil) * Math.cos(theta) * squish * 0.8;
          pts.push(new THREE.Vector3(px, py, pz));
        }
      }

      // Rebuild DNA Tube Geometry
      dnaCurve = new THREE.CatmullRomCurve3(pts);
      dnaCurve.closed = true;
      dnaMesh.geometry.dispose();
      dnaMesh.geometry = new THREE.TubeGeometry(dnaCurve, 80, 0.08, 8, true);

      // Position instanced helical base pairs along the backbone
      const bpDummy = new THREE.Object3D();
      for (let b = 0; b < basePairsCount; b++) {
        const tVal = b / basePairsCount;
        const pt = dnaCurve.getPointAt(tVal);
        const tangent = dnaCurve.getTangentAt(tVal);

        bpDummy.position.copy(pt);
        bpDummy.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
        bpDummy.rotateZ(tVal * Math.PI * 24 + cycleTime * 3); // Helical periodicity
        bpDummy.scale.set(1, 1, 1);
        bpDummy.updateMatrix();
        bpInstanced.setMatrixAt(b, bpDummy.matrix);
      }
      bpInstanced.instanceMatrix.needsUpdate = true;

      // Slow cinematic camera tracking
      camera.position.x = -8.5 + Math.sin(cycleTime * 0.15) * 0.8;
      camera.position.y = 4.2 + Math.cos(cycleTime * 0.12) * 0.4;
      camera.lookAt(-0.5 + Math.sin(cycleTime * 0.2) * 0.5, 0.2, 0);

      renderer.render(scene, camera);
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [videoSrc, isPlaying]);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#020805' }}>
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
        <div ref={containerRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      )}

      {/* 4-Corner Targeting Reticles */}
      <div style={{ position: 'absolute', top: '24px', left: '24px', width: '48px', height: '48px', borderTop: '3px solid #00E5FF', borderLeft: '3px solid #00E5FF', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '24px', right: '24px', width: '48px', height: '48px', borderTop: '3px solid #00E5FF', borderRight: '3px solid #00E5FF', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '24px', left: '24px', width: '48px', height: '48px', borderBottom: '3px solid #00E5FF', borderLeft: '3px solid #00E5FF', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '24px', right: '24px', width: '48px', height: '48px', borderBottom: '3px solid #00E5FF', borderRight: '3px solid #00E5FF', pointerEvents: 'none' }} />

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
          border: '1.5px solid #00E5FF',
          borderRadius: '5px',
          padding: '8px 20px',
        }}
      >
        <span className="rec-dot" style={{ display: isPlaying ? 'inline-block' : 'none' }} />
        <span className="telemetry-bold telemetry-white" style={{ fontSize: '1.35rem', letterSpacing: '0.05em' }}>
          REC [●] {formattedTimecode}
        </span>
      </div>

      {/* Top-Left Assay Mode */}
      <div style={{ position: 'absolute', top: '32px', left: '80px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span className="telemetry-pill telemetry-cyan" style={{ fontSize: '1.25rem', padding: '6px 16px' }}>
          IN VITRO REBOOT // 3D BACTERIAL DNA UPTAKE SIMULATION
        </span>
        <span className="telemetry-bold telemetry-white" style={{ fontSize: '1.05rem', opacity: 0.9 }}>
          BACILLUS DUAL-MEMBRANE ENVELOPE // PILQ SECRETIN (6-8nm) // COMEC TRANSLOCASE
        </span>
      </div>

      {/* Center Top Keyframe Status Banner */}
      <div
        style={{
          position: 'absolute',
          top: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0, 18, 10, 0.96)',
          border: '2px solid #00FFAA',
          borderRadius: '8px',
          padding: '8px 24px',
          textAlign: 'center',
          boxShadow: '0 4px 16px rgba(0, 255, 170, 0.25)',
        }}
      >
        <div className="telemetry-bold telemetry-emerald" style={{ fontSize: '1.25rem', letterSpacing: '0.03em' }}>
          {keyframeLabel}
        </div>
      </div>

      {/* Bottom Diagnostic Bar (Enlarged) */}
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
          border: '2.5px solid #00E5FF',
          borderRadius: '8px',
          padding: '16px 28px',
        }}
      >
        <div>
          <span className="telemetry-bold telemetry-cyan" style={{ fontSize: '1.45rem', display: 'block', marginBottom: '4px' }}>
            ASSAY: DNA TRANSLOCATION // HOST: E. COLI C // STRAIN: SAFE LAB STOCK
          </span>
          <span className="telemetry-bold telemetry-white" style={{ fontSize: '1.15rem' }}>
            STAGE: KEYFRAME {activeKeyframe}/4 // HELICAL PERIODICITY // LOW-REYNOLDS FLUIDICS
          </span>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span className="telemetry-bold telemetry-emerald" style={{ fontSize: '1.15rem' }}>
            {isPlaying ? 'SIMULATION RUNNING' : 'SIMULATION PAUSED'}
          </span>
          <button
            onClick={togglePlay}
            style={{
              background: '#00FFAA',
              color: '#050B07',
              padding: '8px 20px',
              borderRadius: '5px',
              fontWeight: 800,
              fontSize: '1.05rem',
              cursor: 'pointer',
              border: 'none',
              fontFamily: 'inherit',
            }}
          >
            SPACEBAR: {isPlaying ? 'PAUSE' : 'PLAY'}
          </button>
        </div>
      </div>

      <div className="crt-overlay" />
    </div>
  );
};
