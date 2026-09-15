import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    FiArrowLeft,
    FiEye,
    FiClock,
    FiMessageCircle,
    FiThumbsUp,
} from 'react-icons/fi';
import CompanyBadge from '../components/CompanyBadge';
import AnswerCard from '../components/AnswerCard';
import AnswerForm from '../components/AnswerForm';
import technologies from '../data/technologies.json';
import questions from '../data/questions.json';
import answersData from '../data/answers.json';
import './QuestionDetailPage.css';

function QuestionDetailPage() {
    const { questionId } = useParams();
    const [answers, setAnswers] = useState(answersData);
    const [sortBy, setSortBy] = useState('likes');

    const question = questions.find((q) => q.id === questionId);
    const tech = question
        ? technologies.find((t) => t.id === question.techId)
        : null;

    const sortedAnswers = useMemo(() => {
        const filtered = answers.filter((a) => a.questionId === questionId);

        if (sortBy === 'likes') {
            return [...filtered].sort((a, b) => b.likes - a.likes);
        } else if (sortBy === 'newest') {
            return [...filtered].sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
        } else if (sortBy === 'oldest') {
            return [...filtered].sort(
                (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            );
        }
        return filtered;
    }, [answers, questionId, sortBy]);

    const totalVotes = sortedAnswers.reduce((sum, a) => sum + a.likes, 0);

    const handleNewAnswer = (newAnswer) => {
        setAnswers([...answers, newAnswer]);
    };

    const timeAgo = (dateStr) => {
        const days = Math.floor(
            (new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24)
        );
        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
        return `${Math.floor(days / 30)} months ago`;
    };

    const difficultyConfig = {
        junior: { label: 'Junior', color: '#22c55e' },
        'mid-level': { label: 'Mid-Level', color: '#f59e0b' },
        senior: { label: 'Senior', color: '#ef4444' },
    };

    if (!question) {
        return (
            <main className="detail-page">
                <div className="dp-not-found">
                    <h2>Question not found</h2>
                    <Link to="/" className="dp-back-link">
                        ← Back to Home
                    </Link>
                </div>
            </main>
        );
    }

    const diff =
        difficultyConfig[question.difficulty] || difficultyConfig['mid-level'];

    return (
        <main className="detail-page">
            {/* Breadcrumb */}
            <div className="dp-breadcrumb">
                <Link to="/" className="dp-back-link">
                    <FiArrowLeft /> Home
                </Link>
                <span className="dp-sep">/</span>
                <Link to={`/tech/${question.techId}`} className="dp-back-link">
                    {tech?.icon} {tech?.name}
                </Link>
                <span className="dp-sep">/</span>
                <span className="dp-current">Question</span>
            </div>

            {/* Question Card */}
            <div className="dp-question">
                <div className="dp-q-header">
                    <span
                        className="dp-difficulty"
                        style={{
                            '--diff-color': diff.color,
                            '--diff-bg': `${diff.color}15`,
                            '--diff-border': `${diff.color}30`,
                        }}
                    >
                        {diff.label}
                    </span>
                </div>

                <h1 className="dp-q-title">{question.title}</h1>

                {question.description && (
                    <p className="dp-q-description">{question.description}</p>
                )}

                {/* Company Badges */}
                <div className="dp-companies">
                    <span className="dp-companies-label">Asked at:</span>
                    <div className="dp-companies-list">
                        {question.companies.map((company) => (
                            <CompanyBadge key={company} company={company} />
                        ))}
                    </div>
                </div>

                {/* Question Stats */}
                <div className="dp-q-stats">
                    <span className="dp-q-stat">
                        <FiMessageCircle /> {sortedAnswers.length} answers
                    </span>
                    <span className="dp-q-stat">
                        <FiThumbsUp /> {totalVotes} votes
                    </span>
                    <span className="dp-q-stat">
                        <FiEye />{' '}
                        {question.views >= 1000
                            ? `${(question.views / 1000).toFixed(1)}k`
                            : question.views}{' '}
                        views
                    </span>
                    <span className="dp-q-stat">
                        <FiClock /> {timeAgo(question.createdAt)}
                    </span>
                    <span className="dp-q-stat dp-q-author">
                        Asked by @{question.postedBy}
                    </span>
                </div>
            </div>

            {/* Answers Section */}
            <div className="dp-answers-section">
                <div className="dp-answers-header">
                    <h2 className="dp-answers-title">
                        {sortedAnswers.length} Answer{sortedAnswers.length !== 1 ? 's' : ''}
                    </h2>
                    <div className="dp-sort-tabs">
                        {[
                            { key: 'likes', label: '👍 Most Liked' },
                            { key: 'newest', label: '🆕 Newest' },
                            { key: 'oldest', label: '📅 Oldest' },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                className={`dp-sort-tab ${sortBy === tab.key ? 'active' : ''}`}
                                onClick={() => setSortBy(tab.key)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Answer Cards */}
                <div className="dp-answers-list">
                    {sortedAnswers.map((answer, index) => (
                        <AnswerCard key={answer.id} answer={answer} rank={index + 1} />
                    ))}
                </div>

                {sortedAnswers.length === 0 && (
                    <div className="dp-no-answers">
                        <span className="dp-no-answers-icon">🤔</span>
                        <h3>No answers yet</h3>
                        <p>Be the first to answer this question!</p>
                    </div>
                )}
            </div>

            {/* Answer Form */}
            <AnswerForm questionId={questionId} onSubmit={handleNewAnswer} />
        </main>
    );
}

export default QuestionDetailPage;