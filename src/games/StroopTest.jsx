import { useState, useRef, useEffect } from 'react';
import GameWrapper from '../components/GameWrapper';
import { useGameScore } from '../hooks/useGameScore';
import { Shuffle } from 'lucide-react';
import './StroopTest.css';

const COLORS = [
    { name: 'RED', hex: '#ef4444' },
    { name: 'BLUE', hex: '#3b82f6' },
    { name: 'GREEN', hex: '#22c55e' },
    { name: 'YELLOW', hex: '#eab308' }
];

const TOTAL_ROUNDS = 10;

export default function StroopTest() {
    const { bestScore, sessionBest, saveScore } = useGameScore('stroop');
    const [gameState, setGameState] = useState('waiting');
    const [round, setRound] = useState(0);
    const [currentWord, setCurrentWord] = useState({ text: '', colorHex: '' });
    const [startTime, setStartTime] = useState(0);
    const [totalTime, setTotalTime] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);

    // Meta metrics
    const [congruentDelay, setCongruentDelay] = useState([]);
    const [incongruentDelay, setIncongruentDelay] = useState([]);

    // Setup round
    const nextRound = () => {
        if (round >= TOTAL_ROUNDS) {
            endGame();
            return;
        }

        // Generate random word and random color
        const wordObj = COLORS[Math.floor(Math.random() * COLORS.length)];
        const colorObj = COLORS[Math.floor(Math.random() * COLORS.length)];

        setCurrentWord({ text: wordObj.name, colorHex: colorObj.hex, colorName: colorObj.name });
        setStartTime(Date.now());
        setRound(prev => prev + 1);
    };

    const endGame = () => {
        // Score is average time IF accuracy is decent? Or just correct count?
        // HB standard: usually pure time but with penalty.
        // Let's use Correct Count as primary "score" for now? 
        // Wait, usually it's "Time taken to complete X correct".
        // Let's make score: Average Reaction Time (ms)
        // But we penalize wrong answers.
        // Let's penalize +1000ms for wrong answer.

        // Average Time per round
        const avgMs = Math.round(totalTime / TOTAL_ROUNDS);

        const accuracy = Math.round((correctCount / TOTAL_ROUNDS) * 100);

        const meta = {
            accuracy: accuracy,
            avgReaction: avgMs
        };

        saveScore(avgMs, true, meta); // Lower is better
        setGameState('result');
    };

    const handleChoice = (selectedColorName) => {
        const endTime = Date.now();
        const timeTaken = endTime - startTime;

        setTotalTime(prev => prev + timeTaken);

        // Check correctness (Must match COLOR, not TEXT)
        // TEXT: RED, COLOR: BLUE -> Correct choice: BLUE

        const isCongruent = currentWord.text === currentWord.colorName;

        if (selectedColorName === currentWord.colorName) {
            setCorrectCount(prev => prev + 1);

            // Log delay for congruent vs incongruent
            if (isCongruent) {
                setCongruentDelay(prev => [...prev, timeTaken]);
            } else {
                setIncongruentDelay(prev => [...prev, timeTaken]);
            }
        } else {
            // Wrong answer penalty: add 1000ms to total time?
            setTotalTime(prev => prev + 1000); // Penalty
        }

        nextRound();
    };

    const startGame = () => {
        setGameState('playing');
        setRound(0);
        setTotalTime(0);
        setCorrectCount(0);
        setCongruentDelay([]);
        setIncongruentDelay([]);
        nextRound();
    };

    return (
        <GameWrapper
            title="Stroop Test"
            description="Select the color of the text, not what the text says."
            onRestart={startGame}
            score={gameState === 'result' ? `${Math.round(totalTime / TOTAL_ROUNDS)} ms` : null}
            bestScore={bestScore ? `${bestScore} ms` : null}
            sessionBest={sessionBest ? `${sessionBest} ms` : null}
        >
            <div className="stroop-container">
                {gameState === 'waiting' && (
                    <div className="stroop-start">
                        <Shuffle size={64} className="stroop-icon" />
                        <h2>Stroop Effect Test</h2>
                        <p>Click the button matching the <strong>COLOR</strong> of the word shown.</p>
                        <button className="stroop-btn start" onClick={startGame}>Start Test</button>
                    </div>
                )}

                {gameState === 'playing' && (
                    <div className="stroop-play">
                        <div className="stroop-counter">{round} / {TOTAL_ROUNDS}</div>
                        <div
                            className="stroop-word"
                            style={{ color: currentWord.colorHex }}
                        >
                            {currentWord.text}
                        </div>

                        <div className="stroop-options">
                            {COLORS.map(c => (
                                <button
                                    key={c.name}
                                    className="stroop-option-btn"
                                    onClick={() => handleChoice(c.name)}
                                >
                                    {c.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {gameState === 'result' && (
                    <div className="stroop-result">
                        <Shuffle size={64} className="stroop-icon" />
                        <h1>{Math.round(totalTime / TOTAL_ROUNDS)} ms</h1>
                        <p>Average Response Time (with penalties)</p>
                        <div className="stroop-stats">
                            <p>Accuracy: {Math.round((correctCount / TOTAL_ROUNDS) * 100)}%</p>
                        </div>
                        <button className="stroop-btn start" onClick={startGame}>Try Again</button>
                    </div>
                )}
            </div>
        </GameWrapper>
    );
}
