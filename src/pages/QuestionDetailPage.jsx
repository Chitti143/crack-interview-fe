import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    FiArrowLeft, FiEye, FiClock, FiMessageCircle, FiThumbsUp,
} from 'react-icons/fi';
import CompanyBadge from '../components/CompanyBadge';
import AnswerCard from '../components/AnswerCard';
import AnswerForm from '../components/AnswerForm';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import { getQuestionById, getTechnologies, submitAnswer } from '../services/api';
import './QuestionDetailPage.css';

function QuestionDetailPage() {
    const { questionId } = useParams();
    const [question, setQuestion] = useState(null);
    const [tech, setTech] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('likes');

    const fetchData = () => {
        setLoading(true);
        setError(null);
        Promise.all([
            getQuestionById(questionId),
            getTechnologies()
        ])
            .then(([qData, techs]) => {
                setQuestion(qData);
                setTech(techs.find(t => t.id === qData.techId) || null);
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load question');
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, [questionId]);

    const handleNewAnswer = async (newAnswer) => {
        const saved = await submitAnswer(questionId, newAnswer.body, newAnswer.postedBy);
        setQuestion(prev => ({
            ...prev,
            answers: [...(prev.answers || []), saved],
            answerCount: (prev.answerCount || 0) + 1
        }));
    };

    const timeAgo = (dateStr) => {
        const days = Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
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

    if (loading) return <main className="detail-page"><Loader text="Loading question..." /></main>;
    if (error) return <main className="detail-page"><ErrorMessage message={error} onRetry={fetchData} /></main>;

    if (!question) {
        return (
            <main className="detail-page">
                <div className="dp-not-found">
                    <h2>Question not found</h2>
                    <Link to="/" className="dp-back-link">← Back to Home</Link>
                </div>
            </main>
        );
    }

    const diff = difficultyConfig[question.difficulty] || difficultyConfig['mid-level'];
    const answers = question.answers || [];
    const sortedAnswers = [...answers].sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
        return b.likes - a.likes;
    });

    return (
        <main className="detail-page">
            <div className="dp-breadcrumb">
                <Link to="/" className="dp-back-link"><FiArrowLeft /> Home</Link>
                <span className="dp-sep">/</span>
                <Link to={`/tech/${question.techId}`} className="dp-back-link">
                    {tech?.icon} {tech?.name}
                </Link>
                <span className="dp-sep">/</span>
                <span className="dp-current">Question</span>
            </div>

            <div className="dp-question">
                <div className="dp-q-header">
                    <span className="dp-difficulty" style={{
                        '--diff-color': diff.color,
                        '--diff-bg': `${diff.color}15`,
                        '--diff-border': `${diff.color}30`,
                    }}>{diff.label}</span>
                </div>

                <h1 className="dp-q-title">{question.title}</h1>
                {question.description && <p className="dp-q-description">{question.description}</p>}

                <div className="dp-companies">
                    <span className="dp-companies-label">Asked at:</span>
                    <div className="dp-companies-list">
                        {question.companies.map((c) => <CompanyBadge key={c} company={c} />)}
                    </div>
                </div>

                <div className="dp-q-stats">
                    <span className="dp-q-stat"><FiMessageCircle /> {sortedAnswers.length} answers</span>
                    <span className="dp-q-stat"><FiThumbsUp /> {question.totalVotes || 0} votes</span>
                    <span className="dp-q-stat">
                        <FiEye /> {question.views >= 1000 ? `${(question.views / 1000).toFixed(1)}k` : question.views} views
                    </span>
                    <span className="dp-q-stat"><FiClock /> {timeAgo(question.createdAt)}</span>
                    <span className="dp-q-stat dp-q-author">Asked by @{question.postedBy}</span>
                </div>
            </div>

            <div className="dp-answers-section">
                <div className="dp-answers-header">
                    <h2 className="dp-answers-title">{sortedAnswers.length} Answer{sortedAnswers.length !== 1 ? 's' : ''}</h2>
                    <div className="dp-sort-tabs">
                        {[
                            { key: 'likes', label: '👍 Most Liked' },
                            { key: 'newest', label: '🆕 Newest' },
                            { key: 'oldest', label: '📅 Oldest' },
                        ].map((tab) => (
                            <button key={tab.key} className={`dp-sort-tab ${sortBy === tab.key ? 'active' : ''}`}
                                onClick={() => setSortBy(tab.key)}>{tab.label}</button>
                        ))}
                    </div>
                </div>

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

            <AnswerForm questionId={questionId} onSubmit={handleNewAnswer} />
        </main>
    );
}

export default QuestionDetailPage;