import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiFilter, FiPlus } from 'react-icons/fi';
import QuestionCard from '../components/QuestionCard';
import technologies from '../data/technologies.json';
import questions from '../data/questions.json';
import answers from '../data/answers.json';
import './QuestionsPage.css';

function QuestionsPage() {
    const { techId } = useParams();
    const navigate = useNavigate();
    const [sortBy, setSortBy] = useState('votes');
    const [diffFilter, setDiffFilter] = useState('all');

    const tech = technologies.find((t) => t.id === techId);

    const filteredQuestions = useMemo(() => {
        let qs = questions.filter((q) => q.techId === techId);

        // Filter by difficulty
        if (diffFilter !== 'all') {
            qs = qs.filter((q) => q.difficulty === diffFilter);
        }

        // Sort
        if (sortBy === 'votes') {
            qs = [...qs].sort((a, b) => {
                const aVotes = answers
                    .filter((ans) => ans.questionId === a.id)
                    .reduce((sum, ans) => sum + ans.likes, 0);
                const bVotes = answers
                    .filter((ans) => ans.questionId === b.id)
                    .reduce((sum, ans) => sum + ans.likes, 0);
                return bVotes - aVotes;
            });
        } else if (sortBy === 'newest') {
            qs = [...qs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortBy === 'views') {
            qs = [...qs].sort((a, b) => b.views - a.views);
        } else if (sortBy === 'unanswered') {
            qs = qs.filter((q) => q.answerCount === 0);
        }

        return qs;
    }, [techId, sortBy, diffFilter]);

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

    const totalAnswers = filteredQuestions.reduce((sum, q) => sum + q.answerCount, 0);

    return (
        <main className="questions-page">
            {/* Breadcrumb + Back */}
            <div className="qp-breadcrumb">
                <Link to="/" className="qp-back-link">
                    <FiArrowLeft /> Home
                </Link>
                <span className="qp-breadcrumb-sep">/</span>
                <span className="qp-breadcrumb-current">{tech.name}</span>
            </div>

            {/* Page Header */}
            <div className="qp-header">
                <div className="qp-header-left">
                    <div className="qp-tech-icon">{tech.icon}</div>
                    <div>
                        <h1 className="qp-title">{tech.name} Interview Questions</h1>
                        <p className="qp-subtitle">
                            {filteredQuestions.length} questions • {totalAnswers} answers
                        </p>
                    </div>
                </div>
                <button className="qp-ask-btn">
                    <FiPlus /> Ask a Question
                </button>
            </div>

            {/* Filters Bar */}
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

            {/* Questions List */}
            <div className="qp-list">
                {filteredQuestions.length > 0 ? (
                    filteredQuestions.map((q) => (
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