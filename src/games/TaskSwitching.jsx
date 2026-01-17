import { useState, useEffect, useRef } from 'react';
import GameWrapper from '../components/GameWrapper';
import { useGameScore } from '../hooks/useGameScore';
import GlassButton from '../components/ui/GlassButton';
import { Shuffle, ArrowRight, ArrowLeft } from 'lucide-react';
import './TaskSwitching.css';

const TOTAL_TRIALS = 40;

export default function TaskSwitching() {
    const { bestScore, sessionBest, saveScore } = useGameScore('task-switching');
    const [gameState, setGameState] = useState('waiting');

    // Tasks: 
    // 1. NUMBER: Odd vs Even (Color: Blue)
    // 2. LETTER: Vowel vs Consonant (Color: Orange)
    // Stimulus: A combo like "7" or "K" or "4" or "A"
    // Logic: 
    // Top half of screen = Task 1 (Number)
    // Bottom half of screen = Task 2 (Letter)? 
    // OR: Color coded cue?
    // Classic implementation: Stimulus appears in one of 4 quadrants, or color indicates rule.

    // Let's use Color Rule:
    // BLUE card = Is it ODD? (Yes/No)
    // ORANGE card = Is it High (>5)? (Yes/No)
    // Let's stick to user request: "Alternate between 2 simple rules"

    // Rule A (Blue): Odd / Even
    // Rule B (Orange): High (> 5) / Low (< 5)
    // Stimulus: A number 1-9 (excluding 5)

    const [trial, setTrial] = useState(0);
    const [stimulus, setStimulus] = useState(null);
    const [rule, setRule] = useState(null); // 'parity' or 'magnitude'
    const [startTime, setStartTime] = useState(0);
    const [history, setHistory] = useState([]);

    // We need to generate a sequence allowing analysis of "Switch Cost"
    // Switch Cost = (Avg RT on Switch Trials) - (Avg RT on Repeat Trials)
    // Sequence should be pseudo-random.

    const generateTrial = (prevRule) => {
        const isSwitch = Math.random() > 0.5;
        const newRule = isSwitch ? (prevRule === 'parity' ? 'magnitude' : 'parity') : prevRule;
        // If first trial, pick random
        const actualRule = prevRule ? newRule : (Math.random() > 0.5 ? 'parity' : 'magnitude');

        // Generate Number 1-9 excl 5
        const nums = [1, 2, 3, 4, 6, 7, 8, 9];
        const num = nums[Math.floor(Math.random() * nums.length)];

        return {
            rule: actualRule,
            value: num,
            isSwitch: prevRule ? (actualRule !== prevRule) : false
        };
    };

    const startGame = () => {
        setGameState('playing');
        setHistory([]);
        setTrial(0);
        nextTrial(null);
    };

    const nextTrial = (prevRule) => {
        if (trial >= TOTAL_TRIALS) {
            endGame();
            return;
        }

        const t = generateTrial(prevRule);
        setRule(t.rule);
        setStimulus(t.value);
        setStartTime(Date.now());
        setTrial(prev => prev + 1);
    };

    const handleResponse = (input) => {
        // input: 'left' or 'right'
        // Mapping:
        // Parity: Left = Odd, Right = Even
        // Magnitude: Left = Low, Right = High

        const rt = Date.now() - startTime;

        let correct = false;
        if (rule === 'parity') {
            const isOdd = stimulus % 2 !== 0;
            if (isOdd && input === 'left') correct = true;
            if (!isOdd && input === 'right') correct = true;
        } else {
            const isLow = stimulus < 5;
            if (isLow && input === 'left') correct = true;
            if (!isLow && input === 'right') correct = true;
        }

        const result = {
            rt,
            correct,
            isSwitch: trial === 1 ? false : (history.length > 0 && history[history.length - 1].rule !== rule),
            rule
        };

        const newHistory = [...history, result];
        setHistory(newHistory);

        if (newHistory.length >= TOTAL_TRIALS) {
            analyzeGame(newHistory);
        } else {
            nextTrial(rule);
        }
    };

    const analyzeGame = (finalHistory) => {
        const correctTrials = finalHistory.filter(h => h.correct);
        const accuracy = (correctTrials.length / TOTAL_TRIALS) * 100;

        // Calculate Switch Cost
        const switchTrials = correctTrials.filter(h => h.isSwitch);
        const repeatTrials = correctTrials.filter(h => !h.isSwitch && h.rt < 2000); // Filter outliers?

        const avgSwitch = switchTrials.reduce((sum, t) => sum + t.rt, 0) / (switchTrials.length || 1);
        const avgRepeat = repeatTrials.reduce((sum, t) => sum + t.rt, 0) / (repeatTrials.length || 1);

        const switchCost = Math.round(avgSwitch - avgRepeat);

        const meta = {
            accuracy,
            avgSwitchRT: Math.round(avgSwitch),
            avgRepeatRT: Math.round(avgRepeat),
            switchCost
        };

        // Main Score: Switch Cost (Lower is Better)
        // But we usually store "Points" or something. 
        // HB usually scores Reaction Time games by Time.
        // Let's store Switch Cost.
        saveScore(switchCost, true, meta);
        setGameState('result');
    };

    return (
        <GameWrapper
            title="Task Switching"
            description="Blue Card: Odd (Left) / Even (Right). Orange Card: Low (Left) / High (Right)."
            onRestart={startGame}
            score={`Trial: ${trial}/${TOTAL_TRIALS}`}
            bestScore={bestScore !== null ? `${bestScore}ms Cost` : null} // Display "Cost"
        >
            <div className="ts-container">
                {gameState === 'waiting' && (
                    <div className="ts-intro">
                        <div className="ts-rules">
                            <div className="rule-card blue">
                                <h3>BLUE RULE</h3>
                                <p>ODD vs EVEN</p>
                                <div className="keys">Look for Parity</div>
                            </div>
                            <div className="rule-card orange">
                                <h3>ORANGE RULE</h3>
                                <p>LOW vs HIGH</p>
                                <div className="keys">(&lt; 5) vs (&gt; 5)</div>
                            </div>
                        </div>
                        <div className="ts-controls-info">
                            <span>LEFT ARROW</span>
                            <span>RIGHT ARROW</span>
                            <small>Odd / Low</small>
                            <small>Even / High</small>
                        </div>
                        <GlassButton variant="primary" size="large" onClick={startGame}>Start Test</GlassButton>
                    </div>
                )}

                {gameState === 'playing' && (
                    <div className="ts-play">
                        <div className={`ts-card ${rule === 'parity' ? 'blue' : 'orange'}`}>
                            {stimulus}
                        </div>
                        <div className="ts-controls">
                            <button className="ts-btn" onClick={() => handleResponse('left')}>
                                <ArrowLeft /> {rule === 'parity' ? 'ODD' : 'LOW'}
                            </button>
                            <button className="ts-btn" onClick={() => handleResponse('right')}>
                                {rule === 'parity' ? 'EVEN' : 'HIGH'} <ArrowRight />
                            </button>
                        </div>
                        <p className="ts-hint">Use Arrow Keys or Buttons</p>
                    </div>
                )}

                {gameState === 'result' && (
                    <div className="ts-result">
                        <h1>Switch Cost: {bestScore}ms</h1>
                        <p>Accuracy: {Math.round(history.filter(h => h.correct).length / TOTAL_TRIALS * 100)}%</p>
                        <div className="ts-stats">
                            <div className="stat">
                                <span>Repeat Speed</span>
                                <strong>{Math.round(history.filter(h => !h.isSwitch && h.correct).reduce((a, b) => a + b.rt, 0) / history.filter(h => !h.isSwitch && h.correct).length || 0)}ms</strong>
                            </div>
                            <div className="stat">
                                <span>Switch Speed</span>
                                <strong>{Math.round(history.filter(h => h.isSwitch && h.correct).reduce((a, b) => a + b.rt, 0) / history.filter(h => h.isSwitch && h.correct).length || 0)}ms</strong>
                            </div>
                        </div>
                        <GlassButton onClick={startGame}>Try Again</GlassButton>
                    </div>
                )}
            </div>
        </GameWrapper>
    );
}
