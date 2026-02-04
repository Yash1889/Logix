import { useState } from 'react';
import GameWrapper from '../components/GameWrapper';
import { useGameScore } from '../hooks/useGameScore';
import { Shuffle, CheckCircle, XCircle } from 'lucide-react';
import './StroopTest.css';

const COLORS = [
    { name: 'RED', hex: '#ef4444', class: 'color-red' },
    { name: 'BLUE', hex: '#3b82f6', class: 'color-blue' },
    { name: 'GREEN', hex: '#22c55e', class: 'color-green' },
    { name: 'YELLOW', hex: '#eab308', class: 'color-yellow' }
];

const TOTAL_ROUNDS = 10;
const PENALTY_MS = 1000;

export default function StroopTest() {
    const { bestScore, sessionBest, saveScore } = useGameScore('stroop');
    const [gameState, setGameState] = useState('waiting');
    const [round, setRound] = useState(0);
    const [currentWord, setCurrentWord] = useState({ text: '', colorHex: '', colorName: '' });
    const [startTime, setStartTime] = useState(0);
    const [totalTime, setTotalTime] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'

    // Meta metrics
    const [congruentDelay, setCongruentDelay] = useState([]);
    const [incongruentDelay, setIncongruentDelay] = useState([]);

    const nextRound = () => {
        if (round >= TOTAL_ROUNDS) {
            endGame();
            return;
        }

        // Generate random word and random color
        // Ensure we don't get the same combination 5 times in a row? Random is fine.
        const wordObj = COLORS[Math.floor(Math.random() * COLORS.length)];
        const colorObj = COLORS[Math.floor(Math.random() * COLORS.length)];

        setCurrentWord({ text: wordObj.name, colorHex: colorObj.hex, colorName: colorObj.name });
        setStartTime(Date.now());
        setRound(prev => prev + 1);
        setFeedback(null);
    };

    const endGame = () => {
        // Average Time per round (including penalties)
        const finalTotal = totalTime;
        // Note: totalTime state update from last round might not be flushed if we called endGame directly? 
        // Actually, handleChoice updates totalTime then calls nextRound. 
        // If round >= TOTAL, nextRound calls endGame.
        // But the state update "setTotalTime" is async.
        // We need to pass the running total? Or just use functional update in handleChoice effectively?
        // Actually, doing `setTotalTime` then `nextRound` which reads `totalTime` is risky.
        // Better to calculate score in a useEffect or pass it. 
        // PRO TIP: Just use local var for the running summary in logical flow or rely on the state update in render.
        // Simplest fix: Calculate final avg in next "render" or pass value.
        // Let's rely on the state being updated *before* the round check logic triggers? No, nextRound is called immediately.
        // We will fix logic in handleChoice.
    };

    const handleChoice = (selectedColorName) => {
        const endTime = Date.now();
        const timeTaken = endTime - startTime;
        let penalty = 0;

        const isCongruent = currentWord.text === currentWord.colorName;
        const isCorrect = selectedColorName === currentWord.colorName;

        if (isCorrect) {
            setCorrectCount(prev => prev + 1);
            setFeedback('correct');
            if (isCongruent) {
                setCongruentDelay(prev => [...prev, timeTaken]);
            } else {
                setIncongruentDelay(prev => [...prev, timeTaken]);
            }
        } else {
            setFeedback('wrong');
            penalty = PENALTY_MS;
        }

        const newTotal = totalTime + timeTaken + penalty;
        setTotalTime(newTotal);

        // Immediate transition vs slight delay for feedback?
        // Stroop should be fast. Feedback flashes?
        // Let's do a tiny delay of 100ms or instant? Instant is harsh but pro.
        // Let's go instant for "Reaction" category.

        if (round + 1 >= TOTAL_ROUNDS) {
            finalizeGame(newTotal, correctCount + (isCorrect ? 1 : 0));
        } else {
            nextRound();
        }
    };

    const finalizeGame = (finalTime, finalCorrect) => {
        const avgMs = Math.round(finalTime / TOTAL_ROUNDS);
        const accuracy = Math.round((finalCorrect / TOTAL_ROUNDS) * 100);

        const meta = {
            accuracy: accuracy,
            avgReaction: avgMs,
            congruentAvg: congruentDelay.length ? Math.round(congruentDelay.reduce((a, b) => a + b, 0) / congruentDelay.length) : 0,
            incongruentAvg: incongruentDelay.length ? Math.round(incongruentDelay.reduce((a, b) => a + b, 0) / incongruentDelay.length) : 0,
        };

        saveScore(avgMs, true, meta); // Lower is better
        setGameState('result');
    };

    const startGame = () => {
        setGameState('playing');
        setRound(0);
        setTotalTime(0);
        setCorrectCount(0);
        setCongruentDelay([]);
        setIncongruentDelay([]);

        // Need to reset state first, then start. 
        // Using timeout to push to next tick
        setTimeout(() => {
            // Initial round
            const wordObj = COLORS[Math.floor(Math.random() * COLORS.length)];
            const colorObj = COLORS[Math.floor(Math.random() * COLORS.length)];
            setCurrentWord({ text: wordObj.name, colorHex: colorObj.hex, colorName: colorObj.name });
            setStartTime(Date.now());
            setRound(1); // Start at 1
        }, 0);
    };

    return (
        <GameWrapper
            title="Stroop Test"
            description="Select the COLOR of the text, ignoring the word itself."
            onRestart={startGame}
            score={gameState === 'result' ? `${Math.round(totalTime / TOTAL_ROUNDS)} ms` : null}
            bestScore={bestScore ? `${bestScore} ms` : null}
            sessionBest={sessionBest ? `${sessionBest} ms` : null}
        >
            <div className="stroop-container">
                {gameState === 'waiting' && (
                    <div className="stroop-overlay">
                        <Shuffle size={64} className="stroop-icon" />
                        <h2>COGNITIVE INTERFERENCE PROTOCOL</h2>
                        <p>Identify the <strong>INK COLOR</strong>, ignore the written word.</p>
                        <button className="stroop-btn-start" onClick={startGame}>INITIALIZE</button>
                    </div>
                )}

                {gameState === 'playing' && (
                    <div className="stroop-play">
                        <div className="stroop-hud">
                            <span>ROUND: {round} / {TOTAL_ROUNDS}</span>
                        </div>

                        <div
                            className="stroop-word"
                            style={{ color: currentWord.colorHex }}
                        >
                            {currentWord.text}
                        </div>

                        <div className="stroop-options-grid">
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
                    <div className="stroop-result-panel">
                        <div className="result-display">
                            <span className="result-val">{Math.round(totalTime / TOTAL_ROUNDS)}</span>
                            <span className="result-unit">ms</span>
                        </div>
                        <p>Average Response Time (Penalty Adjusted)</p>

                        <div className="stroop-stats-grid">
                            <div className="stroop-stat">
                                <span className="label">ACCURACY</span>
                                <span className="value">{Math.round((correctCount / TOTAL_ROUNDS) * 100)}%</span>
                            </div>
                        </div>

                        <button className="stroop-retry-btn" onClick={startGame}>
                            RE-TEST
                        </button>
                    </div>
                )}
            </div>
        </GameWrapper>
    );
}
