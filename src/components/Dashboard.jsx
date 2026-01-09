import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Dashboard.css'

export default function Dashboard() {
  const { user, session, profile, signOut, loading } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-card">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    navigate('/login')
    return null
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>

        <div className="dashboard-content">
          <div className="info-section">
            <h2>User Information</h2>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{user.email || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Supabase UID:</span>
              <span className="info-value uid">{user.id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Login Status:</span>
              <span className="info-value status-active">Logged In</span>
            </div>
          </div>

          {profile && (
            <div className="info-section">
              <h2>Profile Information</h2>
              <div className="info-item">
                <span className="info-label">Profile Created:</span>
                <span className="info-value">
                  {new Date(profile.created_at).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {session && (
            <div className="info-section">
              <h2>Session Details</h2>
              <div className="info-item">
                <span className="info-label">Access Token:</span>
                <span className="info-value token">
                  {session.access_token.substring(0, 20)}...
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Expires At:</span>
                <span className="info-value">
                  {new Date(session.expires_at * 1000).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

