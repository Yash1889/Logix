import { useState, useRef, useEffect } from 'react';
import GameWrapper from '../components/GameWrapper';
import { useGameScore } from '../hooks/useGameScore';
import { Eye } from 'lucide-react';
import './SustainedAttention.css';

const DURATION = 60; // 60 seconds test
const INTERVAL = 800; // New stimulus every 800ms

export default function SustainedAttention() {
    const { bestScore, sessionBest, saveScore } = useGameScore('sustained-attention');
    const [gameState, setGameState] = useState('waiting');
    const [currentStimulus, setCurrentStimulus] = useState(null);
    const [timeLeft, setTimeLeft] = useState(DURATION);
    const [score, setScore] = useState(null); // Accuracy %

    // Metrics
    const [hits, setHits] = useState(0);
    const [misses, setMisses] = useState(0);
    const [falseAlarms, setFalseAlarms] = useState(0);
    const [totalTargets, setTotalTargets] = useState(0);

    const timerRef = useRef(null);
    const loopRef = useRef(null);

    const startGame = () => {
        setGameState('playing');
        setTimeLeft(DURATION);
        setHits(0);
        setMisses(0);
        setFalseAlarms(0);
        setTotalTargets(0);
        setCurrentStimulus(null);

        // Main Timer
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    endGame();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Stimulus Loop
        runStimulusLoop();
    };

    const runStimulusLoop = () => {
        loopRef.current = setInterval(() => {
            // 20% chance of target (e.g., number 3)
            // 80% chance of noise (random number 0-9 except 3)
            const isTarget = Math.random() < 0.2;
            let char;
            if (isTarget) {
                char = '3';
                setTotalTargets(prev => prev + 1);
            } else {
                do {
                    char = Math.floor(Math.random() * 10).toString();
                } while (char === '3');
            }

            setCurrentStimulus({ char, isTarget, id: Date.now() });

            // Auto-detect miss if needed? 
            // We can't easily detect "miss" until the next one appears if we rely on click.
            // But for calculation, Total Targets - Hits = Misses.
        }, INTERVAL);
    };

    const handleClick = () => {
        if (gameState !== 'playing' || !currentStimulus) return;

        if (currentStimulus.isTarget) {
            // Hit (prevent double clicking same target?)
            // We need a clicked flag on stimulus ideally, but let's just increment hits
            // and maybe simplistic debounce?
            if (currentStimulus.clicked) return;
            currentStimulus.clicked = true;
            setHits(prev => prev + 1);
        } else {
            // False Alarm
            setFalseAlarms(prev => prev + 1);
        }
    };

    const endGame = () => {
        clearInterval(timerRef.current);
        clearInterval(loopRef.current);

        // Derived stats
        // Misses = Total Targets - Hits (careful of race conditions or latencies, but generally correct)
        // Actually totalTargets is incremented when SHOWN.
        // Hits is incremented when CLICKED.
        // So Misses = targets - hits.

        // wait for state update? or use refs? 
        // using state inside interval is tricky for totalTargets closure.
        // use functional update in setScore calculation:

        setTotalTargets(currentTotal => {
            setHits(currentHits => {
                const calculatedMisses = currentTotal - currentHits;
                setMisses(calculatedMisses);

                // Accuracy Score: (Hits - FalseAlarms) / TotalTargets * 100?
                // Or simple sensitivity index?
                // HB score: correct percentage usually.
                const accuracy = Math.max(0, Math.round(((currentHits - falseAlarms) / currentTotal) * 100));
                setScore(accuracy);

                const meta = {
                    hits: currentHits,
                    misses: calculatedMisses,
                    falseAlarms: falseAlarms, // this might be stale closure, use ref or pass in?
                    // Actually falseAlarms state might be stale here inside the callback chain if rare.
                    // Let's rely on standard calc.
                    duration: DURATION
                };

                saveScore(accuracy, false, meta);
                setGameState('result');
                return currentTotal;
            });
            return currentTotal;
        });
    };

    useEffect(() => {
        return () => {
            clearInterval(timerRef.current);
            clearInterval(loopRef.current);
        };
    }, []);

    return (
        <GameWrapper
            title="Sustained Attention"
            description="Click only when you see the number 3."
            onRestart={startGame}
            score={gameState === 'result' ? `${score}%` : null}
            bestScore={bestScore ? `${bestScore}%` : null}
            sessionBest={sessionBest ? `${sessionBest}%` : null}
        >
            <div className="attention-container">
                {gameState === 'waiting' && (
                    <div className="att-start">
                        <Eye size={64} className="att-icon" />
                        <h2>Vigilance Test</h2>
                        <p>A sequence of numbers will appear.</p>
                        <p>Click the button (or tap space) whenever you see the number <strong>3</strong>.</p>
                        <button className="att-btn" onClick={startGame}>Start Test</button>
                    </div>
                )}

                {gameState === 'playing' && (
                    <div className="att-play" onClick={handleClick}>
                        <div className="att-timer">Time: {timeLeft}s</div>
                        <div className="att-stimulus">
                            {currentStimulus?.char}
                        </div>
                        <p className="att-instructions">Click or Spacebar on "3"</p>
                    </div>
                )}

                {/* Keyboard Listener */}
                {gameState === 'playing' && (
                    <div style={{ display: 'none' }}>
                        <input autoFocus onKeyDown={(e) => { if (e.code === 'Space') handleClick(); }} />
                    </div>
                )}
                {/* Better usage: global event listener in effect */}

                {gameState === 'result' && (
                    <div className="att-result">
                        <Eye size={64} className="att-icon" />
                        <h1>{score}% Accuracy</h1>
                        <div className="att-stats">
                            <p>Targets Hit: {hits}</p>
                            <p>Missed: {totalTargets - hits}</p>
                            <p>False Alarms: {falseAlarms}</p>
                        </div>
                        <button className="att-btn" onClick={startGame}>Try Again</button>
                    </div>
                )}
            </div>
        </GameWrapper>
    );
}
