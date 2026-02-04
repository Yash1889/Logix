import { useState, useEffect, useRef } from 'react';
import GameWrapper from '../components/GameWrapper';
import { useGameScore } from '../hooks/useGameScore';
import { motion } from 'framer-motion';
import { Grid3x3, RefreshCw } from 'lucide-react';
import './SequenceMemory.css';

export default function SequenceMemory() {
    const { bestScore, sessionBest, saveScore } = useGameScore('sequence-memory');
    const [gameState, setGameState] = useState('waiting'); // waiting, displaying, playing, result
    const [level, setLevel] = useState(1);
    const [sequence, setSequence] = useState([]);
    const [userSequence, setUserSequence] = useState([]);
    const [activeWait, setActiveWait] = useState(false); // To block interaction during display
    const [activeIndex, setActiveIndex] = useState(null); // Which tile is lighting up?

    // 3x3 Grid
    const GRID_SIZE = 9;

    const startLevel = (lvl) => {
        setGameState('displaying');
        setActiveWait(true);
        setUserSequence([]);
        setActiveIndex(null);

        // Add one new step to sequence
        const nextStep = Math.floor(Math.random() * GRID_SIZE);

        let newSequence;
        if (lvl === 1) {
            newSequence = [nextStep];
        } else {
            newSequence = [...sequence, nextStep];
        }
        setSequence(newSequence);

        // Play Sequence
        let step = 0;

        // Initial delay before playing
        setTimeout(() => {
            const interval = setInterval(() => {
                if (step >= newSequence.length) {
                    clearInterval(interval);
                    setActiveIndex(null);
                    setTimeout(() => {
                        setGameState('playing');
                        setActiveWait(false);
                    }, 500);
                    return;
                }

                // Highlight
                const tileIndex = newSequence[step];
                setActiveIndex(tileIndex);

                // Turn off highlight quickly
                setTimeout(() => setActiveIndex(null), 400);

                step++;
            }, 800); // Slower, clearer cadence
        }, 800);
    };

    const handleTileClick = (index) => {
        if (gameState !== 'playing' || activeWait) return;

        // Visual feedback immediate
        // We can use a separate state or just rely on active effect via CSS :active
        // But for consistency let's flash it via state if we want controlled timing, 
        // but User expects instant tap. :active is better.

        const expected = sequence[userSequence.length];

        if (index === expected) {
            const newUserSeq = [...userSequence, index];
            setUserSequence(newUserSeq);

            if (newUserSeq.length === sequence.length) {
                // Level Complete
                const nextLevel = level + 1;
                setLevel(nextLevel);
                setActiveWait(true);
                setGameState('displaying'); // Transition state to prevent clicks
                setTimeout(() => {
                    startLevel(nextLevel);
                }, 1000);
            }
        } else {
            // Fail
            endGame();
        }
    };

    const endGame = () => {
        const meta = {
            maxSequence: level
        };
        saveScore(level, false, meta);
        setGameState('result');
    };

    const startGame = () => {
        setLevel(1);
        setSequence([]);
        startLevel(1);
    };

    return (
        <GameWrapper
            title="Sequence Memory"
            description="Replicate the pattern exactly."
            onRestart={startGame}
            score={`Level ${level}`}
            bestScore={bestScore ? `Lvl ${bestScore}` : null}
            sessionBest={sessionBest ? `Lvl ${sessionBest}` : null}
        >
            <div className="sm-container">
                {gameState === 'waiting' && (
                    <div className="sm-overlay">
                        <Grid3x3 size={64} className="sm-icon" />
                        <h2>PATTERN REPLICATION</h2>
                        <p>Memorize the sequence order.</p>
                        <button className="sm-btn-start" onClick={startGame}>INITIALIZE</button>
                    </div>
                )}

                {(gameState === 'displaying' || gameState === 'playing' || gameState === 'result') && (
                    <div className={`sm-play-area ${gameState === 'result' ? 'blur' : ''}`}>
                        <div className="sm-grid">
                            {Array.from({ length: GRID_SIZE }).map((_, i) => {
                                const isActive = activeIndex === i;
                                return (
                                    <div
                                        key={i}
                                        className={`sm-tile ${isActive ? 'active' : ''}`}
                                        onClick={() => handleTileClick(i)}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}

                {gameState === 'result' && (
                    <div className="sm-result-panel">
                        <div className="result-display">
                            <span className="result-val">{level}</span>
                            <span className="result-unit">STEPS</span>
                        </div>
                        <button className="sm-retry-btn" onClick={startGame}>
                            RE-INITIALIZE
                        </button>
                    </div>
                )}
            </div>
        </GameWrapper>
    );
}
