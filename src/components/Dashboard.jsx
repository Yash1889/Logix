import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import GlassCard from './ui/GlassCard';
import GlassButton from './ui/GlassButton';
import { processProfile, generateInsights } from '../utils/analytics';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';
import './Dashboard.css';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [scores, setScores] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchScores();
    }
  }, [user]);

  const fetchScores = async () => {
    const { data, error } = await supabase
      .from('game_scores')
      .select('*')
      .eq('user_id', user.id);

    if (data) {
      setScores(data);
      const processed = processProfile(data);
      setStats(processed);
    }
    setLoading(false);
  };

  if (loading) return <div className="dash-loading">Analysis in progress...</div>;

  const radarData = stats ? [
    { subject: 'Memory', A: stats.memory, fullMark: 100 },
    { subject: 'Attention', A: stats.attention, fullMark: 100 },
    { subject: 'Speed', A: stats.speed, fullMark: 100 },
    { subject: 'Flexibility', A: stats.flexibility, fullMark: 100 },
    { subject: 'Reasoning', A: stats.reasoning, fullMark: 100 },
    { subject: 'EQ & Social', A: stats.eq, fullMark: 100 },
  ] : [];

  return (
    <div className="dashboard-container">
      <header className="dash-header">
        <h1>Cognitive Profile</h1>
        <p>Subject: {profile?.email || user?.email}</p>
      </header>

      <div className="dash-grid">
        {scores.find(s => s.game_id === 'personality-test') && (
          <GlassCard className="dash-personality-hero" style={{ gridColumn: '1 / -1', marginBottom: '20px', background: 'linear-gradient(135deg, rgba(6,182,212,0.1), rgba(139,92,246,0.1))', borderColor: 'var(--accent-primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <h2 style={{ fontSize: '3rem', margin: 0, color: '#fff', letterSpacing: '4px' }}>
                  {scores.find(s => s.game_id === 'personality-test').meta?.type}
                </h2>
                <span style={{ color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>
                  Cognitive Archetype
                </span>
              </div>
              <div style={{ maxWidth: '600px', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                {scores.find(s => s.game_id === 'personality-test').meta?.description}
              </div>
              <GlassButton onClick={() => window.location.href = '/test/personality'} size="small" variant="outline">
                View Full Analysis
              </GlassButton>
            </div>
          </GlassCard>
        )}

        <GlassCard className="dash-main-chart">
          <h2>Cognitive Map</h2>
          <p style={{ color: 'var(--accent-primary)', marginBottom: '10px' }}>{generateInsights(stats)}</p>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#475569" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="You"
                  dataKey="A"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fill="#3b82f6"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <div className="dash-stats-grid">
          <GlassCard>
            <h3>Memory</h3>
            <div className="stat-val text-blue">{stats?.memory || 0}</div>
          </GlassCard>
          <GlassCard>
            <h3>Speed</h3>
            <div className="stat-val text-red">{stats?.speed || 0}</div>
          </GlassCard>
          <GlassCard>
            <h3>Logic</h3>
            <div className="stat-val text-purple">{stats?.reasoning || 0}</div>
          </GlassCard>
          <GlassCard>
            <h3>Awareness</h3>
            <div className="stat-val text-pink">{stats?.eq || 0}</div>
          </GlassCard>
        </div>
      </div>

      <GlassCard className="dash-history">
        <h2>Recent Activity</h2>
        <div className="history-list">
          {scores.slice(0, 5).map((s, i) => (
            <div key={i} className="history-item">
              <span>{s.game_id}</span>
              <span>{s.score}</span>
              <span className="date">{new Date(s.created_at).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
