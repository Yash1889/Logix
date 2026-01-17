import { useState, useRef, useEffect } from 'react';
import GameWrapper from '../components/GameWrapper';
import { useGameScore } from '../hooks/useGameScore';
import { motion } from 'framer-motion';
import './NumberMemory.css';

export default function NumberMemory() {
    const { bestScore, sessionBest, saveScore } = useGameScore('number-memory');
    const [gameState, setGameState] = useState('waiting'); // waiting, showing, input, result
    const [level, setLevel] = useState(1);
    const [number, setNumber] = useState('');
    const [userInput, setUserInput] = useState('');

    const generateNumber = (length) => {
        let num = '';
        for (let i = 0; i < length; i++) {
            num += Math.floor(Math.random() * 10);
        }
        return num;
    };

    const startLevel = () => {
        const length = level;
        const newNum = generateNumber(length);
        setNumber(newNum);
        setGameState('showing');
        setUserInput('');

        // Time to show: 1s + (0.5s per digit) -> Roughly HB scaling
        const showTime = 1000 + (length * 600);

        setTimeout(() => {
            setGameState('input');
        }, showTime);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (userInput === number) {
            // Correct
            setLevel(prev => prev + 1);
            setGameState('showing'); // Or 'correct' feedback state
            setTimeout(startLevel, 500);
        } else {
            // Wrong
            const meta = {
                correctNumber: number,
                userGuess: userInput,
                digits: level
            };
            saveScore(level, false, meta); // Higher is better
            setGameState('result');
        }
    };

    const startGame = () => {
        setLevel(1);
        startLevel();
    };

    return (
        <GameWrapper
            title="Number Memory"
            description="Memorize the number shown."
            onRestart={startGame}
            score={`Level ${level}`}
            bestScore={bestScore ? `Lvl ${bestScore}` : null}
            sessionBest={sessionBest ? `Lvl ${sessionBest}` : null}
        >
            <div className="number-memory-container">
                {gameState === 'waiting' && (
                    <button className="nm-btn start" onClick={startGame}>Start</button>
                )}

                {gameState === 'showing' && (
                    <div className="nm-display">
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {number}
                        </motion.h1>
                        <div className="nm-bar" style={{ animationDuration: `${1000 + (level * 600)}ms` }}></div>
                    </div>
                )}

                {gameState === 'input' && (
                    <form onSubmit={handleSubmit} className="nm-form">
                        <h2>What was the number?</h2>
                        <input
                            type="text"
                            pattern="[0-9]*"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            autoFocus
                            className="nm-input"
                        />
                        <button type="submit" className="nm-btn">Submit</button>
                    </form>
                )}

                {gameState === 'result' && (
                    <div className="nm-result">
                        <h1>Game Over</h1>
                        <p>Level Reached: {level}</p>
                        <div className="nm-comparison">
                            <div>
                                <span>Number:</span>
                                <p className="correct">{number}</p>
                            </div>
                            <div>
                                <span>Your Answer:</span>
                                <p className="wrong">{userInput}</p>
                            </div>
                        </div>
                        <button className="nm-btn" onClick={startGame}>Try Again</button>
                    </div>
                )}
            </div>
        </GameWrapper>
    );
}
