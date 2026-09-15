import { useState, useEffect } from 'react';
import TechCard from '../components/TechCard';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import { getTechnologies } from '../services/api';
import './HomePage.css';

function HomePage() {
    const [technologies, setTechnologies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');

    const fetchTechnologies = () => {
        setLoading(true);
        setError(null);
        getTechnologies()
            .then((data) => {
                setTechnologies(data);
                setLoading(false);
            })
            .catch((err) => {
                setError('Failed to load technologies. Is the backend running?');
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchTechnologies();
    }, []);

    const totalQuestions = technologies.reduce((sum, t) => sum + t.questionCount, 0);

    const filteredTechs = technologies.filter((t) => {
        if (filter === 'popular') return t.questionCount >= 20;
        if (filter === 'trending') return t.questionCount >= 5 && t.questionCount < 20;
        return true;
    });

    return (
        <main className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-badge">🔥 Community-driven interview prep</div>
                <h1 className="hero-title">
                    Crack Your Next
                    <span className="hero-highlight"> Interview</span>
                </h1>
                <p className="hero-subtitle">
                    Browse <strong>{totalQuestions}+</strong> real interview questions across{' '}
                    <strong>{technologies.length}</strong> technologies.
                    Learn from the best community-voted answers.
                </p>

                {!loading && !error && (
                    <div className="hero-stats">
                        <div className="stat">
                            <span className="stat-number">{totalQuestions}+</span>
                            <span className="stat-label">Questions</span>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat">
                            <span className="stat-number">{technologies.length}</span>
                            <span className="stat-label">Technologies</span>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat">
                            <span className="stat-number">27+</span>
                            <span className="stat-label">Companies</span>
                        </div>
                    </div>
                )}
            </section>

            {/* Content Area */}
            {loading ? (
                <Loader text="Loading technologies..." />
            ) : error ? (
                <ErrorMessage message={error} onRetry={fetchTechnologies} />
            ) : (
                <>
                    {/* Filter Tabs */}
                    <section className="tech-section">
                        <div className="section-header">
                            <h2 className="section-title">Choose a Technology</h2>
                            <div className="filter-tabs">
                                <button
                                    className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                                    onClick={() => setFilter('all')}
                                >
                                    All
                                </button>
                                <button
                                    className={`filter-tab ${filter === 'popular' ? 'active' : ''}`}
                                    onClick={() => setFilter('popular')}
                                >
                                    🔥 Popular
                                </button>
                                <button
                                    className={`filter-tab ${filter === 'trending' ? 'active' : ''}`}
                                    onClick={() => setFilter('trending')}
                                >
                                    📈 Trending
                                </button>
                            </div>
                        </div>

                        {/* Technology Grid */}
                        <div className="tech-grid">
                            {filteredTechs.map((tech) => (
                                <TechCard key={tech.id} tech={tech} />
                            ))}
                        </div>

                        {filteredTechs.length === 0 && (
                            <div className="no-results">
                                <p>No technologies match this filter</p>
                            </div>
                        )}
                    </section>

                    {/* How It Works */}
                    <section className="how-it-works">
                        <h2 className="section-title">How It Works</h2>
                        <div className="steps">
                            <div className="step">
                                <div className="step-number">1</div>
                                <h3>Pick a Technology</h3>
                                <p>Choose from React, JavaScript, Python, Java and more</p>
                            </div>
                            <div className="step-arrow">→</div>
                            <div className="step">
                                <div className="step-number">2</div>
                                <h3>Browse Questions</h3>
                                <p>Real questions asked at Google, Amazon, Meta & other top companies</p>
                            </div>
                            <div className="step-arrow">→</div>
                            <div className="step">
                                <div className="step-number">3</div>
                                <h3>Learn Best Answers</h3>
                                <p>Community-voted answers — the most liked answer appears first</p>
                            </div>
                        </div>
                    </section>
                </>
            )}
        </main>
    );
}

export default HomePage;