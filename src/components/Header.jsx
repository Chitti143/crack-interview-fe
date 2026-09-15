import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiUser, FiZap, FiLogOut } from 'react-icons/fi';
import { useUser } from '../context/UserContext';
import ThemeToggle from './ThemeToggle';
import './Header.css';

function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const { username, logout } = useUser();

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="logo">
                    <FiZap className="logo-icon" />
                    <span className="logo-text">
                        Crack<span className="logo-highlight">Interview</span>
                    </span>
                </Link>

                <div className="search-bar">
                    <FiSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search questions, topics, companies..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="header-actions">
                    <ThemeToggle />
                    <Link to="/ask" className="btn-ask">+ Ask Question</Link>
                    {username && (
                        <>
                            <Link to={`/profile/${username}`} className="user-badge">
                                <FiUser />
                                <span>@{username}</span>
                            </Link>
                            <button className="btn-logout" onClick={logout} title="Change user">
                                <FiLogOut />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;