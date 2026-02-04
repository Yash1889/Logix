import { useState, useRef, useEffect } from 'react';
import GameWrapper from '../components/GameWrapper';
import { useGameScore } from '../hooks/useGameScore';
import { motion, AnimatePresence } from 'framer-motion';
import { Hash, Delete } from 'lucide-react';
import './NumberMemory.css';

export default function NumberMemory() {
    const { bestScore, sessionBest, saveScore } = useGameScore('number-memory');
    const [gameState, setGameState] = useState('waiting'); // waiting, showing, input, result
    const [level, setLevel] = useState(1);
    const [number, setNumber] = useState('');
    const [userInput, setUserInput] = useState('');
    const inputRef = useRef(null);

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

        // Standard scaling: 1000ms base + 1000ms per digit is usually too easy.
        // HB Logic: Rapid flash? Or reasonable?
        // Let's do: 2s base + 0.5s per digit.
        const showTime = 1500 + (length * 700);

        setTimeout(() => {
            setGameState('input');
            setTimeout(() => inputRef.current?.focus(), 50);
        }, showTime);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Normalize input
        const normalized = userInput.replace(/\s/g, '');

        if (normalized === number) {
            // Correct
            setLevel(prev => prev + 1);
            setGameState('showing');
            setTimeout(startLevel, 500);
        } else {
            // Wrong
            endGame();
        }
    };

    const endGame = () => {
        const meta = {
            correctNumber: number,
            userGuess: userInput,
            digits: level
        };
        saveScore(level, false, meta); // Higher is better
        setGameState('result');
    };

    const startGame = () => {
        setLevel(1);
        startLevel();
    };

    return (
        <GameWrapper
            title="Number Memory"
            description="Memorize the sequence, then input it."
            onRestart={startGame}
            score={`Level ${level}`}
            bestScore={bestScore ? `Lvl ${bestScore}` : null}
            sessionBest={sessionBest ? `Lvl ${sessionBest}` : null}
        >
            <div className="nm-container">
                {gameState === 'waiting' && (
                    <div className="nm-overlay">
                        <Hash size={64} className="nm-icon" />
                        <h2>DIGIT RETENTION TEST</h2>
                        <p>The sequence will lengthen progressively.</p>
                        <button className="nm-btn-start" onClick={startGame}>INITIALIZE</button>
                    </div>
                )}

                {gameState === 'showing' && (
                    <div className="nm-play">
                        <motion.div
                            className="nm-number-display"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            {number}
                        </motion.div>
                        <div className="nm-timer-bar">
                            <div className="nm-progress" style={{ animationDuration: `${1500 + (level * 700)}ms` }}></div>
                        </div>
                    </div>
                )}

                {gameState === 'input' && (
                    <div className="nm-input-phase">
                        <h2 className="nm-prompt">INPUT SEQUENCE</h2>
                        <form onSubmit={handleSubmit} className="nm-form">
                            <input
                                ref={inputRef}
                                type="text"
                                pattern="[0-9]*"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                className="nm-input"
                                autoComplete="off"
                                placeholder="#"
                            />
                            <button type="submit" className="nm-btn-submit">CONFIRM</button>
                        </form>
                        <p className="nm-hint">Press Enter to Submit</p>
                    </div>
                )}

                {gameState === 'result' && (
                    <div className="nm-result-panel">
                        <div className="result-display">
                            <span className="result-val">{level}</span>
                            <span className="result-unit">DIGITS</span>
                        </div>

                        <div className="nm-comparison-box">
                            <div className="nm-cmp-row">
                                <span className="label">SEQUENCE</span>
                                <span className="value correct">{number}</span>
                            </div>
                            <div className="nm-cmp-row">
                                <span className="label">INPUT</span>
                                <span className="value wrong">{userInput}</span>
                            </div>
                        </div>

                        <button className="nm-retry-btn" onClick={startGame}>
                            RE-INITIALIZE
                        </button>
                    </div>
                )}
            </div>
        </GameWrapper>
    );
}
