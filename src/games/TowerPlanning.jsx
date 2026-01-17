import { useState, useEffect } from 'react';
import GameWrapper from '../components/GameWrapper';
import { useGameScore } from '../hooks/useGameScore';
import GlassButton from '../components/ui/GlassButton';
import './TowerPlanning.css';

// 3 Disks to start. Maybe 4 levels?
// Standard Hanoi rules.

const LEVELS = [
    { disks: 3, par: 7 },
    { disks: 4, par: 15 },
    { disks: 5, par: 31 } // 2^n - 1
];

export default function TowerPlanning() {
    const { bestScore, sessionBest, saveScore } = useGameScore('tower-planning');
    const [gameState, setGameState] = useState('waiting');

    const [levelIndex, setLevelIndex] = useState(0);
    const [towers, setTowers] = useState([[], [], []]); // 3 pegs
    const [selectedDisk, setSelectedDisk] = useState(null); // { val, fromPeg }
    const [moves, setMoves] = useState(0);
    const [totalMoves, setTotalMoves] = useState(0);
    const [levelStartTime, setLevelStartTime] = useState(0);

    // Scoring: 
    // Perfection Score (Moves vs Par)
    // Time efficiency.

    const initLevel = (idx) => {
        const numDisks = LEVELS[idx].disks;
        // Peg 0 has [3, 2, 1] (top is end of array?)
        // Let's say top is end of array. Stack.
        // [3, 2, 1] -> 1 is smallest, on top? 
        // Usually disks are 1..N. Bigger number = bigger disk.
        // Smallest on top.

        const peg0 = [];
        for (let i = numDisks; i >= 1; i--) {
            peg0.push(i);
        }

        setTowers([peg0, [], []]);
        setMoves(0);
        setSelectedDisk(null);
        setLevelStartTime(Date.now());
    };

    const startGame = () => {
        setGameState('playing');
        setTotalMoves(0);
        setLevelIndex(0);
        initLevel(0);
    };

    const handlePegClick = (pegIndex) => {
        const peg = towers[pegIndex];

        if (selectedDisk === null) {
            // Select top disk
            if (peg.length === 0) return;
            const disk = peg[peg.length - 1];
            setSelectedDisk({ val: disk, fromPeg: pegIndex });
        } else {
            // Attempt move
            if (pegIndex === selectedDisk.fromPeg) {
                // Deselect
                setSelectedDisk(null);
                return;
            }

            const topDisk = peg.length > 0 ? peg[peg.length - 1] : Infinity;

            if (selectedDisk.val < topDisk) {
                // Valid move
                const newTowers = [...towers];
                newTowers[selectedDisk.fromPeg] = newTowers[selectedDisk.fromPeg].slice(0, -1);
                newTowers[pegIndex] = [...newTowers[pegIndex], selectedDisk.val];

                setTowers(newTowers);
                setMoves(m => m + 1);
                setTotalMoves(tm => tm + 1);
                setSelectedDisk(null);

                checkWin(newTowers, pegIndex);
            } else {
                // Invalid
                // Shake/Error feedback?
                setSelectedDisk(null);
            }
        }
    };

    const checkWin = (currentTowers, targetPeg) => {
        // Assuming target can be any peg other than 0? Or strictly peg 2?
        // Usually peg 2 (rightmost).
        if (targetPeg !== 2) return;

        const numDisks = LEVELS[levelIndex].disks;
        if (currentTowers[2].length === numDisks) {
            // Won level
            if (levelIndex < LEVELS.length - 1) {
                setTimeout(() => {
                    setLevelIndex(prev => {
                        const next = prev + 1;
                        initLevel(next);
                        return next;
                    });
                }, 500);
            } else {
                endGame();
            }
        }
    };

    const endGame = () => {
        // Score: Total Moves?
        // Or "Planning Efficiency" = (Total Par / Total Moves) * 100
        const totalPar = LEVELS.reduce((acc, l) => acc + l.par, 0);
        const efficiency = Math.round((totalPar / totalMoves) * 100); // Capped at 100?

        // If moves < par, impossible. 
        // If perfect, 100%.

        const meta = {
            totalMoves,
            totalPar,
            efficiency
        };

        saveScore(efficiency > 100 ? 100 : efficiency, false, meta); // Percentage score
        setGameState('result');
    };

    return (
        <GameWrapper
            title="Tower Planning"
            description="Move all disks to the rightmost tower. Larger disks cannot be placed on smaller ones."
            onRestart={startGame}
            score={`Moves: ${moves} (Par: ${LEVELS[levelIndex]?.par})`}
            bestScore={bestScore ? `Best Efficiency: ${bestScore}%` : null}
        >
            <div className="tower-container">
                {gameState === 'waiting' && (
                    <div className="tower-intro">
                        <h2>Tower of Hanoi</h2>
                        <p>Test your planning depth and working memory.</p>
                        <GlassButton onClick={startGame} size="large">Start Test</GlassButton>
                    </div>
                )}

                {gameState === 'playing' && (
                    <div className="tower-play">
                        <h3>Level {levelIndex + 1} ({LEVELS[levelIndex].disks} Disks)</h3>
                        <div className="pegs-area">
                            {towers.map((peg, i) => (
                                <div
                                    key={i}
                                    className={`peg-zone ${selectedDisk?.fromPeg === i ? 'source' : ''}`}
                                    onClick={() => handlePegClick(i)}
                                >
                                    <div className="peg-rod"></div>
                                    <div className="disks-stack">
                                        {peg.map(diskSize => (
                                            <div
                                                key={diskSize}
                                                className={`disk size-${diskSize} ${selectedDisk?.val === diskSize ? 'selected' : ''}`}
                                            // style={{ width: getDiskWidth(diskSize) }} // CSS better
                                            ></div>
                                        ))}
                                    </div>
                                    <div className="peg-base"></div>
                                </div>
                            ))}
                        </div>
                        {selectedDisk && <p className="tower-hint">Select a destination peg</p>}
                    </div>
                )}

                {gameState === 'result' && (
                    <div className="tower-result">
                        <h1>Planning Efficiency: {bestScore}%</h1>
                        <p>You solved the puzzles with {totalMoves} moves.</p>
                        <p>Perfect play requires {LEVELS.reduce((a, b) => a + b.par, 0)} moves.</p>
                        <GlassButton onClick={startGame}>Replay</GlassButton>
                    </div>
                )}
            </div>
        </GameWrapper>
    );
}
