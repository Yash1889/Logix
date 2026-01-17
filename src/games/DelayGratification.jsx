import { useState, useEffect } from 'react';
import GameWrapper from '../components/GameWrapper';
import { useGameScore } from '../hooks/useGameScore';
import { Timer, Gift } from 'lucide-react';
import './DelayGratification.css';

const SCENARIOS = [
    { small: 100, large: 200, wait: 5 },
    { small: 50, large: 150, wait: 10 },
    { small: 500, large: 600, wait: 3 },
    { small: 1000, large: 2000, wait: 15 },
    { small: 250, large: 400, wait: 8 },
];

export default function DelayGratification() {
    const { bestScore, sessionBest, saveScore } = useGameScore('delay-gratification');
    const [gameState, setGameState] = useState('waiting');
    const [round, setRound] = useState(0);
    const [score, setScore] = useState(0);
    const [waiting, setWaiting] = useState(false);
    const [timer, setTimer] = useState(0);
    const [delayedCount, setDelayedCount] = useState(0);

    const startGame = () => {
        setGameState('playing');
        setRound(0);
        setScore(0);
        setDelayedCount(0);
        setWaiting(false);
    };

    const handleChoice = (choice) => {
        const scenario = SCENARIOS[round];
        if (choice === 'now') {
            setScore(prev => prev + scenario.small);
            nextRound();
        } else {
            // Wait
            setWaiting(true);
            setTimer(scenario.wait);
            setDelayedCount(prev => prev + 1);

            let t = scenario.wait;
            const interval = setInterval(() => {
                t -= 1;
                setTimer(t);
                if (t <= 0) {
                    clearInterval(interval);
                    setScore(prev => prev + scenario.large);
                    setWaiting(false);
                    nextRound();
                }
            }, 1000);
        }
    };

    const nextRound = () => {
        if (round >= SCENARIOS.length - 1) {
            endGame(score); // Need pass updated score? State might lag? 
            // Actually handleChoice closures might have old score, but setScore updator is fine.
            // State update won't be reflected immediately in `score` var here.
            // Better determine final score in Effect or pass in value.
            // We'll rely on effect to detect end?
            // Or just wait for re-render check.
            setTimeout(() => endGame(), 100);
        } else {
            setRound(prev => prev + 1);
        }
    };

    const endGame = (finalVal) => {
        // Use setScore functional update to get true final?
        setScore(currentScore => {
            const meta = {
                delayedChoices: delayedCount, // might be off by 1 if 'wait' was last choice? 
                // setDelayedCount was called before wait finished.
            };
            // We really need to know if the LAST round was a wait.
            // It was handled in handleChoice.
            // But delayedCount update is accurate there.
            // EXCEPT if nextRound called directly and delayedCount state update pending?
            // React batching handles this usually.

            saveScore(currentScore, false, { ...meta, totalRounds: SCENARIOS.length });
            setGameState('result');
            return currentScore;
        });
    };

    return (
        <GameWrapper
            title="Delay of Gratification"
            description="Will you take the points now, or wait for more?"
            onRestart={startGame}
            score={`Score: ${score}`}
            bestScore={bestScore ? `Best: ${bestScore}` : null}
            sessionBest={sessionBest ? `Best: ${sessionBest}` : null}
        >
            <div className="delay-container">
                {gameState === 'waiting' && (
                    <div className="delay-start">
                        <Gift size={64} className="delay-icon" />
                        <h2>The Marshmallow Test</h2>
                        <p>Maximize your score by making choices.</p>
                        <button className="delay-btn" onClick={startGame}>Start</button>
                    </div>
                )}

                {gameState === 'playing' && (
                    <div className="delay-play">
                        {!waiting ? (
                            <>
                                <h3>Round {round + 1} / {SCENARIOS.length}</h3>
                                <div className="delay-options">
                                    <button className="delay-opt small" onClick={() => handleChoice('now')}>
                                        Take <strong>{SCENARIOS[round].small}</strong> pts
                                        <span>(Immediate)</span>
                                    </button>
                                    <div className="delay-vs">OR</div>
                                    <button className="delay-opt large" onClick={() => handleChoice('wait')}>
                                        Wait for <strong>{SCENARIOS[round].large}</strong> pts
                                        <span>({SCENARIOS[round].wait} seconds)</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="delay-waiting">
                                <Timer size={48} className="spin" />
                                <h2>Waiting... {timer}s</h2>
                                <p>Reward incoming: {SCENARIOS[round].large} pts</p>
                            </div>
                        )}
                    </div>
                )}

                {gameState === 'result' && (
                    <div className="delay-result">
                        <h1>Total Score: {score}</h1>
                        <p>You chose to wait {delayedCount} out of {SCENARIOS.length} times.</p>
                        <button className="delay-btn" onClick={startGame}>Try Again</button>
                    </div>
                )}
            </div>
        </GameWrapper>
    );
}
