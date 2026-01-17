import { useState } from 'react';
import GameWrapper from '../components/GameWrapper';
import { useGameScore } from '../hooks/useGameScore';
import GlassButton from '../components/ui/GlassButton';
import './BiasBenchmarks.css';

// Anchoring Bias Test:
// 1. Ask useless calculation (High or Low anchor).
// 2. Ask estimation question.
// 3. Measure deviation from true value towards anchor.

const SCENARIOS = [
    {
        topic: "Population of Peru",
        anchorLow: "Is the population of Peru less than 5 million?",
        anchorHigh: "Is the population of Peru more than 100 million?",
        trueValue: 34, // ~34 million
        unit: "million"
    },
    {
        topic: "Height of Everest",
        anchorLow: "Is Mt Everest shorter than 2,000 feet?",
        anchorHigh: "Is Mt Everest taller than 45,000 feet?",
        trueValue: 29032, // ft
        unit: "feet"
    }
];

export default function BiasBenchmarks() {
    const { saveScore } = useGameScore('bias-benchmarks');
    const [gameState, setGameState] = useState('waiting');

    const [scenarioIdx, setScenarioIdx] = useState(0);
    const [anchorType, setAnchorType] = useState('none'); // 'low' or 'high'
    const [step, setStep] = useState(0); // 0=Anchor Q, 1=Estimation
    const [estimate, setEstimate] = useState('');

    const [results, setResults] = useState([]); // { type: 'low', diff: -10 }

    const startScenario = () => {
        // Random anchor
        setAnchorType(Math.random() > 0.5 ? 'low' : 'high');
        setStep(0);
        setEstimate('');
    };

    const startGame = () => {
        setGameState('playing');
        setScenarioIdx(0);
        setResults([]);
        startScenario();
    };

    const handleAnchorAnswer = () => {
        setStep(1);
    };

    const submitEstimate = () => {
        const val = parseFloat(estimate);
        const scene = SCENARIOS[scenarioIdx];
        const diff = val - scene.trueValue;

        const res = {
            topic: scene.topic,
            anchor: anchorType,
            estimate: val,
            trueVal: scene.trueValue,
            diff
        };

        const newRes = [...results, res];
        setResults(newRes);

        if (scenarioIdx < SCENARIOS.length - 1) {
            setScenarioIdx(s => s + 1);
            startScenario();
        } else {
            endGame(newRes);
        }
    };

    const endGame = (finalResults) => {
        // Metric: "Anchoring Coeff".
        // Did High anchors cause positive diffs?
        // Did Low anchors cause negative diffs?

        let biasScore = 0;
        finalResults.forEach(r => {
            if (r.anchor === 'high' && r.diff > 0) biasScore += 1;
            if (r.anchor === 'low' && r.diff < 0) biasScore += 1;
        });

        // Max score = num scenarios.
        const biasPercent = (biasScore / SCENARIOS.length) * 100;

        const meta = {
            details: finalResults,
            biasPercent
        };

        saveScore(biasPercent, false, meta); // % Susceptibility
        setGameState('result');
    };

    const currentScene = SCENARIOS[scenarioIdx];

    return (
        <GameWrapper
            title="Bias Benchmarks"
            description="A test of your susceptibility to cognitive biases (Anchoring)."
            onRestart={startGame}
            score={gameState === 'result' ? "Complete" : `Scenario ${scenarioIdx + 1}`}
            bestScore={null}
        >
            <div className="bias-container">
                {gameState === 'waiting' && (
                    <GlassButton onClick={startGame} size="large">Begin Assessment</GlassButton>
                )}

                {gameState === 'playing' && (
                    <div className="bias-play">
                        {step === 0 ? (
                            <div className="bias-step">
                                <h2>Question 1</h2>
                                <p className="bias-q">
                                    {anchorType === 'low' ? currentScene.anchorLow : currentScene.anchorHigh}
                                </p>
                                <div className="bias-opts">
                                    <GlassButton onClick={handleAnchorAnswer} variant="secondary">No</GlassButton>
                                    <GlassButton onClick={handleAnchorAnswer} variant="secondary">Yes</GlassButton>
                                </div>
                            </div>
                        ) : (
                            <div className="bias-step">
                                <h2>Question 2</h2>
                                <p className="bias-q">
                                    What is your best estimate of the <strong>{currentScene.topic}</strong> (in {currentScene.unit})?
                                </p>
                                <input
                                    type="number"
                                    className="bias-input"
                                    value={estimate}
                                    onChange={(e) => setEstimate(e.target.value)}
                                    placeholder="Type number..."
                                />
                                <GlassButton onClick={submitEstimate} disabled={!estimate}>Submit</GlassButton>
                            </div>
                        )}
                    </div>
                )}

                {gameState === 'result' && (
                    <div className="bias-result">
                        <h1>Susceptibility: {bestScore ?? 0}%</h1>
                        <p>How much did the first random number influence your second answer?</p>
                        <div className="bias-breakdown">
                            {results.map((r, i) => (
                                <div key={i} className="bias-row">
                                    <span>{r.topic}</span>
                                    <span className={r.anchor === 'high' ? 'red' : 'blue'}>Anchor: {r.anchor.toUpperCase()}</span>
                                    <span>You: {r.estimate}</span>
                                    <span>True: {r.trueVal}</span>
                                </div>
                            ))}
                        </div>
                        <GlassButton onClick={startGame}>Re-Test</GlassButton>
                    </div>
                )}
            </div>
        </GameWrapper>
    );
}
