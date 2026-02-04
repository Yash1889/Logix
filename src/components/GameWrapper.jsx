import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Monitor } from 'lucide-react';
import './GameWrapper.css';
import '../games/TestInterface.css'; // Global game styles

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
            <header className="game-header">
                <button onClick={() => navigate('/dashboard')} className="game-btn-nav">
                    <ArrowLeft size={18} />
                    ABORT_SEQ
                </button>
                <div className="game-header-title">
                    TEST_PROTOCOL // {title.toUpperCase()}
                </div>
            </header>

            <main className="game-content-container">
                {children}
            </main>

            <footer className="game-footer">
                <div style={{ display: 'flex', gap: '10px' }}>
                    {onRestart && (
                        <button onClick={onRestart} className="game-action-btn">
                            <RotateCcw size={16} />
                            REINITIALIZE
                        </button>
                    )}
                </div>

                <div className="telemetry-panel">
                    {score !== null && score !== undefined && (
                        <div className="telemetry-item">
                            <span className="telemetry-label">CURRENT_READING</span>
                            <span className="telemetry-val highlight">{score}</span>
                        </div>
                    )}
                    {(sessionBest !== null || bestScore !== null) && (
                        <div className="telemetry-item">
                            <span className="telemetry-label">RECORD_HIGH</span>
                            <span className="telemetry-val">{sessionBest || bestScore}</span>
                        </div>
                    )}
                </div>
            </footer>
        </div>
    );
}
