import { useState } from 'react';
import GameWrapper from '../components/GameWrapper';
import { useGameScore } from '../hooks/useGameScore';
import './PatternRecognition.css';

// Simple number series generator
const LEVELS = [
    { seq: [2, 4, 6, 8], ans: 10, opts: [9, 10, 11, 12] },
    { seq: [1, 1, 2, 3, 5], ans: 8, opts: [7, 8, 9, 13] },
    { seq: [100, 90, 80, 70], ans: 60, opts: [65, 60, 50, 55] },
    { seq: [2, 4, 8, 16], ans: 32, opts: [24, 30, 32, 64] },
    { seq: [1, 4, 9, 16], ans: 25, opts: [20, 24, 25, 36] },
    { seq: [1, 2, 4, 7, 11], ans: 16, opts: [15, 16, 17, 18] }, // +1, +2, +3...
    { seq: [3, 6, 12, 24], ans: 48, opts: [36, 42, 48, 50] },
    { seq: [81, 27, 9], ans: 3, opts: [1, 3, 6, 0] },
];

export default function PatternRecognition() {
    const { bestScore, sessionBest, saveScore } = useGameScore('pattern-recognition');
    const [gameState, setGameState] = useState('waiting');
    const [level, setLevel] = useState(0);
    const [lives, setLives] = useState(3);

    const startGame = () => {
        setGameState('playing');
        setLevel(0);
        setLives(3);
    };

    const handleChoice = (val) => {
        const current = LEVELS[level];
        if (val === current.ans) {
            // Correct
            if (level === LEVELS.length - 1) {
                endGame(true);
            } else {
                setLevel(prev => prev + 1);
            }
        } else {
            // Wrong
            const newLives = lives - 1;
            setLives(newLives);
            if (newLives <= 0) {
                endGame(false);
            }
        }
    };

    const endGame = (completed) => {
        const finalScore = completed ? LEVELS.length : level;
        saveScore(finalScore);
        setGameState('result');
    };

    // Infinite play if we procedurally generate? 
    // For MVP fixed levels is fine but limits replayability.

    return (
        <GameWrapper
            title="Pattern Recognition"
            description="Find the missing number."
            onRestart={startGame}
            score={`Level ${level + 1}`}
            bestScore={bestScore ? `Lvl ${bestScore}` : null}
            sessionBest={sessionBest ? `Lvl ${sessionBest}` : null}
        >
            <div className="pattern-container">
                {gameState === 'waiting' && <button className="pattern-btn start" onClick={startGame}>Start</button>}

                {gameState === 'playing' && (
                    <div className="pattern-play">
                        <div className="pattern-lives">{'❤️'.repeat(lives)}</div>
                        <div className="pattern-seq">
                            {LEVELS[level].seq.map((n, i) => (
                                <span key={i} className="pattern-num">{n}</span>
                            ))}
                            <span className="pattern-num missing">?</span>
                        </div>
                        <div className="pattern-opts">
                            {LEVELS[level].opts.map(opt => (
                                <button key={opt} className="pattern-opt" onClick={() => handleChoice(opt)}>
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {gameState === 'result' && (
                    <div className="pattern-result">
                        <h1>Score: {level}</h1>
                        <button className="pattern-btn start" onClick={startGame}>Try Again</button>
                    </div>
                )}
            </div>
        </GameWrapper>
    );
}
