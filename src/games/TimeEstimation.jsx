import { useState, useRef } from 'react';
import GameWrapper from '../components/GameWrapper';
import { useGameScore } from '../hooks/useGameScore';
import GlassButton from '../components/ui/GlassButton';
import './TimeEstimation.css';

const TARGET_TIME = 10000; // 10s

export default function TimeEstimation() {
    const { bestScore, sessionBest, saveScore } = useGameScore('time-estimation');
    const [gameState, setGameState] = useState('waiting');
    const [startTime, setStartTime] = useState(0);
    const [heldTime, setHeldTime] = useState(0);
    const [diff, setDiff] = useState(0);

    const interactionStart = () => {
        if (gameState === 'waiting' || gameState === 'result') {
            setGameState('holding');
            setStartTime(Date.now());
        }
    };

    const interactionEnd = () => {
        if (gameState === 'holding') {
            const end = Date.now();
            const duration = end - startTime;
            setHeldTime(duration);

            const difference = Math.abs(duration - TARGET_TIME);
            setDiff(difference);

            endGame(difference);
        }
    };

    const endGame = (difference) => {
        // Score = Deviation in ms (Lower is better).
        // HB usually positive points? 
        // Let's store Deviation as score (Lower Better).

        const meta = {
            target: TARGET_TIME,
            actual: heldTime, // This var is state, might be stale? No, calculated in interactionEnd.
            // Wait, passing 'duration' would be safer than reading state 'heldTime'.
        };

        saveScore(difference, true, meta);
        setGameState('result');
    };

    return (
        <GameWrapper
            title="Time Estimation"
            description="Press and hold the button for exactly 10 seconds."
            onRestart={() => setGameState('waiting')}
            score={gameState === 'result' ? `Off by ${diff}ms` : "Hold for 10s"}
            bestScore={bestScore !== null ? `Best Diff: ${bestScore}ms` : null}
        >
            <div className="time-est-container">
                <div
                    className={`time-button ${gameState === 'holding' ? 'active' : ''}`}
                    onMouseDown={interactionStart}
                    onMouseUp={interactionEnd}
                    onTouchStart={interactionStart}
                    onTouchEnd={interactionEnd}
                >
                    <div className="time-inner">
                        {gameState === 'waiting' && "HOLD ME"}
                        {gameState === 'holding' && "Counting..."}
                        {gameState === 'result' && `${(heldTime / 1000).toFixed(3)}s`}
                    </div>
                </div>

                {gameState === 'result' && (
                    <div className="time-result">
                        <h2>Result</h2>
                        <p>Target: 10.000s</p>
                        <p>You: {(heldTime / 1000).toFixed(3)}s</p>
                        <h1 className={diff < 500 ? 'good' : 'bad'}>
                            {diff}ms Error
                        </h1>
                        <GlassButton onClick={() => setGameState('waiting')}>Try Again</GlassButton>
                    </div>
                )}
            </div>
        </GameWrapper>
    );
}
