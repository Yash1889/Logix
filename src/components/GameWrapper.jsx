import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import './GameWrapper.css';

export default function GameWrapper({
    title,
    description,
    children,
    onRestart,
    score,
    bestScore,
    sessionBest
}) {
    const navigate = useNavigate();

    return (
        <div className="game-wrapper">
            <div className="game-header">
                <button onClick={() => navigate('/')} className="game-back-btn">
                    <ArrowLeft size={24} />
                    <span>Back to Games</span>
                </button>
                <h1 className="game-title">{title}</h1>
            </div>

            <div className="game-content-container">
                {children}
            </div>

            <div className="game-footer">
                {onRestart && (
                    <button onClick={onRestart} className="game-restart-btn">
                        <RotateCcw size={20} />
                        Restart Test
                    </button>
                )}

                <div className="game-stats">
                    {score !== null && score !== undefined && (
                        <div className="stat-item">
                            <span className="stat-label">Current</span>
                            <span className="stat-value">{score}</span>
                        </div>
                    )}
                    {sessionBest !== null && (
                        <div className="stat-item">
                            <span className="stat-label">Session Best</span>
                            <span className="stat-value">{sessionBest}</span>
                        </div>
                    )}
                    {bestScore !== null && (
                        <div className="stat-item highlight">
                            <span className="stat-label">All-Time Best</span>
                            <span className="stat-value">{bestScore}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
