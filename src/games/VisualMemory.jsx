import { useState, useEffect, useRef } from 'react';
import GameWrapper from '../components/GameWrapper';
import { useGameScore } from '../hooks/useGameScore';
import { motion } from 'framer-motion';
import './VisualMemory.css';

export default function VisualMemory() {
    const { bestScore, sessionBest, saveScore } = useGameScore('visual-memory');
    const [gameState, setGameState] = useState('waiting'); // waiting, showing, playing, result
    const [level, setLevel] = useState(1);
    const [pattern, setPattern] = useState([]);
    const [userPattern, setUserPattern] = useState([]);
    const [gridSize, setGridSize] = useState(3); // 3x3 start

    // Stats
    const [lives, setLives] = useState(3);

    const generatePattern = (lvl, size) => {
        const numTiles = Math.max(3, lvl + 2);
        const newPattern = [];
        const totalTiles = size * size;

        while (newPattern.length < numTiles) {
            const rand = Math.floor(Math.random() * totalTiles);
            if (!newPattern.includes(rand)) {
                newPattern.push(rand);
            }
        }
        return newPattern;
    };

    const startGame = () => {
        setLives(3);
        setLevel(1);
        setGridSize(3);
        startLevel(1, 3);
    };

    const startLevel = (currentLevel, currentSize) => {
        setGameState('showing');
        setUserPattern([]);
        const newPattern = generatePattern(currentLevel, currentSize);
        setPattern(newPattern);

        // Show pattern for 1 second then hide
        setTimeout(() => {
            setGameState('playing');
        }, 1000 + (newPattern.length * 50)); // Scaling time based on complexity
    };

    const handleTileClick = (index) => {
        if (gameState !== 'playing') return;

        // Check if clicked tile is in pattern
        if (!pattern.includes(index)) {
            // Wrong click
            const newLives = lives - 1;
            setLives(newLives);
            // Flash red or shake?

            if (newLives <= 0) {
                setGameState('result');
                saveScore(level);
            } else {
                // Retry level with same pattern (or new? usually new in HB)
                // HB usually keeps same level but new pattern on fail, 3 strikes
                setGameState('showing');
                setUserPattern([]);
                setTimeout(() => {
                    setGameState('playing');
                }, 1000);
            }
            return;
        }

        // Correct click
        // Check if already clicked
        if (userPattern.includes(index)) return;

        const newUserPattern = [...userPattern, index];
        setUserPattern(newUserPattern);

        if (newUserPattern.length === pattern.length) {
            // Level Complete
            const nextLevel = level + 1;
            setLevel(nextLevel);
            if (nextLevel % 3 === 0) {
                setGridSize(prev => Math.min(prev + 1, 6)); // Cap at 6x6
            }
            setTimeout(() => {
                startLevel(nextLevel, nextLevel % 3 === 0 ? gridSize + 1 : gridSize);
            }, 500);
        }
    };

    return (
        <GameWrapper
            title="Visual Memory"
            description="Memorize the pattern of white squares."
            onRestart={startGame}
            score={`Level ${level}`}
            bestScore={bestScore ? `Lvl ${bestScore}` : null}
            sessionBest={sessionBest ? `Lvl ${sessionBest}` : null}
        >
            <div className="visual-memory-container">
                {gameState === 'waiting' || gameState === 'result' ? (
                    <div className="vm-start-screen">
                        {gameState === 'result' && <h1>Game Over | Level {level}</h1>}
                        <button className="vm-start-btn" onClick={startGame}>
                            {gameState === 'waiting' ? 'Start Game' : 'Try Again'}
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="vm-stats">
                            Lives: {'❤️'.repeat(lives)}
                        </div>
                        <div
                            className="vm-grid"
                            style={{
                                gridTemplateColumns: `repeat(${gridSize}, 1fr)`
                            }}
                        >
                            {Array.from({ length: gridSize * gridSize }).map((_, i) => {
                                const isActive = gameState === 'showing' && pattern.includes(i);
                                const isSelected = userPattern.includes(i);
                                const isMissed = gameState === 'playing' && !pattern.includes(i) && userPattern.includes(i); // Logic handled above, instant fail check

                                return (
                                    <motion.div
                                        key={i}
                                        className={`vm-tile ${isActive ? 'active' : ''} ${isSelected ? 'selected' : ''}`}
                                        onClick={() => handleTileClick(i)}
                                        initial={{ scale: 0.9 }}
                                        animate={{ scale: isActive || isSelected ? 1 : 0.95 }}
                                        whileHover={{ scale: 0.98 }}
                                    />
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </GameWrapper>
    );
}
