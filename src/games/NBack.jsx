import { useState, useRef, useEffect } from 'react';
import GameWrapper from '../components/GameWrapper';
import { useGameScore } from '../hooks/useGameScore';
import './NBack.css';

const STEPS = 20; // 20 items per round

export default function NBack() {
    const { bestScore, sessionBest, saveScore } = useGameScore('n-back');
    const [gameState, setGameState] = useState('waiting');
    const [nLevel, setNLevel] = useState(2); // Start with 2-back
    const [sequence, setSequence] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(-1);
    const [score, setScore] = useState(0); // Hits
    const [misses, setMisses] = useState(0);
    const [falseAlarms, setFalseAlarms] = useState(0);

    const [userResponded, setUserResponded] = useState(false);

    // Generate sequence where ~30% are matches
    const generateSequence = () => {
        const seq = [];
        const possible = ['A', 'B', 'C', 'D', 'E', 'H', 'K', 'L', 'M', 'O', 'P', 'R', 'S', 'T'];

        for (let i = 0; i < STEPS; i++) {
            const isMatch = (i >= nLevel) && Math.random() < 0.3;

            if (isMatch) {
                seq.push(seq[i - nLevel]);
            } else {
                // Pick random that is NOT the match
                let char;
                do {
                    char = possible[Math.floor(Math.random() * possible.length)];
                } while (i >= nLevel && char === seq[i - nLevel]);
                seq.push(char);
            }
        }
        return seq;
    };

    const startRound = (n) => {
        const level = n || nLevel;
        setSequence(generateSequence());
        setCurrentIdx(-1);
        setScore(0);
        setMisses(0);
        setFalseAlarms(0);
        setGameState('playing');

        setTimeout(nextStep, 1000);
    };

    const nextStep = () => {
        setCurrentIdx(prev => {
            const next = prev + 1;
            if (next >= STEPS) {
                endGame();
                return prev;
            }

            setUserResponded(false);
            setTimeout(nextStep, 2500); // 2.5s per item
            return next;
        });
    };

    const handleMatchClick = () => {
        if (userResponded || currentIdx < nLevel) return;
        setUserResponded(true);

        const current = sequence[currentIdx];
        const target = sequence[currentIdx - nLevel];

        if (current === target) {
            setScore(prev => prev + 1);
        } else {
            setFalseAlarms(prev => prev + 1);
        }
    };

    // Check for misses automatically
    // Actually we need to check if user missed a match at the END of the step
    // But reacting to 'nextStep' is tricky. 
    // Let's just calculate score at result? 
    // Misses = Total Matches - Hits.

    const endGame = () => {
        setGameState('result');

        // Calc stats
        let potentialMatches = 0;
        for (let i = nLevel; i < sequence.length; i++) {
            if (sequence[i] === sequence[i - nLevel]) potentialMatches++;
        }

        const hits = score;
        const missed = potentialMatches - hits;

        const meta = {
            nLevel: nLevel,
            hits,
            misses: missed,
            falseAlarms
        };

        // If performed well (e.g. >80% accuracy), recommend N+1
        // If poor (<50%), recommend N-1

        const accuracy = potentialMatches > 0 ? Math.round((hits / potentialMatches) * 100) : 0;

        // Save max N level reached with good accuracy? 
        // Or just save N level? 
        // Let's save "N-Level"
        saveScore(nLevel, false, meta);
    };

    return (
        <GameWrapper
            title={`${nLevel}-Back Test`}
            description={`Press MATCH if the letter is the same as ${nLevel} steps ago.`}
            onRestart={() => startRound(nLevel)}
            score={`N=${nLevel}`}
            bestScore={bestScore ? `N=${bestScore}` : null}
            sessionBest={sessionBest ? `N=${sessionBest}` : null}
        >
            <div className="nback-container">
                {gameState === 'waiting' && <button className="nb-btn" onClick={() => startRound(2)}>Start 2-Back</button>}

                {gameState === 'playing' && (
                    <div className="nb-play">
                        <div className="nb-letter">{sequence[currentIdx]}</div>
                        <div className="nb-controls">
                            <button
                                className={`nb-match-btn ${userResponded ? 'disabled' : ''}`}
                                onClick={handleMatchClick}
                            >
                                MATCH
                            </button>
                        </div>
                    </div>
                )}

                {gameState === 'result' && (
                    <div className="nb-result">
                        <h1>Level {nLevel} Complete</h1>
                        <p>Matches Hit: {score}</p>
                        <p>False Alarms: {falseAlarms}</p>
                        <div className="nb-actions">
                            <button className="nb-btn" onClick={() => { setNLevel(prev => Math.max(1, prev - 1)); startRound(Math.max(1, nLevel - 1)); }}>Decrease Level</button>
                            <button className="nb-btn" onClick={() => startRound(nLevel)}>Retry</button>
                            <button className="nb-btn primary" onClick={() => { setNLevel(prev => prev + 1); startRound(nLevel + 1); }}>Increase Level</button>
                        </div>
                    </div>
                )}
            </div>
        </GameWrapper>
    );
}
