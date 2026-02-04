import { useState, useEffect } from 'react';
import GameWrapper from '../components/GameWrapper';
import { useGameScore } from '../hooks/useGameScore';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid, Eye } from 'lucide-react';
import './VisualMemory.css';

export default function VisualMemory() {
    const { bestScore, sessionBest, saveScore } = useGameScore('visual-memory');
    const [gameState, setGameState] = useState('waiting'); // waiting, showing, playing, result
    const [level, setLevel] = useState(1);
    const [gridSize, setGridSize] = useState(3);
    const [pattern, setPattern] = useState([]);
    const [userPattern, setUserPattern] = useState([]);
    const [lives, setLives] = useState(3);
    const [wrongTile, setWrongTile] = useState(null);

    // Generate Pattern based on level
    const generatePattern = (lvl) => {
        // Tiles = level + 2
        const tileCount = lvl + 2;
        // Logic: 
        // Lvl 1: 3 tiles (3x3 grid)
        // Lvl 2: 4 tiles (3x3 grid)
        // Lvl 3: 5 tiles (4x4 grid - increased complexity early for engagement)

        let size = 3;
        if (lvl >= 7) size = 5;
        else if (lvl >= 3) size = 4;

        setGridSize(size);

        const totalTiles = size * size;
        const newPattern = new Set();
        while (newPattern.size < tileCount) {
            newPattern.add(Math.floor(Math.random() * totalTiles));
        }
        return Array.from(newPattern);
    };

    const startLevel = () => {
        setGameState('showing');
        setUserPattern([]);
        setWrongTile(null);

        setTimeout(() => {
            const newPattern = generatePattern(level);
            setPattern(newPattern);

            // Time to memorize increases slightly with level but stays snappy
            const showTime = 1000 + (level * 100);

            setTimeout(() => {
                setGameState('playing');
            }, showTime); // Dynamic show time
        }, 500);
    };

    const handleTileClick = (index) => {
        if (gameState !== 'playing') return;
        if (userPattern.includes(index)) return;
        if (wrongTile === index) return;

        if (pattern.includes(index)) {
            // Correct
            const newUserPattern = [...userPattern, index];
            setUserPattern(newUserPattern);

            if (newUserPattern.length === pattern.length) {
                // Level Complete
                setTimeout(() => {
                    setLevel(prev => prev + 1);
                    setGameState('showing'); // Immediate transition state
                    setTimeout(startLevel, 800);
                }, 200);
            }
        } else {
            // Wrong
            setWrongTile(index);
            const newLives = lives - 1;
            setLives(newLives);

            // Reveal pattern briefly?
            // Standard behavior: Correct error shown, then retry or game over.
            // If lives > 0: Reset the current pattern attempt? Or just count the strike and let them continue?
            // "Standard" Visual Memory usually counts a strike, shows the miss, but lets you continue clicking.
            // But if you miss 3 times, game over.
            // To make it clear: Shake screen, reduce life, keep playing same level pattern?
            // Let's reset the level pattern on error to force re-memorization? No that's confusing if pattern changes.
            // Let's just deduct life and let them try again on the same grid state.

            if (newLives <= 0) {
                endGame();
            } else {
                setTimeout(() => setWrongTile(null), 500); // Clear error feedback
            }
        }
    };

    const endGame = () => {
        const finalScore = level;

        const meta = {
            finalLevel: level,
            gridSize: gridSize
        };

        saveScore(finalScore, false, meta); // Higher is better
        setGameState('result');
    };

    const startGame = () => {
        setLevel(1);
        setPattern([]);
        setLives(3);
        startLevel();
    };

    return (
        <GameWrapper
            title="Visual Memory"
            description="Memorize the activated grid nodes."
            onRestart={startGame}
            score={`Level ${level} | Lives ${lives}`}
            bestScore={bestScore ? `Lvl ${bestScore}` : null}
            sessionBest={sessionBest ? `Lvl ${sessionBest}` : null}
        >
            <div className="vm-container">
                {gameState === 'waiting' && (
                    <div className="vm-overlay">
                        <Grid size={64} className="vm-icon" />
                        <h2>VISUAL PATTERN BUFFER</h2>
                        <p>Retain the node sequence in working memory.</p>
                        <button className="vm-btn-start" onClick={startGame}>INITIALIZE</button>
                    </div>
                )}

                {(gameState === 'showing' || gameState === 'playing') && (
                    <div className="vm-play-area">
                        <div
                            className="vm-grid"
                            style={{
                                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                                gap: '8px',
                                maxWidth: '400px'
                            }}
                        >
                            {Array.from({ length: gridSize * gridSize }).map((_, i) => {
                                const isPatternTile = pattern.includes(i);
                                const isSelected = userPattern.includes(i);
                                const isWrong = wrongTile === i;
                                const showPattern = gameState === 'showing' && isPatternTile;

                                let className = 'vm-tile';
                                if (showPattern) className += ' show'; // Active pattern during reveal
                                if (isSelected) className += ' correct';
                                if (isWrong) className += ' wrong';

                                return (
                                    <motion.div
                                        key={i}
                                        className={className}
                                        onClick={() => handleTileClick(i)}
                                        whileTap={{ scale: 0.95 }}
                                        layout // Smooth layout changes when grid size changes
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}

                {gameState === 'result' && (
                    <div className="vm-result-panel">
                        <Eye size={64} className="vm-icon" />
                        <div className="result-display">
                            <span className="result-val">{level}</span>
                            <span className="result-unit">LEVEL</span>
                        </div>

                        <div className="vm-stats-grid">
                            <div className="vm-stat">
                                <span className="label">LIVES LEFT</span>
                                <span className="value">{lives}</span>
                            </div>
                        </div>

                        <button className="vm-retry-btn" onClick={startGame}>
                            RE-INITIALIZE
                        </button>
                    </div>
                )}
            </div>
        </GameWrapper>
    );
}
