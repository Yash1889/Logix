import { useState, useRef, useEffect } from 'react';
import GameWrapper from '../components/GameWrapper';
import { useGameScore } from '../hooks/useGameScore';
import { Zap, AlertTriangle, MousePointer } from 'lucide-react';
import './ReactionTime.css';

export default function ReactionTime() {
    const { bestScore, sessionBest, saveScore } = useGameScore('reaction');
    const [gameState, setGameState] = useState('waiting'); // waiting, ready, now, result, early
    const [startTime, setStartTime] = useState(0);
    const [score, setScore] = useState(null);
    const [attempts, setAttempts] = useState([]);
    const [falseStarts, setFalseStarts] = useState(0);

    const timerRef = useRef(null);

    const startGame = () => {
        setGameState('ready');
        setScore(null);
        // Random delay between 2s and 5s
        const randomDelay = Math.floor(Math.random() * 3000) + 2000;

        timerRef.current = setTimeout(() => {
            setGameState('now');
            setStartTime(Date.now());
        }, randomDelay);
    };

    const handleAction = () => {
        if (gameState === 'waiting') {
            startGame();
        } else if (gameState === 'ready') {
            // Early click
            clearTimeout(timerRef.current);
            setGameState('early');
            setFalseStarts(prev => prev + 1);
        } else if (gameState === 'now') {
            // Success
            const endTime = Date.now();
            const reactionTime = endTime - startTime;

            const newAttempts = [...attempts, reactionTime].slice(-5);
            setAttempts(newAttempts);
            setScore(reactionTime);

            const meta = {
                falseStarts,
                recentAverage: Math.round(newAttempts.reduce((a, b) => a + b, 0) / newAttempts.length),
                attemptsCount: newAttempts.length
            };

            saveScore(reactionTime, true, meta); // Lower is better
            setGameState('result');
        } else if (gameState === 'result' || gameState === 'early') {
            startGame();
        }
    };

    const handleRestart = () => {
        clearTimeout(timerRef.current);
        setGameState('waiting');
        setScore(null);
        setAttempts([]);
        setFalseStarts(0);
    };

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space') {
                e.preventDefault(); // Prevent scrolling
                e.stopPropagation();
                if (gameState !== 'waiting') { // Prevent accidental start on space if focused elsewhere? No, global is fine for this game.
                    handleAction();
                } else {
                    handleAction();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            clearTimeout(timerRef.current);
        };
    }, [gameState]); // Dependency needed to access current gameState in closure if not using refs, but here handleAction uses state.

    return (
        <GameWrapper
            title="Reaction Time"
            description="Measure your visual reflexes. Wait for the green signal."
            onRestart={handleRestart}
            score={score ? `${score} ms` : null}
            bestScore={bestScore ? `${bestScore} ms` : null}
            sessionBest={sessionBest ? `${sessionBest} ms` : null}
        >
            <div
                className={`reaction-game-area ${gameState}`}
                onMouseDown={handleAction}
            >
                <div className="reaction-content">
                    {gameState === 'waiting' && (
                        <>
                            <Zap size={64} className="reaction-icon" />
                            <h2>INITIATE SEQUENCE</h2>
                            <p>Click or press SPACE to start.</p>
                            <p className="instruction-sub">Wait for the green signal, then react immediately.</p>
                        </>
                    )}

                    {gameState === 'ready' && (
                        <>
                            <div className="pulse-loader"></div>
                            <h2>AWAIT SIGNAL...</h2>
                        </>
                    )}

                    {gameState === 'now' && (
                        <>
                            <h2>EXECUTE!</h2>
                            <p>CLICK NOW</p>
                        </>
                    )}

                    {gameState === 'result' && (
                        <>
                            <div className="result-display">
                                <span className="result-val">{score}</span>
                                <span className="result-unit">ms</span>
                            </div>
                            <p>Click to re-test</p>
                            {falseStarts > 0 && (
                                <div className="reaction-meta-warning">
                                    <AlertTriangle size={16} />
                                    <span>FALSE_STARTS_DETECTED: {falseStarts}</span>
                                </div>
                            )}
                        </>
                    )}

                    {gameState === 'early' && (
                        <>
                            <AlertTriangle size={64} className="reaction-icon" />
                            <h2>PREMATURE INPUT</h2>
                            <p>Signal was not active.</p>
                            <p>Click to retry.</p>
                        </>
                    )}
                </div>
            </div>
        </GameWrapper>
    );
}
