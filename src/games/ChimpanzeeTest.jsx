import { useState } from 'react';
import GameWrapper from '../components/GameWrapper';
import { useGameScore } from '../hooks/useGameScore';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, EyeOff } from 'lucide-react';
import './ChimpanzeeTest.css';

const GRID_ROWS = 8;
const GRID_COLS = 10;

export default function ChimpanzeeTest() {
    const { bestScore, sessionBest, saveScore } = useGameScore('chimpanzee');
    const [gameState, setGameState] = useState('waiting');
    const [level, setLevel] = useState(4); // Start with 4 numbers
    const [numbers, setNumbers] = useState([]); // [{val: 1, pos: 12}]
    const [hidden, setHidden] = useState(false);
    const [nextExpected, setNextExpected] = useState(1);
    const [lives, setLives] = useState(3);

    const startLevel = (lvl) => {
        setNextExpected(1);
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

    const handleTileClick = (numObj) => {
        if (gameState !== 'playing') return;

        // Trigger Hide on first correct click (val 1)
        if (numObj.val === 1) {
            setHidden(true);
        }

        if (numObj.val === nextExpected) {
            // Correct
            if (nextExpected === numbers.length) {
                // Level Complete
                const nextLvl = level + 1;
                setLevel(nextLvl);

                // Remove solved numbers visually immediately or just transition?
                // Visual cleanup is nice.

                setTimeout(() => {
                    startLevel(nextLvl);
                }, 800);
            } else {
                setNextExpected(prev => prev + 1);
                // Mark as clicked (remove from array roughly equates to "gone")
                setNumbers(prev => prev.map(n => n.val === numObj.val ? { ...n, clicked: true } : n));
            }
        } else {
            // Wrong
            const newLives = lives - 1;
            setLives(newLives);
            setHidden(false); // Reveal all for feedback

            if (newLives <= 0) {
                endGame();
            } else {
                // Retry same level
                setTimeout(() => {
                    startLevel(level);
                }, 1500);
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
            description="Click the numbers in sequential order. They minimize visibility after the first interaction."
            onRestart={startGame}
            score={`Level ${level} | Lives ${lives}`}
            bestScore={bestScore ? `Lvl ${bestScore}` : null}
            sessionBest={sessionBest ? `Lvl ${sessionBest}` : null}
        >
            <div className="chimp-container">
                {gameState === 'waiting' && (
                    <div className="chimp-overlay">
                        <BrainCircuit size={64} className="chimp-icon" />
                        <h2>WORKING MEMORY MATRIX</h2>
                        <p>Memorize position mapping.</p>
                        <button className="chimp-btn-start" onClick={startGame}>INITIALIZE</button>
                    </div>
                )}

                {gameState === 'playing' && (
                    <div className="chimp-game-area">
                        <div className="chimp-grid">
                            {Array.from({ length: GRID_ROWS * GRID_COLS }).map((_, i) => {
                                const numObj = numbers.find(n => n.pos === i);

                                // Render empty slot mostly, or number tile
                                if (!numObj) return <div key={i} className="chimp-slot"></div>;

                                // If clicked, maybe fade out? Or just remove.
                                if (numObj.clicked) return <div key={i} className="chimp-slot"></div>;

                                return (
                                    <motion.div
                                        key={i}
                                        className={`chimp-tile ${hidden ? 'hidden-mode' : 'visible-mode'}`}
                                        onClick={() => handleTileClick(numObj)}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <span className="tile-val">{numObj.val}</span>
                                        {hidden && <div className="tile-cover"></div>}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {gameState === 'result' && (
                    <div className="chimp-result-panel">
                        <div className="result-display">
                            <span className="result-val">{level}</span>
                            <span className="result-unit">LEVEL</span>
                        </div>

                        <div className="chimp-stats-grid">
                            <div className="chimp-stat">
                                <span className="label">LIVES LEFT</span>
                                <span className="value">{lives}</span>
                            </div>
                        </div>

                        <button className="chimp-retry-btn" onClick={startGame}>
                            RE-INITIALIZE
                        </button>
                    </div>
                )}
            </div>
        </GameWrapper>
    );
}
