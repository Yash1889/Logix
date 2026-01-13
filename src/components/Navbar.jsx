import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

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
                <Link to="/" className="navbar-logo">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="navbar-icon"
                    >
                        <path d="M12 2v20M2 12h20" />
                        <path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10-10" />
                    </svg>
                    Human Benchmark
                </Link>
                <div className="navbar-actions">
                    {user ? (
                        <div className="navbar-user">
                            <Link to="/dashboard" className="navbar-profile-link">
                                <User size={20} />
                                <span>Profile</span>
                            </Link>
                            <button onClick={handleLogout} className="navbar-button secondary">
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <div className="navbar-auth">
                            <Link to="/login" className="navbar-button secondary">
                                Login
                            </Link>
                            <Link to="/signup" className="navbar-button primary">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
