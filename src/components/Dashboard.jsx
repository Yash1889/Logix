import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
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
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }); // Get recent first

    if (data) {
      setScores(data);
      const processed = processProfile(data);
      setStats(processed);
    }
    setLoading(false);
  };

  if (loading) return <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center' }}>LOADING TELEMETRY...</div>;

  const radarData = stats ? [
    { subject: 'MEMORY', A: stats.memory, fullMark: 100 },
    { subject: 'ATTENTION', A: stats.attention, fullMark: 100 },
    { subject: 'SPEED', A: stats.speed, fullMark: 100 },
    { subject: 'FLEXIBILITY', A: stats.flexibility, fullMark: 100 },
    { subject: 'REASONING', A: stats.reasoning, fullMark: 100 },
    { subject: 'EQ/SOCIAL', A: stats.eq, fullMark: 100 },
  ] : [];

  const personalityScore = scores.find(s => s.game_id === 'personality-test');

  return (
    <div className="dashboard-container">
      <header className="dash-header">
        <h1>OPERATOR PROFILE</h1>
        <div className="subject-id">SUBJECT_ID: {user?.id?.split('-')[0].toUpperCase()} // {profile?.email || user?.email}</div>
      </header>

      <div className="dash-grid">
        {/* PERSONALITY HERO */}
        {personalityScore && (
          <div className="panel-base dash-personality-hero">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-primary)', letterSpacing: '0.1em' }}>ARCHETYPE DETECTED</span>
                <h2 style={{ fontSize: '3rem', margin: '4px 0 0 0', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  {personalityScore.meta?.type}
                </h2>
              </div>
              <div style={{ maxWidth: '600px', color: 'var(--text-secondary)', fontSize: '1rem', borderLeft: '1px solid var(--border-subtle)', paddingLeft: '24px' }}>
                {personalityScore.meta?.description}
              </div>
              <button onClick={() => window.location.href = '/personality-profile'}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--accent-primary)',
                  color: 'var(--accent-primary)',
                  padding: '12px 24px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase'
                }}>
                View Full Analysis
              </button>
            </div>
          </div>
        )}

        {/* COGNITIVE MAP CHART */}
        <div className="panel-base dash-main-chart">
          <div className="panel-header">
            <span className="panel-title">COGNITIVE_MAP_VISUALIZATION</span>
          </div>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="var(--border-subtle)" strokeDasharray="3 3" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: 'var(--text-tertiary)', fontSize: 11, fontFamily: 'var(--font-mono)' }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Subject"
                  dataKey="A"
                  stroke="var(--accent-primary)"
                  strokeWidth={2}
                  fill="var(--accent-primary)"
                  fillOpacity={0.15}
                  isAnimationActive={true}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p style={{ marginTop: '20px', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
            <span style={{ color: 'var(--accent-primary)' }}>{'>'}</span> {generateInsights(stats)}
          </p>
        </div>

        {/* STATS STACK */}
        <div className="dash-stats-stack">
          {[
            { label: 'MEMORY_INDEX', val: stats?.memory },
            { label: 'SPEED_INDEX', val: stats?.speed },
            { label: 'LOGIC_INDEX', val: stats?.reasoning },
            { label: 'AWARENESS_INDEX', val: stats?.eq }
          ].map((stat, i) => (
            <div key={i} className="stat-panel">
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value">{stat.val || 0}</span>
            </div>
          ))}
        </div>

        {/* RECENT DATA STREAM */}
        <div className="panel-base dash-history">
          <div className="panel-header">
            <span className="panel-title">TELEMETRY_LOG // RECENT_ACTIVITY</span>
          </div>
          <div className="history-list">
            {scores.slice(0, 10).map((s, i) => (
              <div key={i} className="history-item">
                <span className="game-name">{s.game_id?.replace(/-/g, '_').toUpperCase()}</span>
                <span className="game-score">{s.score}</span>
                <span className="game-date">{new Date(s.created_at).toLocaleDateString()}</span>
              </div>
            ))}
            {scores.length === 0 && <div style={{ padding: '24px', color: 'var(--text-muted)' }}>NO TELEMETRY DATA FOUND. INITIATE TESTS.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
