import React, { useState, useEffect } from 'react';
import { SceneMode } from './types';
import { Terminal1 } from './components/Terminal1';
import { Terminal2 } from './components/Terminal2';
import { Terminal3 } from './components/Terminal3';
import { Terminal4 } from './components/Terminal4';
import { SceneTransition } from './components/SceneTransition';

export const App: React.FC = () => {
  const [scene, setScene] = useState<SceneMode>('1');
  const [showDock, setShowDock] = useState(true);

  // Transition interstitial state
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingScene, setPendingScene] = useState<SceneMode>('1');

  const switchSceneWithTransition = (target: SceneMode) => {
    if (target === scene && !isTransitioning) return;
    setPendingScene(target);
    setIsTransitioning(true);
  };

  const completeTransition = () => {
    setScene(pendingScene);
    setIsTransitioning(false);
  };

  // Global Key Listener for instant granular scene switching with transitions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)) {
        switchSceneWithTransition(e.key as SceneMode);
      } else if (e.key.toLowerCase() === 'h') {
        setShowDock(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scene, isTransitioning]);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Pre-Scene Code Transition Interstitial */}
      {isTransitioning ? (
        <SceneTransition scene={pendingScene} onComplete={completeTransition} />
      ) : (
        <>
          {/* Active Process Scene Routing */}
          {scene === '1' && <Terminal1 />}
          {scene === '2' && <Terminal2 key="t2-typing" initialState="TYPING" />}
          {scene === '3' && <Terminal2 key="t2-hud" initialState="HUD" />}
          {scene === '4' && <Terminal2 key="t2-stream" initialState="STREAM" />}
          {scene === '5' && <Terminal2 key="t2-ring" initialState="RING" />}
          {scene === '6' && <Terminal3 key="t3-sweep" initialPass="SWEEP" />}
          {scene === '7' && <Terminal3 key="t3-reticle" initialPass="RETICLE" />}
          {scene === '8' && <Terminal3 key="t3-odometer" initialPass="ODOMETER" />}
          {scene === '9' && <Terminal4 />}
        </>
      )}

      {/* On-Set Switcher Dock (Press 'H' to toggle dock visibility) */}
      {showDock && (
        <div className="scene-dock" style={{ flexWrap: 'wrap', maxWidth: '92vw' }}>
          <span style={{ color: '#00E5FF', fontWeight: 800, marginRight: '6px', alignSelf: 'center' }}>
            SCENE:
          </span>
          <button className={`scene-btn ${scene === '1' ? 'active' : ''}`} onClick={() => switchSceneWithTransition('1')}>
            [1] STREAM
          </button>
          <button className={`scene-btn ${scene === '2' ? 'active' : ''}`} onClick={() => switchSceneWithTransition('2')}>
            [2] PROMPT
          </button>
          <button className={`scene-btn ${scene === '3' ? 'active' : ''}`} onClick={() => switchSceneWithTransition('3')}>
            [3] PREDICTION
          </button>
          <button className={`scene-btn ${scene === '4' ? 'active' : ''}`} onClick={() => switchSceneWithTransition('4')}>
            [4] EXPANSION
          </button>
          <button className={`scene-btn ${scene === '5' ? 'active' : ''}`} onClick={() => switchSceneWithTransition('5')}>
            [5] CIRCULAR RING
          </button>
          <button className={`scene-btn ${scene === '6' ? 'active' : ''}`} onClick={() => switchSceneWithTransition('6')}>
            [6] ARCHITECTURE SCAN
          </button>
          <button className={`scene-btn ${scene === '7' ? 'active' : ''}`} onClick={() => switchSceneWithTransition('7')}>
            [7] TROPISM LOCK
          </button>
          <button className={`scene-btn ${scene === '8' ? 'active' : ''}`} onClick={() => switchSceneWithTransition('8')}>
            [8] DIVERSIFICATION
          </button>
          <button className={`scene-btn ${scene === '9' ? 'active' : ''}`} onClick={() => switchSceneWithTransition('9')}>
            [9] REBOOT ASSAY
          </button>
          <span style={{ color: 'rgba(255,255,255,0.4)', marginLeft: '8px', alignSelf: 'center' }}>
            ('H' to hide)
          </span>
        </div>
      )}
    </div>
  );
};
