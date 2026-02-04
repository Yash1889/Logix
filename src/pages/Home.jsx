import { Link } from 'react-router-dom';
import {
    Zap, Brain, Eye, Activity,
    Clock, Hash, Type, Crosshair, Shuffle,
    ShieldAlert, Calculator, Sparkles, Gamepad2, Gift, Smile,
    TrendingUp, Layers, User
} from 'lucide-react';
import { motion } from 'framer-motion';
import './Home.css';

// Re-using the CATEGORIES data structure
const CATEGORIES = [
    {
        title: "EXECUTIVE_FUNCTION",
        desc: "Decision making & planning protocols",
        icon: <Layers size={20} />,
        color: "var(--accent-primary)",
        games: [
            { name: "Task Switching", path: "/test/task-switching", icon: <Shuffle size={18} />, desc: "Multitasking overhead." },
            { name: "Risk Decision", path: "/test/risk-decision", icon: <TrendingUp size={18} />, desc: "Risk tolerance analysis." },
            { name: "Tower Planning", path: "/test/tower-planning", icon: <Gamepad2 size={18} />, desc: "Strategic depth." },
        ]
    },
    {
        title: "REACTION_SPEED",
        desc: "Neural processing velocity",
        icon: <Zap size={20} />,
        color: "var(--status-error)",
        games: [
            { name: "Reaction Time", path: "/test/reaction", icon: <Clock size={18} />, desc: "Visual reflex latency." },
            { name: "Aim Trainer", path: "/test/aim", icon: <Crosshair size={18} />, desc: "Motor precision." },
            { name: "Typing", path: "/test/typing", icon: <Type size={18} />, desc: "Input fluency." },
            { name: "Stroop Test", path: "/test/stroop", icon: <Activity size={18} />, desc: "Interference control." },
        ]
    },
    {
        title: "MEMORY_CAPACITY",
        desc: "Working memory retention",
        icon: <Brain size={20} />,
        color: "var(--status-success)",
        games: [
            { name: "Visual Memory", path: "/test/visual-memory", icon: <Gamepad2 size={18} />, desc: "Pattern recall." },
            { name: "Number Memory", path: "/test/number-memory", icon: <Hash size={18} />, desc: "Digit span." },
            { name: "Sequence Memory", path: "/test/sequence", icon: <Layers size={18} />, desc: "Spatial storage." },
            { name: "Chimpanzee Test", path: "/test/chimpanzee", icon: <Brain size={18} />, desc: "Primate spatial memory." },
            { name: "Verbal Memory", path: "/test/verbal-memory", icon: <Type size={18} />, desc: "Lexical retention." },
        ]
    },
    {
        title: "ATTENTION_CONTROL",
        desc: "Focus stamina regulation",
        icon: <Eye size={20} />,
        color: "var(--status-warning)",
        games: [
            { name: "Sustained Attention", path: "/test/sustained-attention", icon: <Eye size={18} />, desc: "Vigilance decay." },
            { name: "Go / No-Go", path: "/test/go-no-go", icon: <ShieldAlert size={18} />, desc: "Inhibitory response." },
            { name: "N-Back", path: "/test/n-back", icon: <Brain size={18} />, desc: "Memory load." },
        ]
    },
    {
        title: "LOGIC_INTELLIGENCE",
        desc: "Abstract reasoning fluid",
        icon: <Sparkles size={20} />,
        color: "var(--info)",
        games: [
            { name: "Mental Math", path: "/test/mental-math", icon: <Calculator size={18} />, desc: "Computational speed." },
            { name: "Pattern Recognition", path: "/test/pattern-recognition", icon: <Activity size={18} />, desc: "Inductive logic." },
            { name: "Logic Test", path: "/test/logic", icon: <Brain size={18} />, desc: "Deductive reasoning." },
            { name: "Learning Curve", path: "/test/learning-curve", icon: <TrendingUp size={18} />, desc: "Pattern adaptation." },
        ]
    },
    {
        title: "PSYCH_PROFILE",
        desc: "Emotional & bias analytics",
        icon: <Smile size={20} />,
        color: "#ec4899",
        games: [
            { name: "Delay of Gratification", path: "/test/delay-gratification", icon: <Gift size={18} />, desc: "Time preference." },
            { name: "Emotion Recognition", path: "/test/emotion-recognition", icon: <Smile size={18} />, desc: "Micro-expressions." },
            { name: "Theory of Mind", path: "/test/theory-of-mind", icon: <Brain />, desc: "Social cognition." },
            { name: "Personality Profiler", icon: <User />, path: "/test/personality", desc: "Cognitive archetype." },
            { name: "Bias Benchmarks", path: "/test/bias-benchmarks", icon: <ShieldAlert size={18} />, desc: "Bias susceptibility." },
            { name: "Time Estimation", path: "/test/time-estimation", icon: <Clock size={18} />, desc: "Internal chronometry." },
        ]
    }
];

export default function Home() {
    return (
        <div className="home-container">
            <header className="home-header">
                <div>
                    <h1 className="hero-title">
                        LOGIX_SYS // V4.0
                    </h1>
                    <p className="hero-subtitle">
                        ADVANCED COGNITIVE DIAGNOSTICS PLATFORM
                    </p>
                </div>
            </header>

            <div className="category-list">
                {CATEGORIES.map((cat, i) => (
                    <motion.div
                        key={i}
                        className="category-section"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <div className="cat-header">
                            <span className="cat-icon-box" style={{ color: cat.color }}>
                                {cat.icon}
                            </span>
                            <h2>{cat.title}</h2>
                        </div>
                        <div className="cat-desc-line">{cat.desc}</div>

                        <div className="games-grid">
                            {cat.games.map((g, j) => (
                                <Link key={j} to={g.path} className="game-link">
                                    <div className="game-panel">
                                        <div className="game-icon-box">
                                            {g.icon}
                                        </div>
                                        <div className="game-info">
                                            <h3>{g.name}</h3>
                                            <p>{g.desc}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
