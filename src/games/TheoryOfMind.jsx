import { useState } from 'react';
import GameWrapper from '../components/GameWrapper';
import { useGameScore } from '../hooks/useGameScore';
import GlassButton from '../components/ui/GlassButton';
import './TheoryOfMind.css';

// Simple text scenarios testing perspective taking.

const SCENARIOS = [
    {
        text: "Sam puts his chocolate in the fridge and leaves. While he is gone, Maria moves it to the cupboard. Sam returns to eat the chocolate.",
        question: "Where will Sam look for the chocolate?",
        options: ["The Fridge", "The Cupboard", "His Pocket"],
        correct: 0 // Fridge
    },
    {
        text: "You are in a meeting. Your boss has spinach in her teeth. She smiles widely at a client. The client looks away quickly.",
        question: "Why did the client look away?",
        options: ["He hates spinach", "He felt embarrassed for her", "He was bored"],
        correct: 1 // Embarrassed
    }
    // Would add more in production
];

export default function TheoryOfMind() {
    const { saveScore } = useGameScore('theory-of-mind');
    const [gameState, setGameState] = useState('waiting');

    const [idx, setIdx] = useState(0);
    const [score, setScore] = useState(0);

    const handleAnswer = (optIdx) => {
        const isCorrect = optIdx === SCENARIOS[idx].correct;
        const newScore = isCorrect ? score + 1 : score;
        setScore(newScore);

        if (idx < SCENARIOS.length - 1) {
            setIdx(i => i + 1);
        } else {
            // End
            // Score = Correct count
            const finalScore = isCorrect ? score + 1 : score;
            // If answer was last one, score updated? No, state update in next render.
            // Use local var

            saveScore(newScore, false, { total: SCENARIOS.length });
            setGameState('result');
        }
    };

    const startGame = () => {
        setGameState('playing');
        setIdx(0);
        setScore(0);
    };

    return (
        <GameWrapper
            title="Theory of Mind"
            description="Predict what others are thinking or feeling in these scenarios."
            onRestart={startGame}
            score={`Score: ${score}`}
            bestScore={null}
        >
            <div className="tom-container">
                {gameState === 'waiting' && <GlassButton onClick={startGame} size="large">Start</GlassButton>}

                {gameState === 'playing' && (
                    <div className="tom-card">
                        <p className="tom-text">{SCENARIOS[idx].text}</p>
                        <h3>{SCENARIOS[idx].question}</h3>
                        <div className="tom-opts">
                            {SCENARIOS[idx].options.map((opt, i) => (
                                <GlassButton key={i} onClick={() => handleAnswer(i)} variant="secondary">
                                    {opt}
                                </GlassButton>
                            ))}
                        </div>
                    </div>
                )}

                {gameState === 'result' && (
                    <div className="tom-result">
                        <h1>Score: {score} / {SCENARIOS.length}</h1>
                        <GlassButton onClick={startGame}>Retry</GlassButton>
                    </div>
                )}
            </div>
        </GameWrapper>
    );
}
