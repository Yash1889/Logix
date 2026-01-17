import { useState, useEffect } from 'react';
import GameWrapper from '../components/GameWrapper';
import { useGameScore } from '../hooks/useGameScore';
import GlassButton from '../components/ui/GlassButton';
import './LearningCurveTest.css';

// Wisconsin Card Sorting Test simplified.
// We change rule without telling user.
// Rules: Color (Red, Blue, Green, Yellow) or Shape (Circle, Square, Star, Triangle).

const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'];
const SHAPES = ['●', '■', '★', '▲'];

export default function LearningCurveTest() {
    const { bestScore, sessionBest, saveScore } = useGameScore('learning-curve');
    const [gameState, setGameState] = useState('waiting');

    const [trial, setTrial] = useState(0);
    const [currentRule, setCurrentRule] = useState('color'); // 'color' or 'shape'
    const [targetValue, setTargetValue] = useState(0); // Index of the target feature
    // e.g. Rule=Color, Target=0 (Red). All Red cards are correct.

    const [cards, setCards] = useState([]);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [errors, setErrors] = useState(0);
    const [ruleChanges, setRuleChanges] = useState(0);

    // Metric: "Trials to Adapt". How many trials after a rule change before hitting streak of 3?
    const [adaptationData, setAdaptationData] = useState([]);
    const [trialsSinceChange, setTrialsSinceChange] = useState(0);

    const generateCards = () => {
        // Generate 4 cards.
        // One must be the correct answer based on current rule? No.
        // Standard WCST: Match a reference card? 
        // Simplified: "Select the correct card".
        // We present 4 cards. One matches the rule.

        // Let's say Rule is "Red".
        // Card 0: Red Circle.
        // Card 1: Blue Square.
        // ...

        const newCards = Array(4).fill(null).map(() => ({
            color: Math.floor(Math.random() * 4),
            shape: Math.floor(Math.random() * 4)
        }));

        // Ensure at least one matches the target
        // And ensure not multiple match? Or just any match is fine?
        // WCST usually has ambiguous matches.
        // Let's ensure strict single match for simplicity of "Learning Rate".
        // If rule is COLOR=0 (Red). We need exactly 1 Red card.

        // Implementation:
        // Pick a winner position.
        const winnerIdx = Math.floor(Math.random() * 4);

        if (currentRule === 'color') {
            newCards[winnerIdx].color = targetValue;
            // Others cannot be target color
            newCards.forEach((c, i) => {
                if (i !== winnerIdx) {
                    let wrongColor = Math.floor(Math.random() * 4);
                    while (wrongColor === targetValue) wrongColor = Math.floor(Math.random() * 4);
                    c.color = wrongColor;
                }
            });
        } else {
            newCards[winnerIdx].shape = targetValue;
            // Others cannot be target shape
            newCards.forEach((c, i) => {
                if (i !== winnerIdx) {
                    let wrongShape = Math.floor(Math.random() * 4);
                    while (wrongShape === targetValue) wrongShape = Math.floor(Math.random() * 4);
                    c.shape = wrongShape;
                }
            });
        }

        return newCards;
    };

    const changeRule = () => {
        // Switch dimensionality or value?
        // WCST switches dimensionality (Color -> Shape).
        const newR = currentRule === 'color' ? 'shape' : 'color';
        const newV = Math.floor(Math.random() * 4);

        setCurrentRule(newR);
        setTargetValue(newV);
        setStreak(0);
        setTrialsSinceChange(0);
        setRuleChanges(rc => rc + 1);

        // Visual feedback? No. Part of the test is realizing it changed.
        // But usually user gets "Wrong" feedback.
    };

    const startGame = () => {
        setGameState('playing');
        setScore(0);
        setErrors(0);
        setStreak(0);
        setRuleChanges(0);
        setAdaptationData([]);

        // Init rule
        setCurrentRule('color');
        setTargetValue(Math.floor(Math.random() * 4));

        setCards(generateCards());
    };

    const handleCardClick = (cardIndex) => {
        const card = cards[cardIndex];
        const isCorrect = currentRule === 'color'
            ? card.color === targetValue
            : card.shape === targetValue;

        if (isCorrect) {
            setScore(s => s + 1);
            setStreak(s => {
                const newS = s + 1;
                if (newS >= 5) {
                    // Rule mastered. Change it.
                    // Record adaptation speed.
                    setAdaptationData(prev => [...prev, trialsSinceChange]);
                    changeRule();
                    return 0; // Reset streak
                }
                return newS;
            });
        } else {
            setErrors(e => e + 1);
            setStreak(0); // Reset streak on error
        }

        setTrialsSinceChange(t => t + 1);
        setTrial(t => t + 1);

        if (score + errors > 40) { // Max 40 trials?
            endGame();
        } else {
            setCards(generateCards());
        }
    };

    const endGame = () => {
        // Score = Efficiency?
        // Adaptation Score = Avg trials to adapt. Lower is better.
        const avgAdapt = adaptationData.length > 0
            ? adaptationData.reduce((a, b) => a + b, 0) / adaptationData.length
            : 40;

        // HB Score logic: usually higher is better.
        // Score = 100 - AvgAdapt? 
        // Or just Total Correct.

        const meta = {
            ruleChanges,
            avgAdaptationTrials: avgAdapt,
            totalErrors: errors
        };

        saveScore(score, false, meta);
        setGameState('result');
    };

    return (
        <GameWrapper
            title="Learning Curve"
            description="Figure out the hidden rule. The rule will change periodically."
            onRestart={startGame}
            score={`Correct: ${score}`}
            bestScore={bestScore ? `Best: ${bestScore}` : null}
        >
            <div className="learning-container">
                {gameState === 'waiting' && (
                    <GlassButton onClick={startGame} size="large">Start Test</GlassButton>
                )}

                {gameState === 'playing' && (
                    <div className="learning-play">
                        <div className="cards-grid">
                            {cards.map((c, i) => (
                                <div
                                    key={i}
                                    className="learning-card"
                                    style={{ color: COLORS[c.color] }}
                                    onClick={() => handleCardClick(i)}
                                >
                                    {SHAPES[c.shape]}
                                </div>
                            ))}
                        </div>
                        <p className="learning-feedback">
                            {streak > 0 ? "Correct!" : (trialsSinceChange > 0 ? "Wrong..." : "Pick a card")}
                        </p>
                    </div>
                )}

                {gameState === 'result' && (
                    <div className="learning-result">
                        <h1>Score: {score}</h1>
                        <p>You adapted to {ruleChanges} rule changes.</p>
                        <p>Avg trials to learn new rule: {adaptationData.length ? (adaptationData.reduce((a, b) => a + b, 0) / adaptationData.length).toFixed(1) : "N/A"}</p>
                        <GlassButton onClick={startGame}>Try Again</GlassButton>
                    </div>
                )}
            </div>
        </GameWrapper>
    );
}
