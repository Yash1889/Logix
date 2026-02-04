import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Activity, Terminal, LogOut, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import './Navbar.css';

export default function Navbar() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Theme State
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
    const [time, setTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: false }));

    // Initialize Theme
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Clock
    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <Activity className="brand-icon" />
                    <span>LOGIX // SYS.01</span>
                </Link>

                <div className="system-status">
                    <div className="status-item">
                        <button onClick={toggleTheme} className="theme-toggle-btn" title="Toggle Light/Dark Mode">
                            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                            <span>{theme === 'dark' ? 'LIGHT_MODE' : 'DARK_MODE'}</span>
                        </button>
                    </div>
                    <div className="status-item">
                        <span className="status-dot"></span>
                        <span>NET: ONLINE</span>
                    </div>
                    <div className="status-item">
                        <span>{time}</span>
                    </div>
                </div>

                <div className="navbar-actions">
                    {user ? (
                        <>
                            <Link to="/dashboard" className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                                <Terminal size={16} />
                                <span>CMD_CENTER</span>
                            </Link>
                            <button onClick={handleLogout} className="nav-item">
                                <LogOut size={16} />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-item">LOGIN</Link>
                            <Link to="/signup" className="nav-item">INIT_ACCESS</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
