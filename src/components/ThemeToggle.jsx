import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            className="theme-toggle"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            <div className={`toggle-track ${theme}`}>
                <FiSun className="toggle-icon sun" />
                <FiMoon className="toggle-icon moon" />
                <div className="toggle-thumb" />
            </div>
        </button>
    );
}

export default ThemeToggle;