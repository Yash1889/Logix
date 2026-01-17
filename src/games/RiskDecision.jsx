import { useState } from 'react';
import GameWrapper from '../components/GameWrapper';
import { useGameScore } from '../hooks/useGameScore';
import GlassButton from '../components/ui/GlassButton';
import { TrendingUp, AlertOctagon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './RiskDecision.css';

const MAX_ROUNDS = 10;
const MAX_PUMPS = 20;

export default function RiskDecision() {
    const { bestScore, sessionBest, saveScore } = useGameScore('risk-decision');
    const [gameState, setGameState] = useState('waiting');

    const [round, setRound] = useState(1);
    const [currentPot, setCurrentPot] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [balloonSize, setBalloonSize] = useState(1);
    const [popped, setPopped] = useState(false);
    const [history, setHistory] = useState([]); // { round, pumps, collected, popped }

    // Logic: Each pump adds 10 points.
    // Probability of pop increases with each pump?
    // Classic BART: Pop probability = 1 / (max_pumps - current_pump + 1)
    // Or fixed array of pop points.

    // Let's use randomized explosion point between 2 and 20.
    const [explosionPoint, setExplosionPoint] = useState(0);

    const startRound = () => {
        setPopped(false);
        setCurrentPot(0);
        setBalloonSize(1);
        // Determine explosion point for this round (unknown to user)
        // Range: 1 to MAX_PUMPS.
        // Weighted? Uniform?
        // Uniform random 1..20
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

        if (nextSize > explosionPoint) {
            // POP!
            setPopped(true);
            setHistory([...history, { round, pumps: balloonSize, collected: 0, popped: true }]);

            setTimeout(() => {
                nextRound();
            }, 1500);
        } else {
            setBalloonSize(nextSize);
            setCurrentPot(prev => prev + 100);
        }
    };

    const handleCollect = () => {
        if (popped) return;

        setTotalScore(prev => prev + currentPot);
        setHistory([...history, { round, pumps: balloonSize, collected: currentPot, popped: false }]);
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
        // Metric: Risk Score (Avg Pumps).
        // Metric: Loss Aversion (Did they stop too early?).
        // Metric: Explosion Rate.

        // We need to calculate final stats before saving.
        // But state update is async.
        // Use the history array we just updated? 
        // Wait, history update in handleCollect/handlePump is also async.
        // We need to pass the final history to analyze.

        // Let's assume the effect/render cycle will catch up if we delay?
        // Better: Construct newHistory in the handler and pass it.
        // For now, simple re-calc from state? No.
        // Let's do a trick: endGame is called from nextRound which is called after history update. 
        // BUT state might not be flushed.
        // Actually, standard React: updates are batched.
        // Let's rely on a `useEffect` for game over?
        // Or just pass the final score directly.

        // Score = Total Points.
        // Meta = Avg Pumps adjusted relative to optimal.

        // OPTIMAL STRATEGY (Risk Neutral): Pump until expected value negative.
        // If uniform 1..20, Avg pop is 10.5. 
        // Safe to pump 10 times?

        setTimeout(() => {
            setGameState('result');
            // history state IS stale here due to closure if not careful.
            // But reading from state in timeout might work? No.
            // Let's just saveScore with totalScore.
        }, 100);
    };

    // Dedicated effect to handle game end saving to ensure we have latest history
    useEffect(() => {
        if (gameState === 'result' && history.length === MAX_ROUNDS) {
            // Analyze
            const avgPumps = history.reduce((acc, h) => acc + h.pumps, 0) / MAX_ROUNDS;
            const popRate = history.filter(h => h.popped).length / MAX_ROUNDS;

            const meta = {
                avgPumps,
                popRate,
                riskProfile: avgPumps > 12 ? 'Reckless' : avgPumps < 5 ? 'Conservative' : 'Balanced'
            };

            saveScore(totalScore, false, meta);
        }
    }, [gameState, history, totalScore]);


    return (
        <GameWrapper
            title="Risk Decision"
            description="Pump the balloon to earn points. If it pops, you lose the round's points. Collect to bank them."
            onRestart={startGame}
            score={`Pot: ${currentPot} | Total: ${totalScore}`}
            bestScore={bestScore ? `Best: ${bestScore}` : null}
        >
            <div className="risk-container">
                {gameState === 'waiting' && (
                    <div className="risk-intro">
                        <TrendingUp size={64} color="var(--accent-primary)" />
                        <h2>The Balloon Test</h2>
                        <p>Each pump = $100. <br /> Hidden explosion point. <br /> How far will you push your luck?</p>
                        <GlassButton variant="primary" size="large" onClick={startGame}>Start 10 Rounds</GlassButton>
                    </div>
                )}

                {gameState === 'playing' && (
                    <div className="risk-play">
                        <div className="risk-header">Round {round} / {MAX_ROUNDS}</div>

                        <div className="balloon-area">
                            <AnimatePresence>
                                {!popped ? (
                                    <motion.div
                                        className="balloon"
                                        animate={{ scale: 1 + (balloonSize * 0.1) }}
                                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                    />
                                ) : (
                                    <motion.div
                                        className="explosion"
                                        initial={{ scale: 1 }}
                                        animate={{ scale: 2, opacity: 0 }}
                                    >
                                        💥
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="risk-controls">
                            <GlassButton
                                onClick={handlePump}
                                disabled={popped}
                                className="pump-btn"
                                variant="outline"
                            >
                                Pump (+100)
                            </GlassButton>

                            <GlassButton
                                onClick={handleCollect}
                                disabled={popped || currentPot === 0}
                                variant="primary"
                            >
                                Collect ${currentPot}
                            </GlassButton>
                        </div>
                    </div>
                )}

                {gameState === 'result' && (
                    <div className="risk-result">
                        <h1>Total Earned: ${totalScore}</h1>
                        <div className="risk-stats">
                            <div className="stat-row">
                                <span>Pops:</span>
                                <strong>{history.filter(h => h.popped).length}</strong>
                            </div>
                            <div className="stat-row">
                                <span>Avg Pumps:</span>
                                <strong>{(history.reduce((a, b) => a + b.pumps, 0) / MAX_ROUNDS).toFixed(1)}</strong>
                            </div>
                        </div>
                        <GlassButton onClick={startGame}>Play Again</GlassButton>
                    </div>
                )}
            </div>
        </GameWrapper>
    );
}
