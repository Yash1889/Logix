import { useState, useEffect, useRef } from 'react';
import GameWrapper from '../components/GameWrapper';
import { useGameScore } from '../hooks/useGameScore';
import './TypingTest.css';

const TEXTS = [
    "The quick brown fox jumps over the lazy dog. This sentence contains every letter in the English alphabet and is commonly used for typing practice.",
    "To be or not to be, that is the question: whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles.",
    "In the beginning God created the heavens and the earth. Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.",
    "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity.",
    "Far out in the uncharted backwaters of the unfashionable end of the western spiral arm of the Galaxy lies a small unregarded yellow sun."
];

export default function TypingTest() {
    const { bestScore, sessionBest, saveScore } = useGameScore('typing');
    const [gameState, setGameState] = useState('waiting'); // waiting, playing, result
    const [text, setText] = useState('');
    const [userInput, setUserInput] = useState('');
    const [startTime, setStartTime] = useState(null);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const inputRef = useRef(null);

    const startGame = () => {
        const randomText = TEXTS[Math.floor(Math.random() * TEXTS.length)];
        setText(randomText);
        setUserInput('');
        setGameState('waiting');
        setStartTime(null);
        setWpm(0);
        setAccuracy(100);
        // Focus automatically
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const handleInput = (e) => {
        const value = e.target.value;

        if (gameState === 'waiting') {
            setGameState('playing');
            setStartTime(Date.now());
        }

        setUserInput(value);

        // Calculate accuracy on the fly
        let correctChars = 0;
        for (let i = 0; i < value.length; i++) {
            if (value[i] === text[i]) correctChars++;
        }
        const currentAccuracy = value.length > 0 ? Math.round((correctChars / value.length) * 100) : 100;
        setAccuracy(currentAccuracy);

        // Check completion
        if (value.length >= text.length) {
            const endTime = Date.now();
            const timeInMinutes = (endTime - startTime) / 60000;
            const words = text.length / 5; // Standard word length definition
            const finalWpm = Math.round(words / timeInMinutes);

            // Adjust for accuracy? Usually WPM is net WPM.
            // Let's store raw WPM but maybe penalized by accuracy in a real app.
            // Standard formula: (All Typed Entries / 5) - Uncorrected Errors / Time(min)
            // Here we just do simple WPM for MVP.

            setWpm(finalWpm);
            saveScore(finalWpm);
            setGameState('result');
        }
    };

    useEffect(() => {
        startGame();
    }, []);

    return (
        <GameWrapper
            title="Typing Test"
            description="Type the text as fast as you can. Timer starts when you begin typing."
            onRestart={startGame}
            score={gameState === 'result' ? `${wpm} WPM` : null}
            bestScore={bestScore ? `${bestScore} WPM` : null}
            sessionBest={sessionBest ? `${sessionBest} WPM` : null}
        >
            <div className="typing-test-container">
                {gameState !== 'result' ? (
                    <div className="typing-area">
                        <div className="typing-text-display">
                            {text.split('').map((char, index) => {
                                let className = 'char';
                                if (index < userInput.length) {
                                    className += userInput[index] === char ? ' correct' : ' wrong';
                                }
                                if (index === userInput.length) className += ' current';
                                return <span key={index} className={className}>{char}</span>;
                            })}
                        </div>
                        <textarea
                            ref={inputRef}
                            className="typing-input"
                            value={userInput}
                            onChange={handleInput}
                            autoFocus
                            spellCheck="false"
                        />
                    </div>
                ) : (
                    <div className="typing-result">
                        <h1>{wpm} WPM</h1>
                        <p>Accuracy: {accuracy}%</p>
                        <button className="typing-btn primary" onClick={startGame}>Try Again</button>
                    </div>
                )}
            </div>
        </GameWrapper>
    );
}
