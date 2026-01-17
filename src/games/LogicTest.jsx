import { useState } from 'react';
import GameWrapper from '../components/GameWrapper';
import { useGameScore } from '../hooks/useGameScore';
import './LogicTest.css';

const QUESTIONS = [
    { q: "If A > B and B > C, then:", opts: ["A > C", "A < C", "A = C"], ans: 0 },
    { q: "Some cats are dogs. All dogs are birds. Therefore:", opts: ["Some cats are birds", "No cats are birds", "All cats are birds"], ans: 0 },
    { q: "Monday, Wednesday, Friday, ...", opts: ["Saturday", "Sunday", "Thursday"], ans: 1 },
    { q: "Car is to Road as Train is to:", opts: ["Sky", "Track", "Water"], ans: 1 },
    { q: "Which number does not belong: 2, 3, 5, 7, 9, 11", opts: ["5", "9", "11"], ans: 1 }, // 9 is not prime
    { q: "Hand is to Glove as Head is to:", opts: ["Hair", "Hat", "Neck"], ans: 1 },
];

export default function LogicTest() {
    const { bestScore, sessionBest, saveScore } = useGameScore('logic-test');
    const [gameState, setGameState] = useState('waiting');
    const [level, setLevel] = useState(0);
    const [score, setScore] = useState(0);

    const startGame = () => {
        setGameState('playing');
        setLevel(0);
        setScore(0);
    };

    const handleChoice = (idx) => {
        if (idx === QUESTIONS[level].ans) {
            setScore(prev => prev + 1);
        }

        // Always next
        if (level === QUESTIONS.length - 1) {
            endGame(idx === QUESTIONS[level].ans ? score + 1 : score);
        } else {
            setLevel(prev => prev + 1);
        }
    };

    const endGame = (finalScore) => {
        saveScore(finalScore);
        setGameState('result');
    };

    return (
        <GameWrapper
            title="Logic Test"
            description="Select the logical conclusion."
            onRestart={startGame}
            score={`Q: ${level + 1}`}
            bestScore={bestScore ? `${bestScore}/${QUESTIONS.length}` : null}
            sessionBest={sessionBest ? `${sessionBest}/${QUESTIONS.length}` : null}
        >
            <div className="logic-container">
                {gameState === 'waiting' && <button className="logic-btn start" onClick={startGame}>Start Test</button>}

                {gameState === 'playing' && (
                    <div className="logic-play">
                        <h2>{QUESTIONS[level].q}</h2>
                        <div className="logic-opts">
                            {QUESTIONS[level].opts.map((opt, i) => (
                                <button key={i} className="logic-opt" onClick={() => handleChoice(i)}>
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {gameState === 'result' && (
                    <div className="logic-result">
                        <h1>Score: {score} / {QUESTIONS.length}</h1>
                        <button className="logic-btn start" onClick={startGame}>Try Again</button>
                    </div>
                )}
            </div>
        </GameWrapper>
    );
}
