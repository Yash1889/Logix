import { useState } from 'react';
import GameWrapper from '../components/GameWrapper';
import { useGameScore } from '../hooks/useGameScore';
import GlassButton from '../components/ui/GlassButton';
import { QUESTIONS, SCORING, DIMENSIONS, TYPE_DESCRIPTIONS } from '../data/personalityQuestions';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, ChevronRight } from 'lucide-react';
import './PersonalityTest.css';

export default function PersonalityTest() {
    const { saveScore } = useGameScore('personality-test'); // Game ID
    const [gameState, setGameState] = useState('waiting'); // waiting, playing, result

    // State
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // { questionId: score }
    const [resultData, setResultData] = useState(null);

    const startTest = () => {
        setGameState('playing');
        setCurrentQIndex(0);
        setAnswers({});
        setResultData(null);
    };

    const handleAnswer = (score) => {
        const question = QUESTIONS[currentQIndex];
        const newAnswers = { ...answers, [question.id]: score };
        setAnswers(newAnswers);

        // Auto advance
        if (currentQIndex < QUESTIONS.length - 1) {
            setTimeout(() => {
                setCurrentQIndex(prev => prev + 1);
            }, 250); // Slight delay for visual feedback
        } else {
            // Finish
            calculateAndEnd(newAnswers);
        }
    };

    const calculateAndEnd = (finalAnswers) => {
        // Calculate Dimensions
        // Map: Dimension -> Total Score (sum of all qs)
        // Normalize to -100 to +100 range? Or just 0-100 splits.
        // The spec said: "Sum all question scores" "Normalize into 0-100 percentage split".

        const dimScores = {
            EI: 0,
            SN: 0,
            TF: 0,
            JP: 0
        };

        const dimCounts = { EI: 0, SN: 0, TF: 0, JP: 0 };

        QUESTIONS.forEach(q => {
            const rawScore = finalAnswers[q.id] || 0;
            // Direction: +1 means Agree -> Right side (E, S, T, J)
            // Direction: -1 means Agree -> Left side (I, N, F, P) ? NO.
            // Data says: Direction 1 means Agree -> E. 
            // So if score is +2 (Str Agree) * 1 = +2 to E.
            // If score is -2 (Str Disagree) * 1 = -2 to E (implies I).

            // Actually, let's normalize to a 0-1 scale for accumulation then % at end.
            // Min score per Q: -2. Max: +2. Range 4.
            // Let's just sum raw (-2 to +2).
            const val = rawScore * q.direction;
            dimScores[q.dimension] += val;
            dimCounts[q.dimension] += 1;
        });

        // Convert to Percentages
        // Max possible score per dimension = Count * 2.
        // Min possible score per dimension = Count * -2.
        // Total Range = Count * 4.
        // E.g. EI has 12 qs. Range -24 to +24.
        // If score is 0, it's 50/50.
        // If score is +24, it's 100% Right (E).
        // If score is -24, it's 100% Left (I).

        // Formula: %Right = ((Score + Max) / (2 * Max)) * 100

        const results = {};
        let typeStr = "";

        Object.keys(dimScores).forEach(dim => {
            const score = dimScores[dim];
            const max = dimCounts[dim] * 2;

            // Percentage for RIGHT side (E, S, T, J)
            const pctRight = Math.round(((score + max) / (2 * max)) * 100);
            const pctLeft = 100 - pctRight;

            const leftChar = DIMENSIONS[dim].left;
            const rightChar = DIMENSIONS[dim].right;

            // Assign Letter
            const char = pctRight >= 50 ? rightChar : leftChar;
            typeStr += char;

            results[dim] = {
                score,
                pctLeft, // I, N, F, P
                pctRight, // E, S, T, J
                char,
                leftChar,
                rightChar
            };
        });

        const profile = {
            type: typeStr,
            breakdown: results,
            description: TYPE_DESCRIPTIONS[typeStr]
        };

        setResultData(profile);

        // Save to Supabase (meta only, score=0)
        saveScore(0, false, profile);
        setGameState('result');
    };

    return (
        <GameWrapper
            title="Personality Profiler"
            description="Discover your cognitive processing style. 50 situational questions."
            score={null}
            bestScore={null}
            onRestart={startTest}
        >
            <div className="personality-container">
                {gameState === 'waiting' && (
                    <div className="personality-intro">
                        <BrainCircuit size={64} className="p-icon" />
                        <h2>Cognitive Personality Map</h2>
                        <ul className="p-features">
                            <li>50 Questions</li>
                            <li>Analysis of 4 Core Dimensions</li>
                            <li>Uncover your decision-making architecture</li>
                        </ul>
                        <GlassButton onClick={startTest} size="large" variant="primary">Start Assessment</GlassButton>
                    </div>
                )}

                {gameState === 'playing' && (
                    <div className="personality-play">
                        <div className="p-progress">
                            <div className="bar-bg">
                                <motion.div
                                    className="bar-fill"
                                    animate={{ width: `${((currentQIndex) / QUESTIONS.length) * 100}%` }}
                                />
                            </div>
                            <span>{currentQIndex + 1} / {QUESTIONS.length}</span>
                        </div>

                        <div className="question-card">
                            <AnimatePresence mode="wait">
                                <motion.h3
                                    key={currentQIndex}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {QUESTIONS[currentQIndex].text}
                                </motion.h3>
                            </AnimatePresence>
                        </div>

                        <div className="likert-scale">
                            {Object.entries(SCORING).sort((a, b) => a[1] - b[1]).map(([label, val]) => (
                                <button
                                    key={label}
                                    className={`likert-btn val-${val}`}
                                    onClick={() => handleAnswer(val)}
                                >
                                    {/* Visual scale indicators */}
                                    <div className="dot"></div>
                                    <span className="label">{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {gameState === 'result' && resultData && (
                    <div className="personality-result">
                        <div className="type-reveal">
                            <span className="label">Your Cognitive Archetype</span>
                            <h1 className="type-code">{resultData.type}</h1>
                            <p className="type-desc">{resultData.description}</p>
                        </div>

                        <div className="dimensions-grid">
                            {Object.entries(resultData.breakdown).map(([dim, data]) => (
                                <div key={dim} className="dim-row">
                                    <div className="dim-labels">
                                        <span className={data.pctLeft > 50 ? 'active' : ''}>{data.leftChar}</span>
                                        <span className={data.pctRight > 50 ? 'active' : ''}>{data.rightChar}</span>
                                    </div>
                                    <div className="dim-bar-container">
                                        <div className="dim-bar left" style={{ width: `${data.pctLeft}%` }}></div>
                                        <div className="dim-bar right" style={{ width: `${data.pctRight}%` }}></div>
                                        <div className="marker" style={{ left: '50%' }}></div>
                                    </div>
                                    <div className="dim-values">
                                        <span>{data.pctLeft}%</span>
                                        <span>{data.pctRight}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <GlassButton onClick={startTest}>Retake Assessment</GlassButton>
                    </div>
                )}
            </div>
        </GameWrapper>
    );
}
