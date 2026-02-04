import { useState, useEffect } from 'react';
import GameWrapper from '../components/GameWrapper';
import { useGameScore } from '../hooks/useGameScore';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, AlertOctagon, Wind, DollarSign } from 'lucide-react';
import './RiskDecision.css';

const MAX_ROUNDS = 10;
const MAX_PUMPS = 20;

export default function RiskDecision() {
    const { bestScore, sessionBest, saveScore } = useGameScore('risk-decision');
    const [gameState, setGameState] = useState('waiting');

    // Game State
    const [round, setRound] = useState(1);
    const [currentPot, setCurrentPot] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [balloonSize, setBalloonSize] = useState(0); // 0 to MAX_PUMPS scale
    const [popped, setPopped] = useState(false);

    // Hidden Logic
    const [explosionPoint, setExplosionPoint] = useState(0);
    const [history, setHistory] = useState([]); // Analysis data

    const startRound = () => {
        setPopped(false);
        setCurrentPot(0);
        setBalloonSize(0);
        // BART Logic: Randomized explosion point 1..MAX_PUMPS
        setExplosionPoint(Math.floor(Math.random() * MAX_PUMPS) + 1);
    };

    const startGame = () => {
        setGameState('playing');
        setTotalScore(0);
        setHistory([]);
        setRound(1);
        startRound();
    };

    const handlePump = () => {
        if (popped) return;

        const nextSize = balloonSize + 1;

        if (nextSize >= explosionPoint) {
            // POP!
            setPopped(true);

            // Record failure
            const roundStats = {
                round,
                pumps: balloonSize, // pumps made BEFORE pop
                collected: 0,
                popped: true,
                potential: currentPot
            };
            setHistory(prev => [...prev, roundStats]);

            setTimeout(() => {
                nextRound();
            }, 1500);
        } else {
            // Success
            setBalloonSize(nextSize);
            setCurrentPot(prev => prev + 100 + (nextSize * 10)); // Progressive reward? Or linear? Linear is standard BART. Let's do linear + small bonus.
        }
    };

    const handleCollect = () => {
        if (popped) return;

        setTotalScore(prev => prev + currentPot);

        const roundStats = {
            round,
            pumps: balloonSize,
            collected: currentPot,
            popped: false,
            potential: currentPot
        };
        setHistory(prev => [...prev, roundStats]);

        nextRound();
    };

    const nextRound = () => {
        if (round >= MAX_ROUNDS) {
            endGame();
        } else {
            setRound(r => r + 1);
            startRound();
        }
    };

    const endGame = () => {
        // Safe timeout to let state settle before final calculation
        setTimeout(() => {
            setGameState('result');
        }, 100);
    };

    // Save score effect
    useEffect(() => {
        if (gameState === 'result' && history.length === MAX_ROUNDS) {
            const finalScore = totalScore;
            const avgPumps = history.reduce((acc, h) => acc + h.pumps, 0) / MAX_ROUNDS;
            const popRate = history.filter(h => h.popped).length / MAX_ROUNDS;
            const riskProfile = avgPumps > 12 ? 'HIGH RISK' : avgPumps < 5 ? 'RISK AVERSE' : 'BALANCED';

            const meta = {
                avgPumps: avgPumps.toFixed(1),
                popRate: (popRate * 100).toFixed(0) + '%',
                riskProfile
            };

            saveScore(finalScore, false, meta);
        }
    }, [gameState, history, totalScore, saveScore]);

    return (
        <GameWrapper
            title="Risk Decision"
            description="Balloon Analogue Risk Task (BART). Assess risk tolerance vs reward."
            onRestart={startGame}
            score={`BANK: $${totalScore}`}
            bestScore={bestScore ? `$${bestScore}` : null}
            sessionBest={sessionBest ? `$${sessionBest}` : null}
        >
            <div className="risk-container full-height">
                {gameState === 'waiting' && (
                    <div className="risk-overlay">
                        <TrendingUp size={80} className="risk-icon" />
                        <h1 className="risk-title">RISK ASSESSMENT PROTOCOL</h1>
                        <div className="risk-instructions">
                            <p>INFLATE THE ASSET TO INCREASE VALUE.</p>
                            <p>FAILURE RESULTS IN TOTAL LOSS FOR THE ROUND.</p>
                            <p>SECURE PROFITS BEFORE CRITICAL MASS.</p>
                        </div>
                        <button className="risk-btn-start" onClick={startGame}>INITIATE ASSESSMENT</button>
                    </div>
                )}

                {gameState === 'playing' && (
                    <div className="risk-play-area">
                        <div className="risk-hud">
                            <div className="hud-panel left">
                                <span className="label">ROUND</span>
                                <span className="value">{round} / {MAX_ROUNDS}</span>
                            </div>
                            <div className="hud-panel right">
                                <span className="label">CURRENT POT</span>
                                <span className="value money">${currentPot}</span>
                            </div>
                        </div>

                        <div className="balloon-stage">
                            <AnimatePresence>
                                {!popped ? (
                                    <motion.div
                                        className="balloon-asset"
                                        animate={{
                                            scale: 1 + (balloonSize * 0.15),
                                            rotate: Math.sin(Date.now() / 100) * (balloonSize * 0.5) // Slight shake as it gets bigger
                                        }}
                                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                    >
                                        <div className="balloon-shine"></div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        className="balloon-popped"
                                        initial={{ opacity: 1, scale: 2 }}
                                        animate={{ opacity: 0, scale: 3 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <AlertOctagon size={100} color="#ef4444" />
                                        <span className="pop-text">CRITICAL FAILURE</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="risk-controls-bar">
                            <button
                                className="risk-action-btn pump"
                                onClick={handlePump}
                                disabled={popped}
                            >
                                <Wind size={24} />
                                <span>PUMP ASSET</span>
                            </button>

                            <div className="risk-divider"></div>

                            <button
                                className="risk-action-btn collect"
                                onClick={handleCollect}
                                disabled={popped || currentPot === 0}
                            >
                                <DollarSign size={24} />
                                <span>SECURE &nbsp;${currentPot}</span>
                            </button>
                        </div>
                    </div>
                )}

                {gameState === 'result' && (
                    <div className="risk-result-panel">
                        <div className="result-display">
                            <span className="result-label">TOTAL YIELD</span>
                            <span className="result-val">${totalScore}</span>
                        </div>

                        <div className="risk-analysis-grid">
                            <div className="analysis-item">
                                <span className="label">AVG INFLATION</span>
                                <span className="value">{(history.reduce((a, b) => a + b.pumps, 0) / MAX_ROUNDS).toFixed(1)}</span>
                            </div>
                            <div className="analysis-item">
                                <span className="label">FAILURE RATE</span>
                                <span className="value">{history.filter(h => h.popped).length} / {MAX_ROUNDS}</span>
                            </div>
                        </div>

                        <button className="risk-retry-btn" onClick={startGame}>
                            RE-EVALUATE
                        </button>
                    </div>
                )}
            </div>
        </GameWrapper>
    );
}
