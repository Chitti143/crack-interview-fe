import { FiGithub, FiHeart, FiZap } from 'react-icons/fi';
import './Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-brand">
                    <FiZap className="footer-logo-icon" />
                    <span>CrackInterview</span>
                </div>
                <p className="footer-tagline">
                    Made with <FiHeart className="heart-icon" /> for developers preparing for interviews
                </p>
                <div className="footer-links">
                    <a href="#">About</a>
                    <a href="#">Contribute</a>
                    <a href="#">Contact</a>
                    <a href="#" className="github-link">
                        <FiGithub /> GitHub
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;