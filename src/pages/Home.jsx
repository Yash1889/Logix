import { Link } from 'react-router-dom';
import {
    Zap, Brain, Eye, MousePointer, Activity,
    Clock, Hash, Type, Crosshair, Shuffle,
    ShieldAlert, Calculator, Sparkles, Gamepad2, Gift, Smile
} from 'lucide-react';
import './Home.css';

const CATEGORIES = [
    {
        title: "Reaction & Speed",
        icon: <Zap size={24} />,
        color: "#ef4444",
        games: [
            { name: "Reaction Time", path: "/test/reaction", icon: <Clock size={24} />, desc: "Test your visual reflexes." },
            { name: "Aim Trainer", path: "/test/aim", icon: <Crosshair size={24} />, desc: "Hit targets quickly." },
            { name: "Typing", path: "/test/typing", icon: <Type size={24} />, desc: "How fast can you type?" },
            { name: "Stroop Test", path: "/test/stroop", icon: <Shuffle size={24} />, desc: "Test cognitive flexibility." },
        ]
    },
    {
        title: "Memory",
        icon: <Brain size={24} />,
        color: "#3b82f6",
        games: [
            { name: "Visual Memory", path: "/test/visual-memory", icon: <Gamepad2 size={24} />, desc: "Remember patterns." },
            { name: "Number Memory", path: "/test/number-memory", icon: <Hash size={24} />, desc: "Remember the longest number." },
            { name: "Sequence Memory", path: "/test/sequence", icon: <Activity size={24} />, desc: "Remember the order." },
            { name: "Chimpanzee Test", path: "/test/chimpanzee", icon: <Brain size={24} />, desc: "Spatial memory challenge." },
            { name: "Verbal Memory", path: "/test/verbal-memory", icon: <Type size={24} />, desc: "Keep track of words." },
        ]
    },
    {
        title: "Attention & Control",
        icon: <Eye size={24} />,
        color: "#eab308",
        games: [
            { name: "Sustained Attention", path: "/test/sustained-attention", icon: <Eye size={24} />, desc: "Focus on the target." },
            { name: "Go / No-Go", path: "/test/go-no-go", icon: <ShieldAlert size={24} />, desc: "Test impulse control." },
            { name: "N-Back", path: "/test/n-back", icon: <Brain size={24} />, desc: "Working memory load." },
        ]
    },
    {
        title: "Intelligence & Reasoning",
        icon: <Sparkles size={24} />,
        color: "#8b5cf6",
        games: [
            { name: "Mental Math", path: "/test/mental-math", icon: <Calculator size={24} />, desc: "Rapid arithmetic." },
            { name: "Pattern Recognition", path: "/test/pattern-recognition", icon: <Activity size={24} />, desc: "Find the missing piece." },
            { name: "Logic Test", path: "/test/logic", icon: <Brain size={24} />, desc: "Solve logical puzzles." },
        ]
    },
    {
        title: "Psychological & EQ",
        icon: <Smile size={24} />,
        color: "#ec4899",
        games: [
            { name: "Delay of Gratification", path: "/test/delay-gratification", icon: <Gift size={24} />, desc: "Test self-control." },
            { name: "Emotion Recognition", path: "/test/emotion-recognition", icon: <Smile size={24} />, desc: "Identify facial expressions." },
        ]
    }
];

export default function Home() {
    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Human Benchmark V2</h1>
                <p>Measure your cognitive abilities with brain games and cognitive tests.</p>
            </header>

            <div className="category-list">
                {CATEGORIES.map((cat, i) => (
                    <div key={i} className="category-section">
                        <div className="cat-header" style={{ color: cat.color }}>
                            {cat.icon}
                            <h2>{cat.title}</h2>
                        </div>
                        <div className="games-grid">
                            {cat.games.map((g, j) => (
                                <Link key={j} to={g.path} className="game-card">
                                    <div className="game-icon" style={{ color: cat.color }}>
                                        {g.icon}
                                    </div>
                                    <h3>{g.name}</h3>
                                    <p>{g.desc}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
