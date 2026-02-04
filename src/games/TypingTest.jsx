import { useState, useRef, useEffect } from 'react';
import GameWrapper from '../components/GameWrapper';
import { useGameScore } from '../hooks/useGameScore';
import { Keyboard, AlertTriangle, Terminal, Play, Timer, AlignLeft } from 'lucide-react';
import './TypingTest.css';

const TEXTS = [
    "The intricate structure of the neural network mirrors the complexity of the human mind, processing vast streams of data with efficiency.",
    "Cognitive flexibility allows an individual to adapt to fluctuating environments, shifting strategies to overcome unforeseen obstacles.",
    "In the realm of logic, consistency is paramount; a single contradiction can unravel the entire fabric of a deductive argument.",
    "Perception is not merely the passive reception of sensory input, but an active construction of reality based on expectation and memory.",
    "Efficient algorithms prioritize measuring latency and throughput, optimizing the system for maximum performance under high load.",
    "Abstract reasoning is the ability to identify patterns, logical rules, and trends in new data, integrating this information to solve problems."
];

export default function TypingTest() {
    const { bestScore, sessionBest, saveScore } = useGameScore('typing');
    const [gameState, setGameState] = useState('waiting'); // waiting, playing, result

    // Config
    const [duration, setDuration] = useState(30); // 15, 30, 60

    // State
    const [text, setText] = useState('');
    const [input, setInput] = useState('');
    const [timeLeft, setTimeLeft] = useState(0);
    const [isActive, setIsActive] = useState(false);

    // Metrics
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(0);
    const [errors, setErrors] = useState(0);
    const [totalChars, setTotalChars] = useState(0);

    const inputRef = useRef(null);

    // Initial load
    useEffect(() => {
        resetGame();
    }, []);

    // Timer
    useEffect(() => {
        let interval;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        endGame();
                        return 0;
                    }
                    return prev - 1;
                });

                // Live WPM calculation
                calculateStats();
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const resetGame = () => {
        const randomText = TEXTS[Math.floor(Math.random() * TEXTS.length)] + " " + TEXTS[Math.floor(Math.random() * TEXTS.length)];
        setText(randomText); // Double text for longer duration
        setInput('');
        setGameState('waiting');
        setIsActive(false);
        setTimeLeft(duration);
        setErrors(0);
        setWpm(0);
        setAccuracy(100);
        setTotalChars(0);
    };

    const startGame = (selectedDuration) => {
        if (selectedDuration) setDuration(selectedDuration);

        const randomText = TEXTS[Math.floor(Math.random() * TEXTS.length)] + " " + TEXTS[Math.floor(Math.random() * TEXTS.length)];
        setText(randomText);
        setInput('');

        setIsActive(true);
        setGameState('playing');
        setTimeLeft(selectedDuration || duration);
        setTimeout(() => inputRef.current?.focus(), 50);
    };

    const handleInput = (e) => {
        if (gameState !== 'playing') return;

        const val = e.target.value;
        const length = val.length;

        // Count errors (simple check against current char)
        if (length > input.length) { // Only check if adding char
            const charIndex = length - 1;
            if (charIndex < text.length) {
                if (val[charIndex] !== text[charIndex]) {
                    setErrors(prev => prev + 1);
                }
            }
        }

        setInput(val);
        setTotalChars(length); // Rough approximation of total typed

        // Auto-end if completed text
        if (val.length >= text.length) {
            endGame();
        }
    };

    const calculateStats = () => {
        // Standard WPM = (Chars / 5) / TimeInMinutes
        // Using total typed chars is standard, but usually net of errors.
        // Let's use (CorrectChars / 5) / TimeElapsed

        const elapsed = duration - timeLeft;
        if (elapsed <= 0) return;

        const timeMin = elapsed / 60;
        const grossWPM = (input.length / 5) / timeMin;
        const netWPM = Math.max(0, grossWPM - (errors / timeMin)); // Standard formula often penalizes errors

        setWpm(Math.round(grossWPM));
    };

    const endGame = () => {
        setIsActive(false);
        setGameState('result');

        // Final calc
        const elapsed = duration - timeLeft; // Could be full duration or less if finished early
        const effectiveTime = elapsed > 0 ? elapsed : duration;

        const timeMin = effectiveTime / 60;
        const grossWPM = Math.round((input.length / 5) / timeMin);

        // Final Accuracy
        // Compare every char typed vs target
        let correct = 0;
        for (let i = 0; i < input.length; i++) {
            if (i < text.length && input[i] === text[i]) correct++;
        }

        const acc = input.length > 0 ? Math.round((correct / input.length) * 100) : 0;

        setWpm(grossWPM);
        setAccuracy(acc);

        const meta = {
            duration,
            grossWPM,
            accuracy: acc,
            errors,
            completed: input.length === text.length
        };

        saveScore(grossWPM, false, meta);
    };

    // Render text with highlighting
    const renderText = () => {
        return text.split('').map((char, i) => {
            let className = 'char-pending';
            if (i < input.length) {
                const typedChar = input[i];
                if (typedChar === char) {
                    className = 'char-correct';
                } else {
                    className = 'char-incorrect';
                }
            } else if (i === input.length) {
                className = 'char-current';
            }
            return <span key={i} className={className}>{char}</span>;
        });
    };

    return (
        <GameWrapper
            title="Typing Test"
            description="High-velocity data transcription protocol."
            onRestart={resetGame}
            score={wpm ? `${wpm} WPM` : null}
            bestScore={bestScore ? `${bestScore} WPM` : null}
            sessionBest={sessionBest ? `${sessionBest} WPM` : null}
        >
            <div className="typing-container full-height">
                {gameState === 'waiting' && (
                    <div className="typing-overlay">
                        <Keyboard size={80} className="typing-icon" />
                        <h1 className="typing-title">TRANSCRIPTION PROTOCOL</h1>

                        <div className="typing-modes">
                            <span className="mode-label">SELECT DURATION</span>
                            <div className="mode-buttons">
                                {[15, 30, 60].map(s => (
                                    <button
                                        key={s}
                                        className={`mode-btn ${duration === s ? 'active' : ''}`}
                                        onClick={() => setDuration(s)}
                                    >
                                        {s}s
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button className="typing-btn-start" onClick={() => startGame()}>
                            INITIALIZE STREAM
                        </button>
                    </div>
                )}

                {gameState === 'playing' && (
                    <div className="typing-play-area" onClick={() => inputRef.current?.focus()}>
                        <div className="typing-hud">
                            <div className="hud-metric">
                                <span className="label">TIME LEFT</span>
                                <span className={`value ${timeLeft < 5 ? 'warn' : ''}`}>{timeLeft}s</span>
                            </div>
                            <div className="hud-metric">
                                <span className="label">ERRORS</span>
                                <span className="value">{errors}</span>
                            </div>
                            <div className="hud-metric">
                                <span className="label">WPM (EST)</span>
                                <span className="value">{wpm}</span>
                            </div>
                        </div>

                        <div className="typing-terminal">
                            {renderText()}
                        </div>

                        <input
                            ref={inputRef}
                            className="typing-input-hidden"
                            value={input}
                            onChange={handleInput}
                            autoFocus
                            autoComplete="off"
                            spellCheck={false}
                        />

                        <div className="typing-focus-hint">
                            CLICK TERMINAL TO FOCUS
                        </div>
                    </div>
                )}

                {gameState === 'result' && (
                    <div className="typing-result-panel">
                        <div className="result-display">
                            <span className="result-label">VELOCITY</span>
                            <span className="result-val">{wpm}</span>
                            <span className="result-unit">WPM</span>
                        </div>

                        <div className="typing-analysis-grid">
                            <div className="analysis-item">
                                <span className="label">ACCURACY</span>
                                <span className="value">{accuracy}%</span>
                            </div>
                            <div className="analysis-item">
                                <span className="label">ERRORS</span>
                                <span className="value">{errors}</span>
                            </div>
                            <div className="analysis-item">
                                <span className="label">CHARACTERS</span>
                                <span className="value">{input.length}</span>
                            </div>
                        </div>

                        <button className="typing-retry-btn" onClick={resetGame}>
                            NEXT DATA BLOCK
                        </button>
                    </div>
                )}
            </div>
        </GameWrapper>
    );
}
