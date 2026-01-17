import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { MBTI_PROFILES } from '../data/personalityProfiles';
import { motion } from 'framer-motion';
import GlassCard from '../components/ui/GlassCard';
import GlassButton from '../components/ui/GlassButton';
import { Link } from 'react-router-dom';
import {
    Briefcase, Film, User, Star, ArrowLeft,
    BrainCircuit, Target, Shield, Heart
} from 'lucide-react';
import './PersonalityProfile.css';

export default function PersonalityProfile() {
    const { user, loading: authLoading } = useAuth();
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState(null);
    const [dataLoading, setDataLoading] = useState(true);

    useEffect(() => {
        if (!authLoading) {
            if (user) {
                fetchPersonalityData();
            } else {
                setDataLoading(false);
            }
        }
    }, [user, authLoading]);

    const fetchPersonalityData = async () => {
        // Fetch the game score meta for personality-test
        const { data, error } = await supabase
            .from('game_scores')
            .select('meta')
            .eq('user_id', user.id)
            .eq('game_id', 'personality-test')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (data && data.meta && data.meta.type) {
            const mbtiCode = data.meta.type;
            const richData = MBTI_PROFILES[mbtiCode];

            setStats(data.meta.breakdown); // The numeric split
            setProfile({
                code: mbtiCode,
                ...richData
            });
        }
        setDataLoading(false);
    };

    if (authLoading || dataLoading) return <div className="prof-loading">Loading neural map...</div>;

    if (!profile) {
        return (
            <div className="prof-empty">
                <BrainCircuit size={64} className="mb-4 text-muted" />
                <h2>No Cognitive Profile Found</h2>
                <p>Complete the assessment to unlock your analysis.</p>
                <Link to="/test/personality">
                    <GlassButton variant="primary">Start Assessment</GlassButton>
                </Link>
            </div>
        );
    }

    return (
        <div className="prof-container">
            <Link to="/dashboard" className="prof-back">
                <ArrowLeft size={16} /> Back to Dashboard
            </Link>

            {/* Hero Section */}
            <motion.div
                className="prof-hero"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="prof-badge">COGNITIVE ARCHETYPE</div>
                <h1 className="prof-title">{profile.title}</h1>
                <div className="prof-code">{profile.code}</div>
                <p className="prof-tagline">"{profile.tagline}"</p>
                <blockquote className="prof-quote">{profile.quote}</blockquote>
            </motion.div>

            {/* Core Dimensions */}
            <div className="prof-grid">
                <GlassCard className="prof-section dimensions">
                    <h3><Target size={20} /> Neural Architecture</h3>
                    <div className="dims-list">
                        {Object.entries(stats).map(([key, data]) => (
                            <div key={key} className="dim-item">
                                <div className="dim-row-head">
                                    <span className={data.pctLeft > 50 ? 'active' : ''}>{data.leftChar}</span>
                                    <span className={data.pctRight > 50 ? 'active' : ''}>{data.rightChar}</span>
                                </div>
                                <div className="dim-track">
                                    <motion.div
                                        className="dim-val left"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${data.pctLeft}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                    />
                                    <motion.div
                                        className="dim-val right"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${data.pctRight}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                    />
                                </div>
                                <div className="dim-pcts">
                                    <span>{data.pctLeft}%</span>
                                    <span>{data.pctRight}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>

                {/* Strengths & Weaknesses */}
                <div className="prof-dual-col">
                    <GlassCard className="prof-section green-glow">
                        <h3><Shield size={20} /> Core Strengths</h3>
                        <ul className="trait-list">
                            {profile.strengths.map(s => <li key={s}>{s}</li>)}
                        </ul>
                    </GlassCard>
                    <GlassCard className="prof-section red-glow">
                        <h3><Heart size={20} /> Blind Spots</h3>
                        <ul className="trait-list">
                            {profile.weaknesses.map(w => <li key={w}>{w}</li>)}
                        </ul>
                    </GlassCard>
                </div>

                {/* Career Matches */}
                <GlassCard className="prof-section full-width">
                    <h3><Briefcase size={20} /> Career Alignments</h3>
                    <div className="career-grid">
                        {profile.careers.map((c, i) => (
                            <div key={i} className="career-card">
                                <div className="match-pill">{c.match}% Match</div>
                                <h4>{c.role}</h4>
                            </div>
                        ))}
                    </div>
                </GlassCard>

                {/* Pop Culture - Movies */}
                <GlassCard className="prof-section">
                    <h3><Film size={20} /> Cinematic Resonance</h3>
                    <div className="media-list">
                        {profile.movies.map((m, i) => (
                            <div key={i} className="media-item">
                                <span className="media-title">{m.title}</span>
                                <span className="media-genre">{m.genre}</span>
                            </div>
                        ))}
                    </div>
                </GlassCard>

                {/* Pop Culture - Characters */}
                <GlassCard className="prof-section">
                    <h3><User size={20} /> Fictional Parallels</h3>
                    <div className="char-list">
                        {profile.characters.map((c, i) => (
                            <div key={i} className="char-item">
                                <span className="char-name">{c.name}</span>
                                <span className="char-source">{c.source}</span>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </div>

            <div className="prof-footer">
                <Link to="/test/personality">
                    <GlassButton variant="outline">Retake Assessment</GlassButton>
                </Link>
            </div>
        </div>
    );
}
