import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiFilter, FiPlus } from 'react-icons/fi';
import QuestionCard from '../components/QuestionCard';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import { getTechnologies, getQuestionsByTech } from '../services/api';
import './QuestionsPage.css';

function QuestionsPage() {
    const { techId } = useParams();
    const navigate = useNavigate();
    const [tech, setTech] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('votes');
    const [diffFilter, setDiffFilter] = useState('all');

    const fetchData = () => {
        setLoading(true);
        setError(null);
        Promise.all([
            getTechnologies(),
            getQuestionsByTech(techId, sortBy, diffFilter)
        ])
            .then(([techs, result]) => {
                setTech(techs.find(t => t.id === techId) || null);
                setQuestions(result.data || []);
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load questions');
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, [techId, sortBy, diffFilter]);

    const totalAnswers = questions.reduce((sum, q) => sum + (q.answerCount || 0), 0);

    if (loading) return <main className="questions-page"><Loader text="Loading questions..." /></main>;
    if (error) return <main className="questions-page"><ErrorMessage message={error} onRetry={fetchData} /></main>;

    if (!tech) {
        return (
            <main className="questions-page">
                <div className="qp-not-found">
                    <h2>Technology not found</h2>
                    <Link to="/" className="qp-back-link">← Back to Home</Link>
                </div>
            </main>
        );
    }

    return (
        <main className="questions-page">
            <div className="qp-breadcrumb">
                <Link to="/" className="qp-back-link">
                    <FiArrowLeft /> Home
                </Link>
                <span className="qp-breadcrumb-sep">/</span>
                <span className="qp-breadcrumb-current">{tech.name}</span>
            </div>

            <div className="qp-header">
                <div className="qp-header-left">
                    <div className="qp-tech-icon">{tech.icon}</div>
                    <div>
                        <h1 className="qp-title">{tech.name} Interview Questions</h1>
                        <p className="qp-subtitle">
                            {questions.length} questions • {totalAnswers} answers
                        </p>
                    </div>
                </div>
                <Link to="/ask" className="qp-ask-btn">
                    <FiPlus /> Ask a Question
                </Link>
            </div>

            <div className="qp-filters">
                <div className="qp-sort-tabs">
                    {[
                        { key: 'votes', label: '👍 Most Voted' },
                        { key: 'newest', label: '🆕 Newest' },
                        { key: 'views', label: '👁️ Most Viewed' },
                        { key: 'unanswered', label: '❓ Unanswered' },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            className={`qp-sort-tab ${sortBy === tab.key ? 'active' : ''}`}
                            onClick={() => setSortBy(tab.key)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="qp-diff-filter">
                    <FiFilter className="qp-filter-icon" />
                    {[
                        { key: 'all', label: 'All Levels' },
                        { key: 'junior', label: 'Junior' },
                        { key: 'mid-level', label: 'Mid-Level' },
                        { key: 'senior', label: 'Senior' },
                    ].map((d) => (
                        <button
                            key={d.key}
                            className={`qp-diff-tab ${diffFilter === d.key ? 'active' : ''}`}
                            onClick={() => setDiffFilter(d.key)}
                        >
                            {d.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="qp-list">
                {questions.length > 0 ? (
                    questions.map((q) => (
                        <QuestionCard
                            key={q.id}
                            question={q}
                            onClick={() => navigate(`/question/${q.id}`)}
                        />
                    ))
                ) : (
                    <div className="qp-empty">
                        <span className="qp-empty-icon">🔍</span>
                        <h3>No questions found</h3>
                        <p>Try changing your filters or be the first to ask!</p>
                    </div>
                )}
            </div>
        </main>
    );
}

export default QuestionsPage;