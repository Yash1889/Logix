import { useState, useEffect } from 'react';
import GameWrapper from '../components/GameWrapper';
import { useGameScore } from '../hooks/useGameScore';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers } from 'lucide-react';
import './TowerPlanning.css';

const MAX_DISKS = 7;

export default function TowerPlanning() {
    const { bestScore, sessionBest, saveScore } = useGameScore('tower-planning');
    const [gameState, setGameState] = useState('waiting');

    // Game State
    const [diskCount, setDiskCount] = useState(3);
    const [towers, setTowers] = useState([[], [], []]); // [ [disc1, disc2], [], [] ]
    const [selectedDisk, setSelectedDisk] = useState(null); // { val: 1, fromTower: 0 }
    const [moves, setMoves] = useState(0);
    const [minMoves, setMinMoves] = useState(0);

    // Timer
    const [startTime, setStartTime] = useState(0);
    const [timeElapsed, setTimeElapsed] = useState(0);

    // Initialize level
    const startLevel = (count) => {
        const newStack = [];
        for (let i = count; i >= 1; i--) {
            newStack.push(i);
        }

        setTowers([newStack, [], []]);
        setDiskCount(count);
        setMoves(0);
        setMinMoves(Math.pow(2, count) - 1);
        setSelectedDisk(null);
        setStartTime(Date.now());
        setGameState('playing');
    };

    useEffect(() => {
        let interval;
        if (gameState === 'playing') {
            interval = setInterval(() => {
                setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [gameState, startTime]);

    const handleTowerClick = (towerIndex) => {
        if (gameState !== 'playing') return;

        const tower = towers[towerIndex];
        const topDisk = tower[tower.length - 1];

        // If no disk selected, display feedback or select
        if (!selectedDisk) {
            if (topDisk) {
                setSelectedDisk({ val: topDisk, fromTower: towerIndex });
            }
        } else {
            // Deselect if clicking same tower
            if (selectedDisk.fromTower === towerIndex) {
                setSelectedDisk(null);
                return;
            }

            // Move rule
            if (!topDisk || topDisk > selectedDisk.val) {
                // VALID MOVE
                const newTowers = [...towers];
                // Remove from old
                newTowers[selectedDisk.fromTower] = newTowers[selectedDisk.fromTower].slice(0, -1);
                // Add to new
                newTowers[towerIndex] = [...newTowers[towerIndex], selectedDisk.val];

                setTowers(newTowers);
                setMoves(m => m + 1);
                setSelectedDisk(null);

                // Check Win: All disks on tower 2 (index 2)
                if (towerIndex === 2 && newTowers[2].length === diskCount) {
                    endLevel(true);
                }
            } else {
                // INVALID MOVE
                setSelectedDisk(null);
            }
        }
    };

    const endLevel = (success) => {
        if (success) {
            const efficiency = minMoves / moves;
            const baseScore = diskCount * 1000;
            const finalScore = Math.floor(baseScore * efficiency - (timeElapsed * 10));

            const meta = {
                disks: diskCount,
                moves,
                minMoves,
                efficiency: (efficiency * 100).toFixed(1) + '%',
                time: timeElapsed
            };

            saveScore(finalScore > 0 ? finalScore : 100, false, meta);
            setGameState('result');
        }
    };

    return (
        <GameWrapper
            title="Tower Planning"
            description="Reconstruct the stack on the furthest node. Larger units cannot occupy smaller ones."
            onRestart={() => setGameState('setup')}
            score={`Moves: ${moves} / ${minMoves}`}
            bestScore={bestScore ? `${bestScore}` : null}
            sessionBest={sessionBest ? `${sessionBest}` : null}
        >
            <div className="tower-container full-height">
                {gameState === 'waiting' && (
                    <div className="tower-overlay">
                        <Layers size={80} className="tower-icon" />
                        <h1 className="tower-title">SEQUENTIAL PLANNING</h1>
                        <div className="tower-instructions">
                            <p>TRANSFER STACK TO TERMINAL NODE (3).</p>
                            <p>MOVEMENTS RESTRICTED BY UNIT HIERARCHY.</p>
                            <p>OPTIMIZE FOR MINIMUM OPERATIONS.</p>
                        </div>
                        <button className="tower-btn-start" onClick={() => setGameState('setup')}>INITIATE SEQUENCE</button>
                    </div>
                )}

                {gameState === 'setup' && (
                    <div className="tower-setup">
                        <h2>CONFIGURE COMPLEXITY</h2>
                        <div className="disk-selector">
                            {[3, 4, 5, 6, 7].map(num => (
                                <button
                                    key={num}
                                    className="setup-btn"
                                    onClick={() => startLevel(num)}
                                >
                                    {num} UNITS
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {gameState === 'playing' && (
                    <div className="tower-play-area">
                        <div className="tower-hud">
                            <div className="hud-metric">
                                <span className="label">MOVES</span>
                                <span className="value">{moves} <span className="sub">/ {minMoves}</span></span>
                            </div>
                            <div className="hud-metric">
                                <span className="label">TIME</span>
                                <span className="value">{timeElapsed}s</span>
                            </div>
                        </div>

                        <div className="towers-stage">
                            {towers.map((stack, i) => (
                                <div
                                    key={i}
                                    className={`tower-zone ${selectedDisk?.fromTower === i ? 'source' : ''}`}
                                    onClick={() => handleTowerClick(i)}
                                >
                                    <div className="tower-rod"></div>
                                    <div className="tower-base"></div>
                                    <div className="tower-stack">
                                        <AnimatePresence>
                                            {stack.map((diskVal, idx) => {
                                                const isSelected = selectedDisk?.val === diskVal && selectedDisk?.fromTower === i;
                                                return (
                                                    <motion.div
                                                        key={`disk-${diskVal}`}
                                                        className={`disk size-${diskVal} ${isSelected ? 'selected' : ''}`}
                                                        layoutId={`disk-${diskVal}`}
                                                        initial={false}
                                                        animate={{
                                                            y: isSelected ? -180 : 0,
                                                            scale: isSelected ? 1.05 : 1
                                                        }}
                                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                    >
                                                        <span className="disk-label">{diskVal}</span>
                                                    </motion.div>
                                                );
                                            })}
                                        </AnimatePresence>
                                    </div>
                                    <div className="tower-id">NODE {i + 1}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {gameState === 'result' && (
                    <div className="tower-result-panel">
                        <div className="result-display">
                            <span className="result-label">OPTIMIZATION SCORE</span>
                            <span className="result-val">{Math.floor((minMoves / moves) * 100)}%</span>
                        </div>

                        <div className="tower-analysis-grid">
                            <div className="analysis-item">
                                <span className="label">MOVES</span>
                                <span className="value">{moves}</span>
                            </div>
                            <div className="analysis-item">
                                <span className="label">MINIMUM</span>
                                <span className="value">{minMoves}</span>
                            </div>
                            <div className="analysis-item">
                                <span className="label">TIME</span>
                                <span className="value">{timeElapsed}s</span>
                            </div>
                        </div>

                        <button className="tower-retry-btn" onClick={() => setGameState('setup')}>
                            RECONFIGURE
                        </button>
                    </div>
                )}
            </div>
        </GameWrapper>
    );
}
