import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    FiArrowLeft, FiCalendar, FiMessageCircle, FiHelpCircle,
    FiThumbsUp, FiAward, FiTrendingUp, FiEye,
} from 'react-icons/fi';
import CompanyBadge from '../components/CompanyBadge';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import { getUserProfile, getTechnologies } from '../services/api';
import './ProfilePage.css';

function ProfilePage() {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [technologies, setTechnologies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('answers');

    const fetchData = () => {
        setLoading(true);
        setError(null);
        Promise.all([getUserProfile(username), getTechnologies()])
            .then(([profileData, techs]) => {
                setProfile(profileData);
                setTechnologies(techs);
                setLoading(false);
            })
            .catch(() => {
                setError('User not found');
                setLoading(false);
            });
    };

    useEffect(() => { fetchData(); }, [username]);

    const timeAgo = (dateStr) => {
        const days = Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
        return `${Math.floor(days / 30)} months ago`;
    };

    if (loading) return <main className="profile-page"><Loader text="Loading profile..." /></main>;
    if (error) return <main className="profile-page"><ErrorMessage message={error} onRetry={fetchData} /></main>;
    if (!profile) return null;

    const { stats, topAnswers, recentQuestions } = profile;

    return (
        <main className="profile-page">
            <div className="pp-breadcrumb">
                <Link to="/" className="pp-back-link"><FiArrowLeft /> Home</Link>
                <span className="pp-sep">/</span>
                <span className="pp-current">@{username}</span>
            </div>

            <div className="pp-header">
                <div className="pp-avatar">{username.charAt(0).toUpperCase()}</div>
                <div className="pp-info">
                    <h1 className="pp-username">@{username}</h1>
                    <p className="pp-bio"><FiCalendar /> Joined January 2025</p>
                </div>
                <div className="pp-reputation">
                    <FiAward className="pp-rep-icon" />
                    <span className="pp-rep-number">{stats.reputation.toLocaleString()}</span>
                    <span className="pp-rep-label">reputation</span>
                </div>
            </div>

            <div className="pp-stats">
                <div className="pp-stat-card">
                    <FiHelpCircle className="pp-stat-icon pp-stat-blue" />
                    <span className="pp-stat-number">{stats.questions}</span>
                    <span className="pp-stat-label">Questions</span>
                </div>
                <div className="pp-stat-card">
                    <FiMessageCircle className="pp-stat-icon pp-stat-purple" />
                    <span className="pp-stat-number">{stats.answers}</span>
                    <span className="pp-stat-label">Answers</span>
                </div>
                <div className="pp-stat-card">
                    <FiThumbsUp className="pp-stat-icon pp-stat-green" />
                    <span className="pp-stat-number">{stats.totalLikes}</span>
                    <span className="pp-stat-label">Likes Earned</span>
                </div>
                <div className="pp-stat-card">
                    <FiAward className="pp-stat-icon pp-stat-gold" />
                    <span className="pp-stat-number">{stats.bestAnswers}</span>
                    <span className="pp-stat-label">Best Answers</span>
                </div>
            </div>

            <div className="pp-tabs">
                <button className={`pp-tab ${activeTab === 'answers' ? 'active' : ''}`}
                    onClick={() => setActiveTab('answers')}>💬 Top Answers ({topAnswers.length})</button>
                <button className={`pp-tab ${activeTab === 'questions' ? 'active' : ''}`}
                    onClick={() => setActiveTab('questions')}>❓ Questions ({recentQuestions.length})</button>
            </div>

            {activeTab === 'answers' && (
                <div className="pp-content">
                    {topAnswers.length > 0 ? topAnswers.map((answer) => (
                        <Link to={`/question/${answer.questionId}`} key={answer.id} className="pp-answer-item">
                            <div className="pp-answer-votes"><FiThumbsUp /><span>{answer.likes}</span></div>
                            <div className="pp-answer-content">
                                <p className="pp-answer-preview">
                                    {answer.body.length > 150 ? answer.body.slice(0, 150) + '...' : answer.body}
                                </p>
                                <span className="pp-answer-date">{timeAgo(answer.createdAt)}</span>
                            </div>
                        </Link>
                    )) : <div className="pp-empty">No answers yet</div>}
                </div>
            )}

            {activeTab === 'questions' && (
                <div className="pp-content">
                    {recentQuestions.length > 0 ? recentQuestions.map((question) => (
                        <Link to={`/question/${question.id}`} key={question.id} className="pp-question-item">
                            <div className="pp-question-content">
                                <h3 className="pp-question-title">{question.title}</h3>
                                <div className="pp-question-companies">
                                    {question.companies.map((c) => <CompanyBadge key={c} company={c} />)}
                                </div>
                                <span className="pp-question-date">{timeAgo(question.createdAt)}</span>
                            </div>
                        </Link>
                    )) : <div className="pp-empty">No questions yet</div>}
                </div>
            )}
        </main>
    );
}

export default ProfilePage;