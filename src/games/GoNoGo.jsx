import { useState, useRef } from 'react';
import GameWrapper from '../components/GameWrapper';
import { useGameScore } from '../hooks/useGameScore';
import { ShieldAlert } from 'lucide-react';
import './GoNoGo.css';

const TOTAL_ROUNDS = 20;

export default function GoNoGo() {
    const { bestScore, sessionBest, saveScore } = useGameScore('go-no-go');
    const [gameState, setGameState] = useState('waiting'); // waiting, ready, showing, result
    const [round, setRound] = useState(0);
    const [type, setType] = useState(null); // 'go' (green) or 'nogo' (red)
    const [startTime, setStartTime] = useState(0);
    const [reactionTimes, setReactionTimes] = useState([]);
    const [falseAlarms, setFalseAlarms] = useState(0);

    const timerRef = useRef(null);

    const prepareRound = () => {
        if (round >= TOTAL_ROUNDS) {
            endGame();
            return;
        }

        setType(null); // Clear previous
        setGameState('ready');

        const randomDelay = Math.random() * 1500 + 500;

        timerRef.current = setTimeout(() => {
            // 80% Go, 20% No-Go
            const newType = Math.random() < 0.8 ? 'go' : 'nogo';
            setType(newType);
            setGameState('showing');
            setStartTime(Date.now());

            // Auto-fail if too slow? Or just move on?
            // Usually Go/No-Go disappears after ~800ms
            setTimeout(() => {
                // Need to check if user clicked? 
                // If it was 'go' and they didn't click -> Miss
                // If it was 'nogo' and they didn't click -> Correct
                // We handle this logic in handleInteraction or timeouts
                handleRoundEnd(newType, false); // false = user didn't click in time
            }, 1000);

        }, randomDelay);
    };

    const handleRoundEnd = (roundType, clicked) => {
        // This might be called by timeout (not clicked) OR by click
        // We need to ensure we don't double process

        // Need a ref/state to track if round is done?
        // Simplified: If clicked, we cancel timeout.
    };

    // Actually, easiest way: 
    // - Show stimuli
    // - Set timeout for auto-miss
    // - If click, clear timeout and process

    const [canClick, setCanClick] = useState(false);
    const roundTimeoutRef = useRef(null);

    const startRoundActual = () => {
        if (round >= TOTAL_ROUNDS) {
            endGame();
            return;
        }

        setGameState('ready');
        setType(null);
        setCanClick(false);

        setTimeout(() => {
            const newType = Math.random() < 0.8 ? 'go' : 'nogo';
            setType(newType);
            setGameState('showing');
            setStartTime(Date.now());
            setCanClick(true);

            roundTimeoutRef.current = setTimeout(() => {
                // Time expired
                processInput(false, newType); // didn't click
            }, 800); // 800ms window
        }, Math.random() * 1500 + 500);
    };

    const handleClick = () => {
        if (canClick) {
            processInput(true, type);
        } else if (gameState === 'ready') {
            // Punish early click?
        }
    };

    const processInput = (clicked, currentType) => {
        clearTimeout(roundTimeoutRef.current);
        setCanClick(false);

        let rt = null;
        if (clicked) {
            const endTime = Date.now();
            rt = endTime - startTime;
        }

        // Logic
        if (currentType === 'go') {
            if (clicked) {
                // Correct Hit
                setReactionTimes(prev => [...prev, rt]);
            } else {
                // Miss (Slow)
                // Penalty? null RT
            }
        } else {
            if (clicked) {
                // False Alarm (Commission Error)
                setFalseAlarms(prev => prev + 1);
            } else {
                // Correct Rejection
            }
        }

        setRound(prev => prev + 1);
        startRoundActual();
    };

    const endGame = () => {
        // Calc average RT
        const sum = reactionTimes.reduce((a, b) => a + b, 0);
        const avg = reactionTimes.length > 0 ? Math.round(sum / reactionTimes.length) : 0;

        const meta = {
            avgRT: avg,
            falseAlarms: falseAlarms
        };

        // Score: Average RT + Penalty for false alarms?
        // Or just standard RT, but display FA.

        saveScore(avg, true, meta); // Lower is better
        setGameState('result');
    };

    const startGame = () => {
        setRound(0);
        setReactionTimes([]);
        setFalseAlarms(0);
        setGameState('playing');
        startRoundActual();
    };

    return (
        <GameWrapper
            title="Go / No-Go"
            description="Click GREEN. Do NOT click RED."
            onRestart={startGame}
            score={gameState === 'result' ? `${Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length || 0)} ms` : null}
            bestScore={bestScore ? `${bestScore} ms` : null}
            sessionBest={sessionBest ? `${sessionBest} ms` : null}
        >
            <div className="gonogo-container" onMouseDown={handleClick}>
                {gameState === 'waiting' && <button className="gn-btn" onClick={startGame}>Start</button>}

                {gameState === 'ready' && <div className="gn-box waiting">+</div>}

                {gameState === 'showing' && (
                    <div className={`gn-box ${type}`}>
                        {type === 'go' ? 'GO' : 'NO'}
                    </div>
                )}

                {gameState === 'result' && (
                    <div className="gn-result">
                        <h1>Average: {Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length || 0)} ms</h1>
                        <p>False Alarms: {falseAlarms}</p>
                        <button className="gn-btn" onClick={startGame}>Try Again</button>
                    </div>
                )}
            </div>
        </GameWrapper>
    );
}
