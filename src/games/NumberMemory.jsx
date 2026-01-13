import { useState, useRef, useEffect } from 'react';
import GameWrapper from '../components/GameWrapper';
import { useGameScore } from '../hooks/useGameScore';
import './NumberMemory.css';

export default function NumberMemory() {
    const { bestScore, sessionBest, saveScore } = useGameScore('number-memory');
    const [gameState, setGameState] = useState('waiting'); // waiting, showing, answering, result
    const [level, setLevel] = useState(1);
    const [number, setNumber] = useState('');
    const [userAnswer, setUserAnswer] = useState('');
    const [timeLeft, setTimeLeft] = useState(0);

    const startLevel = (lvl) => {
        setGameState('showing');
        setUserAnswer('');

        // Generate number: lvl 1 = 1 digit, lvl 2 = 2 digits...
        const digits = lvl;
        let newNumber = '';
        for (let i = 0; i < digits; i++) {
            newNumber += Math.floor(Math.random() * 10);
        }
        setNumber(newNumber);

        // Show time depends on length? Usually fixed per digit in HB? 
        // Actually HB logic is roughly: show for N seconds where N is related to length.
        // Let's do 1 second + 0.5s per digit maybe?
        const showTime = 1000 + (digits * 1000);
        setTimeLeft(showTime);
    };

    useEffect(() => {
        let interval;
        if (gameState === 'showing') {
            const startTime = Date.now();
            const endTime = startTime + timeLeft;

            interval = setInterval(() => {
                const remaining = endTime - Date.now();
                if (remaining <= 0) {
                    setGameState('answering');
                    clearInterval(interval);
                } else {
                    // Optional: update a progress bar using remaining state
                }
            }, 100);

            // Cleanup backup
            const timeout = setTimeout(() => {
                setGameState('answering');
                clearInterval(interval);
            }, timeLeft);

            return () => {
                clearInterval(interval);
                clearTimeout(timeout);
            }
        }
    }, [gameState, timeLeft]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (userAnswer === number) {
            // Correct
            const nextLevel = level + 1;
            setLevel(nextLevel);
            startLevel(nextLevel);
        } else {
            // Wrong
            saveScore(level);
            setGameState('result');
        }
    };

    const startGame = () => {
        setLevel(1);
        startLevel(1);
    };

    return (
        <GameWrapper
            title="Number Memory"
            description="Memorize the number shown, then type it back."
            onRestart={startGame}
            score={`Level ${level}`}
            bestScore={bestScore ? `Lvl ${bestScore}` : null}
            sessionBest={sessionBest ? `Lvl ${sessionBest}` : null}
        >
            <div className="number-memory-container">
                {gameState === 'waiting' && (
                    <div className="nm-start-screen">
                        <button className="nm-btn primary" onClick={startGame}>Start Game</button>
                    </div>
                )}

                {gameState === 'showing' && (
                    <div className="nm-display">
                        <h1 className="nm-number">{number}</h1>
                        <div className="nm-timer-bar" style={{ animationDuration: `${timeLeft}ms` }}></div>
                    </div>
                )}

                {gameState === 'answering' && (
                    <form className="nm-form" onSubmit={handleSubmit}>
                        <h2>What was the number?</h2>
                        <input
                            type="number"
                            className="nm-input"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            autoFocus
                            placeholder="Type range..."
                        />
                        <button type="submit" className="nm-btn primary">Submit</button>
                    </form>
                )}

                {gameState === 'result' && (
                    <div className="nm-result">
                        <h2>Game Over</h2>
                        <div className="nm-comparison">
                            <div className="nm-val">
                                <span>Number</span>
                                <p>{number}</p>
                            </div>
                            <div className="nm-val wrong">
                                <span>Your Answer</span>
                                <p>{userAnswer}</p>
                            </div>
                        </div>
                        <h1>Level {level}</h1>
                        <button className="nm-btn primary" onClick={startGame}>Try Again</button>
                    </div>
                )}
            </div>
        </GameWrapper>
    );
}
