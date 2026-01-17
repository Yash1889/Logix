import { Link } from 'react-router-dom';
import {
    Zap, Brain, Eye, MousePointer, Activity,
    Clock, Hash, Type, Crosshair, Shuffle,
    ShieldAlert, Calculator, Sparkles, Gamepad2, Gift, Smile,
    TrendingUp, Layers, Fingerprint
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import { motion } from 'framer-motion';
import './Home.css';

// Re-using the CATEGORIES data structure but with updated iconography and grouping
const CATEGORIES = [
    {
        title: "Executive Function",
        desc: "Real-world decision making & planning",
        icon: <Layers size={24} />,
        color: "#f59e0b",
        games: [
            { name: "Task Switching", path: "/test/task-switching", icon: <Shuffle size={24} />, desc: "Multitasking cost measurement." }, // New
            { name: "Risk Decision", path: "/test/risk-decision", icon: <TrendingUp size={24} />, desc: "Risk tolerance profile." }, // New
            { name: "Tower Planning", path: "/test/tower-planning", icon: <Gamepad2 size={24} />, desc: "Strategic planning depth." }, // New
        ]
    },
    {
        title: "Reaction & Speed",
        desc: "Raw neural processing speed",
        icon: <Zap size={24} />,
        color: "#ef4444",
        games: [
            { name: "Reaction Time", path: "/test/reaction", icon: <Clock size={24} />, desc: "Simple visual reflex." },
            { name: "Aim Trainer", path: "/test/aim", icon: <Crosshair size={24} />, desc: "Motor precision & speed." },
            { name: "Typing", path: "/test/typing", icon: <Type size={24} />, desc: "Keyboard fluency." },
            { name: "Stroop Test", path: "/test/stroop", icon: <Activity size={24} />, desc: "Inhibitory control." },
        ]
    },
    {
        title: "Memory",
        desc: "Short-term & working memory capacity",
        icon: <Brain size={24} />,
        color: "#3b82f6",
        games: [
            { name: "Visual Memory", path: "/test/visual-memory", icon: <Gamepad2 size={24} />, desc: "Pattern recall." },
            { name: "Number Memory", path: "/test/number-memory", icon: <Hash size={24} />, desc: "Digit span capacity." },
            { name: "Sequence Memory", path: "/test/sequence", icon: <Layers size={24} />, desc: "Spatial storage." },
            { name: "Chimpanzee Test", path: "/test/chimpanzee", icon: <Brain size={24} />, desc: "Primate-level spatial memory." },
            { name: "Verbal Memory", path: "/test/verbal-memory", icon: <Type size={24} />, desc: "Language retention." },
        ]
    },
    {
        title: "Attention & Control",
        desc: "Focus stamina and impulse regulation",
        icon: <Eye size={24} />,
        color: "#eab308",
        games: [
            { name: "Sustained Attention", path: "/test/sustained-attention", icon: <Eye size={24} />, desc: "Long-term vigilance." },
            { name: "Go / No-Go", path: "/test/go-no-go", icon: <ShieldAlert size={24} />, desc: "Response inhibition." },
            { name: "N-Back", path: "/test/n-back", icon: <Brain size={24} />, desc: "Continuous memory load." },
        ]
    },
    {
        title: "Intelligence & Logic",
        desc: "Abstract reasoning and fluid intelligence",
        icon: <Sparkles size={24} />,
        color: "#8b5cf6",
        games: [
            { name: "Mental Math", path: "/test/mental-math", icon: <Calculator size={24} />, desc: "Arithmetic speed." },
            { name: "Pattern Recognition", path: "/test/pattern-recognition", icon: <Activity size={24} />, desc: "Abstract logic." },
            { name: "Logic Test", path: "/test/logic", icon: <Brain size={24} />, desc: "Deductive reasoning." },
            { name: "Learning Curve", path: "/test/learning-curve", icon: <TrendingUp size={24} />, desc: "Adaptability & pattern learning." }, // New
        ]
    },
    {
        title: "Psychological & EQ",
        desc: "Emotional intelligence and bias",
        icon: <Smile size={24} />,
        color: "#ec4899",
        games: [
            { name: "Delay of Gratification", path: "/test/delay-gratification", icon: <Gift size={24} />, desc: "Time preference." },
            { name: "Emotion Recognition", path: "/test/emotion-recognition", icon: <Smile size={24} />, desc: "Facial micro-expressions." },
            { name: "Theory of Mind", path: "/test/theory-of-mind", icon: <Brain size={24} />, desc: "Social prediction." }, // New
            { name: "Bias Benchmarks", path: "/test/bias-benchmarks", icon: <ShieldAlert size={24} />, desc: "Cognitive bias susceptibility." }, // New
            { name: "Time Estimation", path: "/test/time-estimation", icon: <Clock size={24} />, desc: "Internal clock & impulsivity." }, // New
        ]
    }
];

export default function Home() {
    return (
        <div className="home-container">
            <header className="home-header">
                <div>
                    <h1 className="hero-title">
                        HUMAN BENCHMARK <span className="version-badge">V3.1</span>
                    </h1>
                    <p className="hero-subtitle">
                        Advanced Cognitive Assessment & Personality Profiling Platform.
                    </p>
                </div>
                {/* Could add a 'Login' or 'Profile' quick link here later */}
            </header>

            <div className="category-list">
                {CATEGORIES.map((cat, i) => (
                    <motion.div
                        key={i}
                        className="category-section"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <div className="cat-header">
                            <div className="cat-icon-box" style={{ borderColor: cat.color, color: cat.color }}>
                                {cat.icon}
                            </div>
                            <h2>{cat.title}</h2>
                            <span className="cat-desc">{cat.desc}</span>
                        </div>

                        <div className="games-grid">
                            {cat.games.map((g, j) => (
                                <Link key={j} to={g.path} style={{ display: 'block' }}>
                                    <GlassCard hoverEffect className="game-card-elite">
                                        <div className="game-icon-elite" style={{ color: cat.color }}>
                                            {g.icon}
                                        </div>
                                        <div className="game-info">
                                            <h3>{g.name}</h3>
                                            <p>{g.desc}</p>
                                        </div>
                                    </GlassCard>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
