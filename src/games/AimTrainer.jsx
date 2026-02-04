import { useState, useEffect } from 'react';
import GameWrapper from '../components/GameWrapper';
import { useGameScore } from '../hooks/useGameScore';
import { Target, Crosshair, Disc } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './AimTrainer.css';

const TOTAL_TARGETS = 30;

export default function AimTrainer() {
    const { bestScore, sessionBest, saveScore } = useGameScore('aim-trainer');
    const [gameState, setGameState] = useState('waiting');
    const [targetsLeft, setTargetsLeft] = useState(TOTAL_TARGETS);
    const [startTime, setStartTime] = useState(0);
    const [targetPos, setTargetPos] = useState({ top: '50%', left: '50%' });
    const [score, setScore] = useState(null); // Average ms per target

    // Metrics
    const [misses, setMisses] = useState(0);
    const [hits, setHits] = useState(0);

    const moveTarget = () => {
        // Keep within 10% - 90% to avoid edge clipping
        const top = Math.random() * 80 + 10;
        const left = Math.random() * 80 + 10;
        setTargetPos({ top: `${top}%`, left: `${left}%` });
    };

    const handleBackgroundClick = (e) => {
        if (gameState === 'playing') {
            setMisses(prev => prev + 1);
        }
    };

    const handleTargetClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (gameState === 'waiting') {
            setGameState('playing');
            setTargetsLeft(TOTAL_TARGETS);
            setStartTime(Date.now());
            setMisses(0);
            setHits(0);
            moveTarget();
            return;
        }

        if (gameState === 'playing') {
            const newLeft = targetsLeft - 1;
            setTargetsLeft(newLeft);
            setHits(prev => prev + 1);

            if (newLeft <= 0) {
                const endTime = Date.now();
                const totalTime = endTime - startTime;
                const avgTime = Math.round(totalTime / TOTAL_TARGETS);
                setScore(avgTime);

                const totalClicks = hits + 1 + misses;
                const accuracy = Math.round(((hits + 1) / totalClicks) * 100);

                const meta = {
                    misses: misses,
                    accuracy: accuracy,
                    totalTime: totalTime
                };

                saveScore(avgTime, true, meta);
                setGameState('result');
            } else {
                moveTarget();
            }
        }
    };

    const handleRestart = () => {
        setGameState('waiting');
        setTargetsLeft(TOTAL_TARGETS);
        setScore(null);
        setTargetPos({ top: '50%', left: '50%' });
        setMisses(0);
        setHits(0);
    };

    return (
        <GameWrapper
            title="Aim Trainer"
            description={`Neutralize ${TOTAL_TARGETS} targets. Precision and speed required.`}
            onRestart={handleRestart}
            score={score ? `${score} ms` : null}
            bestScore={bestScore ? `${bestScore} ms` : null}
            sessionBest={sessionBest ? `${sessionBest} ms` : null}
        >
            <div className="aim-trainer-container full-height" onMouseDown={handleBackgroundClick}>
                {gameState === 'waiting' && (
                    <div className="aim-overlay">
                        <Crosshair size={80} className="aim-icon-large" />
                        <h1 className="aim-title">PRECISION TARGETING</h1>
                        <div className="aim-instructions">
                            <p>NEUTRALIZE ALL TARGETS RAPIDLY.</p>
                            <p>MAINTAIN MAXIMUM ACCURACY.</p>
                            <p>MINIMIZE ACQUISITION TIME.</p>
                        </div>
                        <button className="aim-btn-start" onClick={handleRestart}>INITIATE SEQUENCE</button>

                        {/* Start Target */}
                        <motion.div
                            className="aim-target start"
                            style={{ top: '60%', left: '50%' }} // Initial pos
                            onMouseDown={handleTargetClick}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            whileHover={{ scale: 1.1 }}
                        >
                            <div className="target-inner">
                                <Disc size={40} />
                            </div>
                            <div className="target-text">BEGIN</div>
                        </motion.div>
                    </div>
                )}

                {gameState === 'playing' && (
                    <div className="aim-play-area">
                        <div className="aim-hud">
                            <div className="aim-hud-item">
                                <span className="label">REMAINING</span>
                                <span className="value">{targetsLeft}</span>
                            </div>
                            <div className="aim-hud-item">
                                <span className="label">MISSES</span>
                                <span className="value warn">{misses}</span>
                            </div>
                        </div>
                        <motion.div
                            className="aim-target active"
                            style={{ top: targetPos.top, left: targetPos.left }}
                            onMouseDown={handleTargetClick}
                            layout // Smooth transition for position changes if we want, but instant is better for aim training standard
                        // Actually aiming requires instant teleport usually to test reflex, but CSS transition makes it smooth. 
                        // Aim Trainers usually teleport instantly. 
                        // layout prop might make it glide. Let's REMOVE layout if we want instant teleport.
                        // BUT 'style' changes trigger re-render pos.
                        >
                            <Target size={64} strokeWidth={1.5} className="target-svg" />
                            <div className="aim-target-ring"></div>
                        </motion.div>
                    </div>
                )}

                {gameState === 'result' && (
                    <div className="aim-result-panel">
                        <div className="result-display">
                            <span className="result-label">ACQUISITION TIME</span>
                            <span className="result-val">{score}</span>
                            <span className="result-unit">MS/TARGET</span>
                        </div>

                        <div className="aim-stats-grid">
                            <div className="aim-stat">
                                <span className="label">ACCURACY</span>
                                <span className="value">{Math.round((30 / (30 + misses)) * 100)}%</span>
                            </div>
                            <div className="aim-stat">
                                <span className="label">MISSES</span>
                                <span className="value">{misses}</span>
                            </div>
                        </div>

                        <button className="aim-retry-btn" onClick={handleRestart}>
                            RE-INITIALIZE
                        </button>
                    </div>
                )}
            </div>
        </GameWrapper>
    );
}
