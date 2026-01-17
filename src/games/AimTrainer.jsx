import { useState, useRef } from 'react';
import GameWrapper from '../components/GameWrapper';
import { useGameScore } from '../hooks/useGameScore';
import { Target, Crosshair } from 'lucide-react';
import './AimTrainer.css';

const TOTAL_TARGETS = 30;

export default function AimTrainer() {
    const { bestScore, sessionBest, saveScore } = useGameScore('aim-trainer');
    const [gameState, setGameState] = useState('waiting'); // waiting, playing, result
    const [targetsLeft, setTargetsLeft] = useState(TOTAL_TARGETS);
    const [startTime, setStartTime] = useState(0);
    const [targetPos, setTargetPos] = useState({ top: '50%', left: '50%' });
    const [score, setScore] = useState(null); // Average ms per target

    // Metrics
    const [misses, setMisses] = useState(0);
    const [hits, setHits] = useState(0);

    const moveTarget = () => {
        const top = Math.random() * 80 + 10;
        const left = Math.random() * 80 + 10;
        setTargetPos({ top: `${top}%`, left: `${left}%` });
    };

    const handleBackgroundClick = () => {
        if (gameState === 'playing') {
            setMisses(prev => prev + 1);
        }
    };

    const handleTargetClick = (e) => {
        e.stopPropagation(); // Prevent background click (miss)

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

                // Calculate accuracy
                const totalClicks = hits + 1 + misses; // +1 for this current hit
                const accuracy = Math.round(((hits + 1) / totalClicks) * 100);

                const meta = {
                    misses: misses,
                    accuracy: accuracy,
                    totalTime: totalTime
                };

                saveScore(avgTime, true, meta); // Lower is better (ms)
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
            description={`Click ${TOTAL_TARGETS} targets as quickly as you can.`}
            onRestart={handleRestart}
            score={score ? `${score} ms` : null}
            bestScore={bestScore ? `${bestScore} ms` : null}
            sessionBest={sessionBest ? `${sessionBest} ms` : null}
        >
            <div className="aim-trainer-container" onMouseDown={handleBackgroundClick}>
                {gameState === 'waiting' && (
                    <div className="aim-overlay">
                        <Target size={64} className="aim-icon-large" />
                        <h2>Click the target to start</h2>
                        <div
                            className="aim-target start"
                            style={{ top: '50%', left: '50%' }}
                            onMouseDown={handleTargetClick}
                        >
                            <Target size={40} />
                        </div>
                    </div>
                )}

                {gameState === 'playing' && (
                    <div className="aim-play-area">
                        <div className="aim-UI">
                            <div className="aim-counter">Remaining: {targetsLeft}</div>
                            <div className="aim-misses">Misses: {misses}</div>
                        </div>
                        <div
                            className="aim-target"
                            style={{ top: targetPos.top, left: targetPos.left }}
                            onMouseDown={handleTargetClick}
                        >
                            <Target size={80} strokeWidth={1} />
                            <div className="aim-bullseye"></div>
                        </div>
                    </div>
                )}

                {gameState === 'result' && (
                    <div className="aim-result">
                        <Crosshair size={64} className="aim-icon-large" />
                        <h1>{score} ms</h1>
                        <p>Average time per target</p>
                        <div className="aim-stats-grid">
                            <div className="aim-stat">
                                <span>Accuracy</span>
                                <strong>{Math.round((TOTAL_TARGETS / (TOTAL_TARGETS + misses)) * 100)}%</strong>
                            </div>
                            <div className="aim-stat">
                                <span>Misses</span>
                                <strong>{misses}</strong>
                            </div>
                        </div>
                        <button className="aim-btn" onClick={handleRestart}>Try Again</button>
                    </div>
                )}
            </div>
        </GameWrapper>
    );
}
