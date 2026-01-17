import { useState, useEffect } from 'react';
import GameWrapper from '../components/GameWrapper';
import { useGameScore } from '../hooks/useGameScore';
import { motion } from 'framer-motion';
import './VisualMemory.css';

export default function VisualMemory() {
    const { bestScore, sessionBest, saveScore } = useGameScore('visual-memory');
    const [gameState, setGameState] = useState('waiting'); // waiting, showing, playing, result
    const [level, setLevel] = useState(1);
    const [gridSize, setGridSize] = useState(3);
    const [pattern, setPattern] = useState([]);
    const [userPattern, setUserPattern] = useState([]);
    const [lives, setLives] = useState(3);
    const [clickCount, setClickCount] = useState(0); // Track clicks for accuracy

    // Generate Pattern based on level
    const generatePattern = (lvl) => {
        // Determine grid size and pattern length
        // Level 1: 3 tiles, 3x3
        // Level 2: 4 tiles, 3x3
        // Level 3: 5 tiles, 4x4 ...

        // Simple scaling:
        // Tiles = level + 2
        // Grid Size grows every 3 levels?

        const tileCount = level + 2;
        const size = level > 12 ? 6 : level > 6 ? 5 : level > 2 ? 4 : 3;
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

        setTimeout(() => {
            const newPattern = generatePattern(level);
            setPattern(newPattern);

            // Show for 1.5s
            setTimeout(() => {
                setGameState('playing');
            }, 1500);
        }, 500);
    };

    const handleTileClick = (index) => {
        if (gameState !== 'playing') return;
        if (userPattern.includes(index)) return; // Already clicked

        // Check if correct
        if (pattern.includes(index)) {
            const newUserPattern = [...userPattern, index];
            setUserPattern(newUserPattern);
            setClickCount(prev => prev + 1);

            if (newUserPattern.length === pattern.length) {
                // Level Complete
                setLevel(prev => prev + 1);
                setGameState('showing'); // Transition
                setTimeout(startLevel, 1000);
            }
        } else {
            // Wrong tile
            const newLives = lives - 1;
            setLives(newLives);

            // Temporarily show error and correct tiles? 
            // For now just standard "strike" behavior.

            // Highlight wrong tile briefly? CSS handles "wrong" class if we managed state per tile?
            // Simpler: Just standard HB behavior (game over on 3 strikes or retry level?)
            // HB Logic: You lose a life, but you must complete the PATTERN to move on? 
            // OR level restarts with same difficulty?
            // Actually HB Visual Memory: 3 Strikes and GAME OVER.

            if (newLives <= 0) {
                endGame();
            } else {
                // Continue playing? OR reset level? 
                // HB: Just mark it wrong, life lost. Game continues.
                // But we need visual feedback. 
                // We'll shake the board.
                const grid = document.querySelector('.vm-grid');
                if (grid) grid.classList.add('shake');
                setTimeout(() => grid?.classList.remove('shake'), 500);
            }
        }
    };

    const endGame = () => {
        const finalScore = level;

        // Meta: Lives remaining? 
        const meta = {
            levelDetails: { finalLevel: level, size: gridSize }
        };

        saveScore(finalScore, false, meta); // Higher is better
        setGameState('result');
    };

    const startGame = () => {
        setLevel(1);
        setLives(3);
        startLevel();
    };

    return (
        <GameWrapper
            title="Visual Memory"
            description="Memorize the pattern of tiles."
            onRestart={startGame}
            score={`Level ${level} | Lives ${lives}`}
            bestScore={bestScore ? `Lvl ${bestScore}` : null}
            sessionBest={sessionBest ? `Lvl ${sessionBest}` : null}
        >
            <div className="vm-container">
                {gameState === 'waiting' || gameState === 'result' ? (
                    <div className="vm-start">
                        {gameState === 'result' && <h1>Level {level}</h1>}
                        <button className="vm-btn" onClick={startGame}>
                            {gameState === 'waiting' ? 'Start Game' : 'Try Again'}
                        </button>
                    </div>
                ) : (
                    <div
                        className="vm-grid"
                        style={{
                            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                            width: `${gridSize * 70}px`
                        }}
                    >
                        {Array.from({ length: gridSize * gridSize }).map((_, i) => {
                            const isPatternForShow = gameState === 'showing' && pattern.includes(i);
                            const isSelected = userPattern.includes(i);
                            // We don't easily track specific tile errors in this simple state, 
                            // but we could if we expanded userPattern to hold objects.

                            return (
                                <motion.div
                                    key={i}
                                    className={`vm-tile ${isPatternForShow ? 'active' : ''} ${isSelected ? 'selected' : ''}`}
                                    onClick={() => handleTileClick(i)}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    whileTap={{ scale: 0.9 }}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </GameWrapper>
    );
}
