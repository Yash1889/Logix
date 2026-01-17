import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Brain, Zap, Target, Smile, Cloud } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [radialData, setRadialData] = useState([]);

  useEffect(() => {
    if (user) {
      fetchScores();
    }
  }, [user]);

  const fetchScores = async () => {
    try {
      const { data, error } = await supabase
        .from('game_scores')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setScores(data);
      calculateProfile(data);
    } catch (err) {
      console.error("Error fetching scores:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateProfile = (scoreData) => {
    // Mock calculation for MVP
    // We would ideally normalize these scores against a baseline

    const cats = {
      'Speed': ['reaction', 'aim', 'stroop', 'typing'],
      'Memory': ['sequence-memory', 'number-memory', 'visual-memory', 'chimpanzee', 'verbal-memory'],
      'Attention': ['sustained-attention', 'go-no-go', 'n-back'],
      'Reasoning': ['pattern-recognition', 'logic-test', 'mental-math'],
      'EQ': ['emotion-recognition', 'delay-gratification']
    };

    const data = Object.keys(cats).map(catKey => {
      const games = cats[catKey];
      // Find if user has played any of these
      let playedCount = 0;
      let dummyScoreSum = 0;

      games.forEach(gId => {
        const gameScores = scoreData.filter(s => s.game_id === gId);
        if (gameScores.length > 0) {
          playedCount++;
          // Mock normalization: 
          // In real app we compare to global average.
          // Here we just return random 50-90 range if played, else 0?
          // Or better: use rank if we had it.
          // For now: Just static mock value PER CATEGORY to show chart works
          // UNLESS we implement real normalization logic which is complex without massive DB.
          // Let's output a mock value "60 + level" or something.

          dummyScoreSum += 70; // Baseline
        }
      });

      const val = playedCount > 0 ? (dummyScoreSum / playedCount) : 20; // 20 baseline for empty
      return { subject: catKey, A: val, fullMark: 100 };
    });

    setRadialData(data);
  };

  return (
    <div className="dash-container">
      <div className="dash-header">
        <h1>Welcome, {profile?.email?.split('@')[0] || 'User'}</h1>
        <p>Your Human Benchmark Profile</p>
      </div>

      <div className="dash-grid">
        {/* Profile Chart */}
        <div className="dash-card profile-chart">
          <h3>Cognitive Profile</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radialData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="My Stats"
                  dataKey="A"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dash-card recent-activity">
          <h3>Recent Scores</h3>
          <div className="activity-list">
            {loading ? (
              <p>Loading...</p>
            ) : scores.length === 0 ? (
              <p>No games played yet.</p>
            ) : (
              scores.slice(0, 10).map(s => (
                <div key={s.id} className="activity-item">
                  <span className="game-name">{formatGameName(s.game_id)}</span>
                  <span className="game-score">{s.score}</span>
                  <span className="game-date">{new Date(s.created_at).toLocaleDateString()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatGameName(id) {
  return id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}
