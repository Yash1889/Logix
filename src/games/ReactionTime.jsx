import { useState, useRef, useEffect } from 'react';
import GameWrapper from '../components/GameWrapper';
import { useGameScore } from '../hooks/useGameScore';
import { Zap, AlertTriangle } from 'lucide-react';
import './ReactionTime.css';

export default function ReactionTime() {
    const { bestScore, sessionBest, saveScore } = useGameScore('reaction');
    const [gameState, setGameState] = useState('waiting'); // waiting, ready, now, result, early
    const [startTime, setStartTime] = useState(0);
    const [score, setScore] = useState(null);
    const [attempts, setAttempts] = useState([]); // Store last 5 attempts for average
    const [falseStarts, setFalseStarts] = useState(0);

    const timerRef = useRef(null);

    const startGame = () => {
        setGameState('ready');
        setScore(null);
        const randomDelay = Math.floor(Math.random() * 3000) + 2000; // 2-5 seconds

        timerRef.current = setTimeout(() => {
            setGameState('now');
            setStartTime(Date.now());
        }, randomDelay);
    };

    const handleClick = () => {
        if (gameState === 'waiting') {
            startGame();
        } else if (gameState === 'ready') {
            clearTimeout(timerRef.current);
            setGameState('early');
            setFalseStarts(prev => prev + 1);
        } else if (gameState === 'now') {
            const endTime = Date.now();
            const reactionTime = endTime - startTime;

            // Update score history
            const newAttempts = [...attempts, reactionTime].slice(-5); // Keep last 5
            setAttempts(newAttempts);
            setScore(reactionTime);

            // Calculate average of last 5 or just save this one? 
            // HB usually saves the average of 5. For V2, let's just save every valid attempt 
            // but maybe suggest the user do 5? 
            // Let's stick to saving singular best for now, but log meta.

            const meta = {
                falseStarts: falseStarts,
                recentAverage: newAttempts.reduce((a, b) => a + b, 0) / newAttempts.length,
                attemptsCount: newAttempts.length
            };

            saveScore(reactionTime, true, meta); // true = lower is better
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

    useEffect(() => {
        return () => clearTimeout(timerRef.current);
    }, []);

    return (
        <GameWrapper
            title="Reaction Time"
            description="Test your visual reflexes. Click as soon as the screen turns green."
            onRestart={handleRestart}
            score={score ? `${score} ms` : null}
            bestScore={bestScore ? `${bestScore} ms` : null}
            sessionBest={sessionBest ? `${sessionBest} ms` : null}
        >
            <div
                className={`reaction-game-area ${gameState}`}
                onMouseDown={handleClick}
            >
                <div className="reaction-content">
                    {gameState === 'waiting' && (
                        <>
                            <Zap size={80} className="reaction-icon" />
                            <h2>Click anywhere to start</h2>
                            <p>When the red box turns green, click as quickly as you can.</p>
                        </>
                    )}

                    {gameState === 'ready' && (
                        <>
                            <h2>Wait for green...</h2>
                        </>
                    )}

                    {gameState === 'now' && (
                        <>
                            <h2>CLICK!</h2>
                        </>
                    )}

                    {gameState === 'result' && (
                        <>
                            <Zap size={80} className="reaction-icon" />
                            <h1>{score} ms</h1>
                            <p>Click to try again</p>
                            {falseStarts > 0 && (
                                <div className="reaction-meta-warning">
                                    <AlertTriangle size={16} />
                                    <span>{falseStarts} false start{falseStarts !== 1 ? 's' : ''} recorded</span>
                                </div>
                            )}
                        </>
                    )}

                    {gameState === 'early' && (
                        <>
                            <AlertTriangle size={80} className="reaction-icon" />
                            <h2>Too soon!</h2>
                            <p>Click to try again</p>
                        </>
                    )}
                </div>
            </div>
        </GameWrapper>
    );
}
