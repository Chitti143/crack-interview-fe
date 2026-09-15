import { FiArrowRight } from 'react-icons/fi';
import './TechCard.css';

function TechCard({ tech }) {
    return (
        <a href={`/tech/${tech.id}`} className="tech-card">
            <div className="tech-card-glow" style={{ background: tech.color }} />
            <div className="tech-card-icon">{tech.icon}</div>
            <h3 className="tech-card-name">{tech.name}</h3>
            <p className="tech-card-count">{tech.questionCount} questions</p>
            <div className="tech-card-footer">
                <span>Practice now</span>
                <FiArrowRight />
            </div>
        </a>
    );
}

export default TechCard;