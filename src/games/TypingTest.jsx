import { useState, useEffect, useRef } from 'react';
import GameWrapper from '../components/GameWrapper';
import { useGameScore } from '../hooks/useGameScore';
import { Keyboard } from 'lucide-react';
import './TypingTest.css';

const TEXTS = [
    "The quick brown fox jumps over the lazy dog. This is a classic sentence that uses every letter in the English alphabet.",
    "To be or not to be, that is the question: Whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune.",
    "In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell.",
    "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness.",
    "All that is gold does not glitter, not all those who wander are lost; the old that is strong does not wither, deep roots are not reached by the frost."
];

export default function TypingTest() {
    const { bestScore, sessionBest, saveScore } = useGameScore('typing');
    const [gameState, setGameState] = useState('waiting'); // waiting, playing, result
    const [text, setText] = useState('');
    const [input, setInput] = useState('');
    const [startTime, setStartTime] = useState(0);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(0);

    // Meta metrics
    const [backspaces, setBackspaces] = useState(0);
    const [errors, setErrors] = useState(0); // Total incorrect chars typed

    const inputRef = useRef(null);

    const startGame = () => {
        const randomText = TEXTS[Math.floor(Math.random() * TEXTS.length)];
        setText(randomText);
        setInput('');
        setGameState('playing');
        setStartTime(Date.now());
        setBackspaces(0);
        setErrors(0);
        // Focus input after render
        setTimeout(() => inputRef.current?.focus(), 10);
    };

    const handleInput = (e) => {
        if (gameState !== 'playing') return;

        const val = e.target.value;

        // Check for backspace
        if (val.length < input.length) {
            setBackspaces(prev => prev + 1);
        } else {
            // Check if latest char is correct or error
            const index = val.length - 1;
            if (index < text.length && val[index] !== text[index]) {
                setErrors(prev => prev + 1);
            }
        }

        setInput(val);

        if (val === text) {
            endGame(val);
        }
    };

    const endGame = (finalInput) => {
        const endTime = Date.now();
        const timeInMinutes = (endTime - startTime) / 60000;
        const words = text.split(' ').length; // Or standard 5 chars per word
        // Standard WPM = (All typed entries / 5) / Time (min)
        const standardWpm = Math.round((text.length / 5) / timeInMinutes);

        // Accuracy
        let correct = 0;
        for (let i = 0; i < text.length; i++) {
            if (finalInput[i] === text[i]) correct++;
        }
        const acc = Math.round((correct / text.length) * 100);

        setWpm(standardWpm);
        setAccuracy(acc);

        const meta = {
            accuracy: acc,
            backspaces: backspaces,
            errorCount: errors,
            timeSeconds: (endTime - startTime) / 1000
        };

        saveScore(standardWpm, false, meta); // Higher is better
        setGameState('result');
    };

    return (
        <GameWrapper
            title="Typing Test"
            description="Type the text below as fast as you can."
            onRestart={startGame}
            score={wpm ? `${wpm} WPM` : null}
            bestScore={bestScore ? `${bestScore} WPM` : null}
            sessionBest={sessionBest ? `${sessionBest} WPM` : null}
        >
            <div className="typing-container">
                {gameState === 'waiting' && (
                    <div className="typing-start">
                        <Keyboard size={64} className="typing-icon" />
                        <h2>Ready to type?</h2>
                        <button className="typing-btn" onClick={startGame}>Start Test</button>
                    </div>
                )}

                {gameState === 'playing' && (
                    <div className="typing-area">
                        <div className="typing-text-display">
                            {text.split('').map((char, i) => {
                                let className = '';
                                if (i < input.length) {
                                    className = input[i] === char ? 'correct' : 'incorrect';
                                } else if (i === input.length) {
                                    className = 'current';
                                }
                                return <span key={i} className={className}>{char}</span>;
                            })}
                        </div>
                        <textarea
                            ref={inputRef}
                            className="typing-input"
                            value={input}
                            onChange={handleInput}
                            autoFocus
                            spellCheck={false}
                        />
                    </div>
                )}

                {gameState === 'result' && (
                    <div className="typing-result">
                        <Keyboard size={64} className="typing-icon" />
                        <div className="typing-stats">
                            <div className="stat-box">
                                <h1>{wpm}</h1>
                                <span>WPM</span>
                            </div>
                            <div className="stat-box">
                                <h1>{accuracy}%</h1>
                                <span>Accuracy</span>
                            </div>
                        </div>
                        <div className="typing-meta-stats">
                            <p>Backspaces: {backspaces}</p>
                            <p>Base Errors: {errors}</p>
                        </div>
                        <button className="typing-btn" onClick={startGame}>Try Again</button>
                    </div>
                )}
            </div>
        </GameWrapper>
    );
}
