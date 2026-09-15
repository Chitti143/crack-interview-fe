import { Link } from 'react-router-dom';
import { FiMessageCircle, FiThumbsUp, FiEye, FiClock } from 'react-icons/fi';
import CompanyBadge from './CompanyBadge';
import './QuestionCard.css';

function QuestionCard({ question, onClick }) {
    const totalVotes = question.totalVotes || 0;

    const timeAgo = (dateStr) => {
        const days = Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
        return `${Math.floor(days / 30)} months ago`;
    };

    const difficultyConfig = {
        'junior': { label: 'Junior', color: '#22c55e' },
        'mid-level': { label: 'Mid-Level', color: '#f59e0b' },
        'senior': { label: 'Senior', color: '#ef4444' },
    };

    const diff = difficultyConfig[question.difficulty] || difficultyConfig['mid-level'];

    return (
        <div className="question-card" onClick={onClick}>
            <div className="qc-votes">
                <FiThumbsUp className="qc-votes-icon" />
                <span className="qc-votes-count">{totalVotes}</span>
                <span className="qc-votes-label">votes</span>
            </div>

            <div className="qc-content">
                <div className="qc-top-row">
                    <span
                        className="qc-difficulty"
                        style={{
                            '--diff-color': diff.color,
                            '--diff-bg': `${diff.color}15`,
                            '--diff-border': `${diff.color}30`,
                        }}
                    >
                        {diff.label}
                    </span>
                </div>

                <h3 className="qc-title">{question.title}</h3>

                <div className="qc-companies">
                    {question.companies.map((company) => (
                        <CompanyBadge key={company} company={company} />
                    ))}
                </div>

                <div className="qc-stats">
                    <span className="qc-stat">
                        <FiMessageCircle />
                        {question.answerCount || 0} answers
                    </span>
                    <span className="qc-stat">
                        <FiEye />
                        {question.views >= 1000
                            ? `${(question.views / 1000).toFixed(1)}k`
                            : question.views}{' '}
                        views
                    </span>
                    <span className="qc-stat">
                        <FiClock />
                        {timeAgo(question.createdAt)}
                    </span>
                    <Link
                        to={`/profile/${question.postedBy}`}
                        className="qc-stat qc-author"
                        onClick={(e) => e.stopPropagation()}
                    >
                        by @{question.postedBy}
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default QuestionCard;