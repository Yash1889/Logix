import { Link } from 'react-router-dom';
import {
    Zap,
    Eye,
    Hash,
    Type,
    Target,
    MessageSquare,
    LayoutGrid,
    Play
} from 'lucide-react';
import { motion } from 'framer-motion';
import './Home.css';

const games = [
    {
        id: 'reaction',
        title: 'Reaction Time',
        description: 'Test your visual reflexes.',
        icon: <Zap size={48} className="game-icon-svg" />,
        color: '#ef4444'
    },
    {
        id: 'sequence',
        title: 'Sequence Memory',
        description: 'Remember an increasingly long pattern of button presses.',
        icon: <LayoutGrid size={48} className="game-icon-svg" />,
        color: '#3b82f6'
    },
    {
        id: 'aim',
        title: 'Aim Trainer',
        description: 'How quickly can you hit all the targets?',
        icon: <Target size={48} className="game-icon-svg" />,
        color: '#f97316'
    },
    {
        id: 'number-memory',
        title: 'Number Memory',
        description: 'Remember the longest number you can.',
        icon: <Hash size={48} className="game-icon-svg" />,
        color: '#10b981'
    },
    {
        id: 'verbal-memory',
        title: 'Verbal Memory',
        description: 'Keep as many words in short term memory as possible.',
        icon: <MessageSquare size={48} className="game-icon-svg" />,
        color: '#8b5cf6'
    },
    {
        id: 'visual-memory',
        title: 'Visual Memory',
        description: 'Remember an increasingly large board of squares.',
        icon: <Eye size={48} className="game-icon-svg" />,
        color: '#ec4899'
    },
    {
        id: 'typing',
        title: 'Typing',
        description: 'How many words per minute can you type?',
        icon: <Type size={48} className="game-icon-svg" />,
        color: '#eab308'
    }
];

export default function Home() {
    return (
        <div className="home-container">
            <header className="home-hero">
                <h1 className="hero-title">Human Benchmark</h1>
                <p className="hero-subtitle">Measure your abilities with brain games and cognitive tests.</p>
            </header>

            <div className="games-grid">
                {games.map((game) => (
                    <Link to={`/test/${game.id}`} key={game.id} className="game-card-link">
                        <motion.div
                            className="game-card"
                            whileHover={{ y: -5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div className="game-icon" style={{ color: game.color }}>
                                {game.icon}
                            </div>
                            <h3 className="game-card-title">{game.title}</h3>
                            <p className="game-card-desc">{game.description}</p>
                            <div className="game-cta">
                                <Play size={16} />
                                Play Now
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
