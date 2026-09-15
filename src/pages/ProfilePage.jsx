import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    FiArrowLeft,
    FiCalendar,
    FiMessageCircle,
    FiHelpCircle,
    FiThumbsUp,
    FiAward,
    FiTrendingUp,
    FiEye,
} from 'react-icons/fi';
import CompanyBadge from '../components/CompanyBadge';
import questions from '../data/questions.json';
import answers from '../data/answers.json';
import technologies from '../data/technologies.json';
import './ProfilePage.css';

function ProfilePage() {
    const { username } = useParams();
    const [activeTab, setActiveTab] = useState('answers');

    // Get user's answers
    const userAnswers = useMemo(
        () =>
            answers
                .filter((a) => a.postedBy === username)
                .sort((a, b) => b.likes - a.likes),
        [username]
    );

    // Get user's questions
    const userQuestions = useMemo(
        () =>
            questions
                .filter((q) => q.postedBy === username)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
        [username]
    );

    // Calculate stats
    const totalLikes = userAnswers.reduce((sum, a) => sum + a.likes, 0);
    const bestAnswers = userAnswers.filter((a) => {
        const questionAnswers = answers
            .filter((ans) => ans.questionId === a.questionId)
            .sort((x, y) => y.likes - x.likes);
        return questionAnswers[0]?.id === a.id;
    });

    // Calculate reputation
    const reputation = totalLikes * 10 + userQuestions.length * 5 + bestAnswers.length * 50;

    // Technologies the user is active in
    const activeTechs = useMemo(() => {
        const techMap = {};
        userAnswers.forEach((a) => {
            const q = questions.find((q) => q.id === a.questionId);
            if (q) {
                techMap[q.techId] = (techMap[q.techId] || 0) + 1;
            }
        });
        userQuestions.forEach((q) => {
            techMap[q.techId] = (techMap[q.techId] || 0) + 1;
        });
        return Object.entries(techMap)
            .sort((a, b) => b[1] - a[1])
            .map(([techId, count]) => ({
                ...technologies.find((t) => t.id === techId),
                count,
            }))
            .filter((t) => t.name);
    }, [userAnswers, userQuestions]);

    // Get question details for an answer
    const getQuestion = (questionId) =>
        questions.find((q) => q.id === questionId);

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

    const hasActivity = userAnswers.length > 0 || userQuestions.length > 0;

    if (!hasActivity) {
        return (
            <main className="profile-page">
                <div className="pp-not-found">
                    <h2>User @{username} not found</h2>
                    <p>No questions or answers found for this user.</p>
                    <Link to="/" className="pp-back-link">
                        ← Back to Home
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="profile-page">
            {/* Breadcrumb */}
            <div className="pp-breadcrumb">
                <Link to="/" className="pp-back-link">
                    <FiArrowLeft /> Home
                </Link>
                <span className="pp-sep">/</span>
                <span className="pp-current">@{username}</span>
            </div>

            {/* Profile Header */}
            <div className="pp-header">
                <div className="pp-avatar">
                    {username.charAt(0).toUpperCase()}
                </div>
                <div className="pp-info">
                    <h1 className="pp-username">@{username}</h1>
                    <p className="pp-bio">
                        <FiCalendar /> Joined January 2025
                    </p>
                </div>
                <div className="pp-reputation">
                    <FiAward className="pp-rep-icon" />
                    <span className="pp-rep-number">{reputation.toLocaleString()}</span>
                    <span className="pp-rep-label">reputation</span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="pp-stats">
                <div className="pp-stat-card">
                    <FiHelpCircle className="pp-stat-icon pp-stat-blue" />
                    <span className="pp-stat-number">{userQuestions.length}</span>
                    <span className="pp-stat-label">Questions</span>
                </div>
                <div className="pp-stat-card">
                    <FiMessageCircle className="pp-stat-icon pp-stat-purple" />
                    <span className="pp-stat-number">{userAnswers.length}</span>
                    <span className="pp-stat-label">Answers</span>
                </div>
                <div className="pp-stat-card">
                    <FiThumbsUp className="pp-stat-icon pp-stat-green" />
                    <span className="pp-stat-number">{totalLikes}</span>
                    <span className="pp-stat-label">Likes Earned</span>
                </div>
                <div className="pp-stat-card">
                    <FiAward className="pp-stat-icon pp-stat-gold" />
                    <span className="pp-stat-number">{bestAnswers.length}</span>
                    <span className="pp-stat-label">Best Answers</span>
                </div>
            </div>

            {/* Active Technologies */}
            {activeTechs.length > 0 && (
                <div className="pp-techs-section">
                    <h2 className="pp-section-title">
                        <FiTrendingUp /> Active Technologies
                    </h2>
                    <div className="pp-techs">
                        {activeTechs.map((tech) => (
                            <Link
                                to={`/tech/${tech.id}`}
                                key={tech.id}
                                className="pp-tech-chip"
                            >
                                <span className="pp-tech-icon">{tech.icon}</span>
                                <span className="pp-tech-name">{tech.name}</span>
                                <span className="pp-tech-count">
                                    {tech.count} contribution{tech.count !== 1 ? 's' : ''}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="pp-tabs">
                <button
                    className={`pp-tab ${activeTab === 'answers' ? 'active' : ''}`}
                    onClick={() => setActiveTab('answers')}
                >
                    💬 Top Answers ({userAnswers.length})
                </button>
                <button
                    className={`pp-tab ${activeTab === 'questions' ? 'active' : ''}`}
                    onClick={() => setActiveTab('questions')}
                >
                    ❓ Questions ({userQuestions.length})
                </button>
            </div>

            {/* Tab Content: Answers */}
            {activeTab === 'answers' && (
                <div className="pp-content">
                    {userAnswers.length > 0 ? (
                        userAnswers.map((answer) => {
                            const question = getQuestion(answer.questionId);
                            const isBest =
                                answers
                                    .filter((a) => a.questionId === answer.questionId)
                                    .sort((a, b) => b.likes - a.likes)[0]?.id === answer.id;

                            return (
                                <Link
                                    to={`/question/${answer.questionId}`}
                                    key={answer.id}
                                    className="pp-answer-item"
                                >
                                    <div className="pp-answer-votes">
                                        <FiThumbsUp />
                                        <span>{answer.likes}</span>
                                    </div>
                                    <div className="pp-answer-content">
                                        <div className="pp-answer-meta">
                                            {isBest && (
                                                <span className="pp-best-badge">
                                                    <FiAward /> Best
                                                </span>
                                            )}
                                            {question && (
                                                <span className="pp-answer-tech">
                                                    {technologies.find((t) => t.id === question.techId)
                                                        ?.icon}{' '}
                                                    {technologies.find((t) => t.id === question.techId)
                                                        ?.name}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="pp-answer-question">
                                            {question?.title || 'Unknown question'}
                                        </h3>
                                        <p className="pp-answer-preview">
                                            {answer.body.length > 150
                                                ? answer.body.slice(0, 150) + '...'
                                                : answer.body}
                                        </p>
                                        <span className="pp-answer-date">
                                            {timeAgo(answer.createdAt)}
                                        </span>
                                    </div>
                                </Link>
                            );
                        })
                    ) : (
                        <div className="pp-empty">No answers yet</div>
                    )}
                </div>
            )}

            {/* Tab Content: Questions */}
            {activeTab === 'questions' && (
                <div className="pp-content">
                    {userQuestions.length > 0 ? (
                        userQuestions.map((question) => {
                            const qAnswers = answers.filter(
                                (a) => a.questionId === question.id
                            );
                            const totalVotes = qAnswers.reduce(
                                (sum, a) => sum + a.likes,
                                0
                            );
                            const tech = technologies.find(
                                (t) => t.id === question.techId
                            );

                            return (
                                <Link
                                    to={`/question/${question.id}`}
                                    key={question.id}
                                    className="pp-question-item"
                                >
                                    <div className="pp-question-stats">
                                        <div className="pp-question-stat">
                                            <FiMessageCircle />
                                            <span>{question.answerCount}</span>
                                        </div>
                                        <div className="pp-question-stat">
                                            <FiThumbsUp />
                                            <span>{totalVotes}</span>
                                        </div>
                                        <div className="pp-question-stat">
                                            <FiEye />
                                            <span>{question.views}</span>
                                        </div>
                                    </div>
                                    <div className="pp-question-content">
                                        <div className="pp-question-meta">
                                            <span className="pp-question-tech">
                                                {tech?.icon} {tech?.name}
                                            </span>
                                        </div>
                                        <h3 className="pp-question-title">{question.title}</h3>
                                        <div className="pp-question-companies">
                                            {question.companies.map((c) => (
                                                <CompanyBadge key={c} company={c} />
                                            ))}
                                        </div>
                                        <span className="pp-question-date">
                                            {timeAgo(question.createdAt)}
                                        </span>
                                    </div>
                                </Link>
                            );
                        })
                    ) : (
                        <div className="pp-empty">No questions yet</div>
                    )}
                </div>
            )}
        </main>
    );
}

export default ProfilePage;