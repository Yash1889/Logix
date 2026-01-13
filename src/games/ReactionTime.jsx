import { useState, useRef, useEffect } from 'react';
import GameWrapper from '../components/GameWrapper';
import { useGameScore } from '../hooks/useGameScore';
import { Zap } from 'lucide-react';
import './ReactionTime.css';

export default function ReactionTime() {
    const { bestScore, sessionBest, saveScore } = useGameScore('reaction');
    const [gameState, setGameState] = useState('waiting'); // waiting, ready, now, result, early
    const [startTime, setStartTime] = useState(0);
    const [score, setScore] = useState(null);
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
        } else if (gameState === 'now') {
            const endTime = Date.now();
            const reactionTime = endTime - startTime;
            setScore(reactionTime);
            saveScore(reactionTime, true); // true = lower is better
            setGameState('result');
        } else if (gameState === 'result' || gameState === 'early') {
            startGame();
        }
    };

    const handleRestart = () => {
        clearTimeout(timerRef.current);
        setGameState('waiting');
        setScore(null);
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
                        </>
                    )}

                    {gameState === 'early' && (
                        <>
                            <h2>Too soon!</h2>
                            <p>Click to try again</p>
                        </>
                    )}
                </div>
            </div>
        </GameWrapper>
    );
}
