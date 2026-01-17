import { useState, useEffect } from 'react';
import GameWrapper from '../components/GameWrapper';
import { useGameScore } from '../hooks/useGameScore';
import './SequenceMemory.css';

export default function SequenceMemory() {
    const { bestScore, sessionBest, saveScore } = useGameScore('sequence-memory');
    const [gameState, setGameState] = useState('waiting'); // waiting, displaying, playing, result
    const [level, setLevel] = useState(1);
    const [sequence, setSequence] = useState([]);
    const [userSequence, setUserSequence] = useState([]);
    const [activeWait, setActiveWait] = useState(false); // To block interaction during display

    // 3x3 Grid
    const GRID_SIZE = 9;

    const startLevel = (lvl) => {
        setGameState('displaying');
        setActiveWait(true);
        setUserSequence([]);

        // Add one new step to sequence
        const nextStep = Math.floor(Math.random() * GRID_SIZE);

        // If level 1, start fresh, else append
        let newSequence;
        if (lvl === 1) {
            newSequence = [nextStep];
        } else {
            newSequence = [...sequence, nextStep];
        }
        setSequence(newSequence);

        // Play Sequence
        let step = 0;
        const interval = setInterval(() => {
            if (step >= newSequence.length) {
                clearInterval(interval);
                setTimeout(() => {
                    setGameState('playing');
                    setActiveWait(false);
                }, 500);
                return;
            }

            // Highlight
            const tileIndex = newSequence[step];
            highlightTile(tileIndex);
            step++;
        }, 600); // Speed of sequence
    };

    const highlightTile = (index) => {
        const el = document.getElementById(`tile-${index}`);
        if (el) {
            el.classList.add('flash');
            setTimeout(() => el.classList.remove('flash'), 300);
        }
    };

    const handleTileClick = (index) => {
        if (gameState !== 'playing' || activeWait) return;

        // Flash on click
        highlightTile(index);

        const expected = sequence[userSequence.length];
        if (index === expected) {
            const newUserSeq = [...userSequence, index];
            setUserSequence(newUserSeq);

            if (newUserSeq.length === sequence.length) {
                // Level Complete
                const nextLevel = level + 1;
                setLevel(nextLevel);
                setTimeout(() => {
                    startLevel(nextLevel);
                }, 800);
            }
        } else {
            // Fail
            const meta = {
                maxSequence: level
            };
            saveScore(level, false, meta);
            setGameState('result');
        }
    };

    const startGame = () => {
        setLevel(1);
        setSequence([]);
        startLevel(1);
    };

    return (
        <GameWrapper
            title="Sequence Memory"
            description="Memorize the pattern."
            onRestart={startGame}
            score={`Level ${level}`}
            bestScore={bestScore ? `Lvl ${bestScore}` : null}
            sessionBest={sessionBest ? `Lvl ${sessionBest}` : null}
        >
            <div className="sequence-memory-container">
                {gameState === 'waiting' || gameState === 'result' ? (
                    <div className="sm-start-screen">
                        {gameState === 'result' && <h1>Game Over | Level {level}</h1>}
                        <button className="sm-btn primary" onClick={startGame}>
                            {gameState === 'waiting' ? 'Start Game' : 'Try Again'}
                        </button>
                    </div>
                ) : (
                    <div className="sm-grid">
                        {Array.from({ length: GRID_SIZE }).map((_, i) => (
                            <div
                                key={i}
                                id={`tile-${i}`}
                                className="sm-tile"
                                onClick={() => handleTileClick(i)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </GameWrapper>
    );
}
