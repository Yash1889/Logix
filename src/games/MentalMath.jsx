import { useState, useRef, useEffect } from 'react';
import GameWrapper from '../components/GameWrapper';
import { useGameScore } from '../hooks/useGameScore';
import { Calculator } from 'lucide-react';
import './MentalMath.css';

const TOTAL_TIME = 60; // 60s blast

export default function MentalMath() {
    const { bestScore, sessionBest, saveScore } = useGameScore('mental-math');
    const [gameState, setGameState] = useState('waiting');
    const [question, setQuestion] = useState({ text: '', answer: 0 });
    const [userInput, setUserInput] = useState('');
    const [score, setScore] = useState(0); // Correct count
    const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);

    const timerRef = useRef(null);

    const generateQuestion = () => {
        // Diffculty scaling? 
        // Level 1: Add/Sub 1-20
        // Level 2: Mul/Div small
        // Let's randomize.

        const types = ['+', '-', '*', '/']; // Div only if clean
        const type = types[Math.floor(Math.random() * 4)];

        let a, b, ans, text;

        switch (type) {
            case '+':
                a = Math.floor(Math.random() * 50) + 1;
                b = Math.floor(Math.random() * 50) + 1;
                ans = a + b;
                text = `${a} + ${b}`;
                break;
            case '-':
                a = Math.floor(Math.random() * 50) + 20;
                b = Math.floor(Math.random() * a);
                ans = a - b;
                text = `${a} - ${b}`;
                break;
            case '*':
                a = Math.floor(Math.random() * 12) + 2;
                b = Math.floor(Math.random() * 12) + 2;
                ans = a * b;
                text = `${a} × ${b}`;
                break;
            case '/':
                b = Math.floor(Math.random() * 10) + 2;
                ans = Math.floor(Math.random() * 10) + 2;
                a = b * ans;
                text = `${a} ÷ ${b}`;
                break;
        }
        return { text, answer: ans };
    };

    const startGame = () => {
        setGameState('playing');
        setScore(0);
        setTimeLeft(TOTAL_TIME);
        setQuestion(generateQuestion());
        setUserInput('');

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    endGame();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const val = parseInt(userInput);
        if (!isNaN(val) && val === question.answer) {
            setScore(prev => prev + 1);
            setQuestion(generateQuestion());
            setUserInput('');
        } else {
            // Wrong answer penalty? 
            // Shake logic?
            // Clear input?
            // Just clear input for now.
            setUserInput('');
        }
    };

    const endGame = () => {
        clearInterval(timerRef.current);

        // Meta: TPM (Trials per minute basically score)
        const meta = {
            duration: TOTAL_TIME
        };
        saveScore(score, false, meta); // Higher better
        setGameState('result');
    };

    useEffect(() => {
        return () => clearInterval(timerRef.current);
    }, []);

    return (
        <GameWrapper
            title="Mental Math"
            description="Solve as many as you can in 60 seconds."
            onRestart={startGame}
            score={gameState === 'result' ? `${score}` : null}
            bestScore={bestScore ? `${bestScore}` : null}
            sessionBest={sessionBest ? `${sessionBest}` : null}
        >
            <div className="math-container">
                {gameState === 'waiting' && (
                    <div className="math-start">
                        <Calculator size={64} className="math-icon" />
                        <h2>Speed Math</h2>
                        <button className="math-btn" onClick={startGame}>Start</button>
                    </div>
                )}

                {gameState === 'playing' && (
                    <div className="math-play">
                        <div className="math-timer">{timeLeft}s</div>
                        <div className="math-question">{question.text}</div>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="number"
                                className="math-input"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                autoFocus
                            />
                            <button type="submit" style={{ display: 'none' }}></button>
                        </form>
                    </div>
                )}

                {gameState === 'result' && (
                    <div className="math-result">
                        <h1>Score: {score}</h1>
                        <button className="math-btn" onClick={startGame}>Try Again</button>
                    </div>
                )}
            </div>
        </GameWrapper>
    );
}
