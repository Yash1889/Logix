import { useState } from 'react';
import { useGameScore } from '../hooks/useGameScore';
import GlassButton from '../components/ui/GlassButton';
import { QUESTIONS, SCORING, DIMENSIONS, TYPE_DESCRIPTIONS } from '../data/personalityQuestions';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, ChevronRight, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './PersonalityTest.css';

export default function PersonalityTest() {
    const { saveScore } = useGameScore('personality-test');
    const [gameState, setGameState] = useState('waiting');
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const navigate = useNavigate();

    const startTest = () => {
        setGameState('playing');
        setCurrentQIndex(0);
        setAnswers({});
    };

    const handleAnswer = (score) => {
        const question = QUESTIONS[currentQIndex];
        const newAnswers = { ...answers, [question.id]: score };
        setAnswers(newAnswers);

        if (currentQIndex < QUESTIONS.length - 1) {
            setTimeout(() => {
                setCurrentQIndex(prev => prev + 1);
            }, 250);
        } else {
            calculateAndEnd(newAnswers);
        }
    };

    const calculateAndEnd = async (finalAnswers) => {
        const dimScores = { EI: 0, SN: 0, TF: 0, JP: 0 };
        const dimCounts = { EI: 0, SN: 0, TF: 0, JP: 0 };

        QUESTIONS.forEach(q => {
            const rawScore = finalAnswers[q.id] || 0;
            const val = rawScore * q.direction;
            dimScores[q.dimension] += val;
            dimCounts[q.dimension] += 1;
        });

        const results = {};
        let typeStr = "";

        Object.keys(dimScores).forEach(dim => {
            const score = dimScores[dim];
            const max = dimCounts[dim] * 2;
            const pctRight = Math.round(((score + max) / (2 * max)) * 100);
            const pctLeft = 100 - pctRight;

            const leftChar = DIMENSIONS[dim].left;
            const rightChar = DIMENSIONS[dim].right;
            const char = pctRight >= 50 ? rightChar : leftChar;
            typeStr += char;

            results[dim] = {
                score, pctLeft, pctRight, char, leftChar, rightChar
            };
        });

        const profile = {
            type: typeStr,
            breakdown: results,
            description: TYPE_DESCRIPTIONS[typeStr]
        };

        // Save and Redirect
        const result = await saveScore(0, false, profile);

        if (result.success) {
            navigate('/personality-profile');
        } else {
            alert("Failed to save your profile. Please check that you have run the database migration (supabase-setup-v2.sql).");
        }
    };

    return (
        <div className="personality-full-page">
            <Link to="/" className="p-back-link">
                <ArrowLeft size={20} /> Back to Hub
            </Link>

            {gameState === 'waiting' && (
                <motion.div
                    className="p-intro-hero"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div className="p-hero-content">
                        <BrainCircuit size={100} className="p-hero-icon" />
                        <h1 className="p-hero-title">Cognitive Personality Map</h1>
                        <p className="p-hero-subtitle">
                            Uncover your neural architecture through 50 situational inquiries.
                            Analysis of 4 Core Dimensions: Energy, Information, Decision, Structure.
                        </p>
                        <GlassButton onClick={startTest} size="large" variant="primary">
                            Begin Assessment
                        </GlassButton>
                    </div>
                </motion.div>
            )}

            {gameState === 'playing' && (
                <div className="p-test-container">
                    <div className="p-progress-bar">
                        <motion.div
                            className="p-fill"
                            animate={{ width: `${((currentQIndex + 1) / QUESTIONS.length) * 100}%` }}
                        />
                    </div>
                    <div className="p-counter">Question {currentQIndex + 1} / {QUESTIONS.length}</div>

                    <div className="p-question-area">
                        <AnimatePresence mode="wait">
                            <motion.h2
                                key={currentQIndex}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="p-question-text"
                            >
                                {QUESTIONS[currentQIndex].text}
                            </motion.h2>
                        </AnimatePresence>

                        <div className="p-options-grid">
                            {Object.entries(SCORING).sort((a, b) => a[1] - b[1]).map(([label, val]) => (
                                <button
                                    key={label}
                                    className={`p-option-btn val-${val}`}
                                    onClick={() => handleAnswer(val)}
                                >
                                    <div className="p-dot"></div>
                                    <span>{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
