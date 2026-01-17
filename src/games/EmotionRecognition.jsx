import { useState } from 'react';
import GameWrapper from '../components/GameWrapper';
import { useGameScore } from '../hooks/useGameScore';
import './EmotionRecognition.css';

const EMOTIONS = [
    { emoji: '😠', name: 'Anger' },
    { emoji: '😨', name: 'Fear' },
    { emoji: '🤢', name: 'Disgust' },
    { emoji: '😄', name: 'Happiness' },
    { emoji: '😢', name: 'Sadness' },
    { emoji: '😲', name: 'Surprise' },
    { emoji: '😐', name: 'Neutral' },
    { emoji: '😒', name: 'Contempt' }, // or Annoyance
];

const ROUNDS = 10;

export default function EmotionRecognition() {
    const { bestScore, sessionBest, saveScore } = useGameScore('emotion-recognition');
    const [gameState, setGameState] = useState('waiting');
    const [round, setRound] = useState(0);
    const [target, setTarget] = useState(null);
    const [startTime, setStartTime] = useState(0);
    const [totalTime, setTotalTime] = useState(0);
    const [correct, setCorrect] = useState(0);

    const nextRound = () => {
        if (round >= ROUNDS) {
            endGame();
            return;
        }

        // Pick random emotion
        const t = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];
        setTarget(t);
        setStartTime(Date.now());
        setRound(r => r + 1);
    };

    const handleGuess = (name) => {
        const endTime = Date.now();
        setTotalTime(prev => prev + (endTime - startTime));

        if (name === target.name) {
            setCorrect(prev => prev + 1);
        }

        nextRound();
    };

    const endGame = () => {
        // Score = Avg Time? Or Accuracy?
        // Let's use Accuracy primarily, with Time as meta.
        // Actually HB "EQ" is usually correct ID.
        // Let's generate a "EQ Score": (Correct * 1000) - AvgTime? 
        // Simple: Correct Count.

        const avgTime = Math.round(totalTime / ROUNDS);
        const meta = {
            avgTimeMs: avgTime,
            accuracy: (correct / ROUNDS) * 100
        };

        saveScore(correct, false, meta);
        setGameState('result');
    };

    const startGame = () => {
        setGameState('playing');
        setRound(0);
        setCorrect(0);
        setTotalTime(0);
        nextRound(); // Start round 1 logic (will update round to 1)
    };

    return (
        <GameWrapper
            title="Emotion Recognition"
            description="Identify the emotion shown as fast as you can."
            onRestart={startGame}
            score={`Correct: ${correct}/${round}`}
            bestScore={bestScore ? `${bestScore}/${ROUNDS}` : null}
            sessionBest={sessionBest ? `${sessionBest}/${ROUNDS}` : null}
        >
            <div className="emotion-container">
                {gameState === 'waiting' && <button className="emotion-btn start" onClick={startGame}>Start Test</button>}

                {gameState === 'playing' && target && (
                    <div className="emotion-play">
                        <div className="emotion-face">{target.emoji}</div>
                        <div className="emotion-grid">
                            {EMOTIONS.map(e => (
                                <button key={e.name} className="emotion-opt" onClick={() => handleGuess(e.name)}>
                                    {e.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {gameState === 'result' && (
                    <div className="emotion-result">
                        <h1>Score: {correct} / {ROUNDS}</h1>
                        <p>Average Speed: {Math.round(totalTime / ROUNDS)}ms</p>
                        <button className="emotion-btn start" onClick={startGame}>Try Again</button>
                    </div>
                )}
            </div>
        </GameWrapper>
    );
}
