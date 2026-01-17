import { useState, useEffect } from 'react';
import GameWrapper from '../components/GameWrapper';
import { useGameScore } from '../hooks/useGameScore';
import { motion } from 'framer-motion';
import './ChimpanzeeTest.css';

const GRID_ROWS = 8;
const GRID_COLS = 10; // Large grid for spatial distribution

export default function ChimpanzeeTest() {
    const { bestScore, sessionBest, saveScore } = useGameScore('chimpanzee');
    const [gameState, setGameState] = useState('waiting');
    const [level, setLevel] = useState(4); // Start with 4 numbers
    const [numbers, setNumbers] = useState([]); // [{val: 1, pos: 12}]
    const [hidden, setHidden] = useState(false);
    const [nextExpected, setNextExpected] = useState(1);
    const [lives, setLives] = useState(3);

    // Generate level
    const startLevel = (lvl) => {
        setNextExpected(1);
        setIsActive(true);
        setHidden(false);

        // Generate positions
        const count = lvl;
        const usedPositions = new Set();
        const newNumbers = [];

        for (let i = 1; i <= count; i++) {
            let pos;
            do {
                pos = Math.floor(Math.random() * (GRID_ROWS * GRID_COLS));
            } while (usedPositions.has(pos));
            usedPositions.add(pos);
            newNumbers.push({ val: i, pos });
        }

        setNumbers(newNumbers);
    };

    const [isActive, setIsActive] = useState(false);

    const handleTileClick = (numObj) => {
        if (!isActive || gameState !== 'playing') return;

        // Check logic
        if (numObj.val === 1) {
            setHidden(true); // Hide all on first click
        }

        if (numObj.val === nextExpected) {
            // Correct
            if (nextExpected === numbers.length) {
                // Level Complete
                setIsActive(false);
                const nextLvl = level + 1;
                setLevel(nextLvl);
                // Brief pause then next level
                setTimeout(() => {
                    startLevel(nextLvl);
                }, 1000);
            } else {
                setNextExpected(prev => prev + 1);
                // Mark this tile as clicked (remove from list or mark visible/done?)
                // We can remove it from "numbers" array to make it disappear
                setNumbers(prev => prev.map(n => n.val === numObj.val ? { ...n, clicked: true } : n));
            }
        } else {
            // Wrong
            const newLives = lives - 1;
            setLives(newLives);
            setHidden(false); // Reveal solution
            setIsActive(false);

            if (newLives <= 0) {
                endGame();
            } else {
                // Retry logic: REPEAT same level? Or reduce level? 
                // HB usually keeps level.
                setTimeout(() => {
                    startLevel(level);
                }, 2000);
            }
        }
    };

    const endGame = () => {
        const finalScore = level;
        const meta = {
            maxLevel: level
        };
        saveScore(finalScore, false, meta);
        setGameState('result');
    };

    const startGame = () => {
        setLevel(4);
        setLives(3);
        setGameState('playing');
        startLevel(4);
    };

    return (
        <GameWrapper
            title="Chimpanzee Test"
            description="Click the numbers in order. They will hide after the first click."
            onRestart={startGame}
            score={`Level ${numbers.length}`}
            bestScore={bestScore ? `Lvl ${bestScore}` : null}
            sessionBest={sessionBest ? `Lvl ${sessionBest}` : null}
        >
            <div className="chimp-container">
                {gameState === 'waiting' && (
                    <div className="chimp-start">
                        <h2>Are you smarter than a chimpanzee?</h2>
                        <button className="chimp-btn" onClick={startGame}>Start Test</button>
                    </div>
                )}

                {gameState === 'playing' && (
                    <div className="chimp-game">
                        <div className="chimp-stats">Lives: {'❤️'.repeat(lives)}</div>
                        <div className="chimp-grid">
                            {Array.from({ length: GRID_ROWS * GRID_COLS }).map((_, i) => {
                                const numObj = numbers.find(n => n.pos === i);

                                if (!numObj || numObj.clicked) return <div key={i} className="chimp-cell empty"></div>;

                                // Logic: If not hidden, show number. If hidden, show box (unless it's the one we just clicked?)
                                // If hidden is true, we show blank box.

                                return (
                                    <motion.div
                                        key={i}
                                        className={`chimp-cell ${hidden ? 'hidden' : 'visible'}`}
                                        onClick={() => handleTileClick(numObj)}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <span style={{ opacity: hidden ? 0 : 1 }}>{numObj.val}</span>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {gameState === 'result' && (
                    <div className="chimp-result">
                        <h1>Score: {level}</h1>
                        <button className="chimp-btn" onClick={startGame}>Try Again</button>
                    </div>
                )}
            </div>
        </GameWrapper>
    );
}
