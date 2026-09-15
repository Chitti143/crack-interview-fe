import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    FiArrowLeft,
    FiSend,
    FiX,
    FiPlus,
    FiHelpCircle,
} from 'react-icons/fi';
import technologies from '../data/technologies.json';
import './AskQuestionPage.css';

function AskQuestionPage() {
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [techId, setTechId] = useState('');
    const [difficulty, setDifficulty] = useState('mid-level');
    const [companyInput, setCompanyInput] = useState('');
    const [companies, setCompanies] = useState([]);
    const [errors, setErrors] = useState({});

    const addCompany = () => {
        const name = companyInput.trim();
        if (name && !companies.includes(name)) {
            setCompanies([...companies, name]);
            setCompanyInput('');
        }
    };

    const handleCompanyKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addCompany();
        }
    };

    const removeCompany = (company) => {
        setCompanies(companies.filter((c) => c !== company));
    };

    const validate = () => {
        const newErrors = {};
        if (!title.trim()) newErrors.title = 'Question title is required';
        if (title.trim().length < 10)
            newErrors.title = 'Title must be at least 10 characters';
        if (!techId) newErrors.techId = 'Please select a technology';
        if (companies.length === 0)
            newErrors.companies = 'Add at least one company';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        const newQuestion = {
            id: `q_${Date.now()}`,
            techId,
            title: title.trim(),
            description: description.trim(),
            companies,
            difficulty,
            postedBy: 'siva_chitti9',
            answerCount: 0,
            views: 0,
            createdAt: new Date().toISOString().split('T')[0],
        };

        console.log('New question:', newQuestion);
        // Later: POST to API
        // For now, navigate back to the tech page
        navigate(`/tech/${techId}`);
    };

    const popularCompanies = [
        'Google',
        'Amazon',
        'Meta',
        'Microsoft',
        'Apple',
        'Netflix',
        'Uber',
        'Flipkart',
        'Adobe',
        'Oracle',
        'TCS',
        'Infosys',
    ];

    const suggestedCompanies = popularCompanies.filter(
        (c) => !companies.includes(c)
    );

    return (
        <main className="ask-page">
            {/* Breadcrumb */}
            <div className="ask-breadcrumb">
                <Link to="/" className="ask-back-link">
                    <FiArrowLeft /> Home
                </Link>
                <span className="ask-sep">/</span>
                <span className="ask-current">Ask a Question</span>
            </div>

            {/* Page Header */}
            <div className="ask-header">
                <h1 className="ask-title">
                    <FiHelpCircle /> Ask an Interview Question
                </h1>
                <p className="ask-subtitle">
                    Share a real interview question you faced. Help others prepare better!
                </p>
            </div>

            {/* Form */}
            <form className="ask-form" onSubmit={handleSubmit}>
                {/* Technology Select */}
                <div className="ask-field">
                    <label className="ask-label">
                        Technology <span className="ask-required">*</span>
                    </label>
                    <select
                        className={`ask-select ${errors.techId ? 'ask-error-input' : ''}`}
                        value={techId}
                        onChange={(e) => {
                            setTechId(e.target.value);
                            setErrors({ ...errors, techId: '' });
                        }}
                    >
                        <option value="">Select a technology...</option>
                        {technologies.map((tech) => (
                            <option key={tech.id} value={tech.id}>
                                {tech.icon} {tech.name}
                            </option>
                        ))}
                    </select>
                    {errors.techId && (
                        <span className="ask-error">{errors.techId}</span>
                    )}
                </div>

                {/* Question Title */}
                <div className="ask-field">
                    <label className="ask-label">
                        Question Title <span className="ask-required">*</span>
                    </label>
                    <input
                        type="text"
                        className={`ask-input ${errors.title ? 'ask-error-input' : ''}`}
                        placeholder='e.g. "What is the difference between useMemo and useCallback?"'
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            setErrors({ ...errors, title: '' });
                        }}
                    />
                    <div className="ask-input-footer">
                        {errors.title ? (
                            <span className="ask-error">{errors.title}</span>
                        ) : (
                            <span className="ask-hint">Be specific and clear</span>
                        )}
                        <span
                            className={`ask-char-count ${title.length < 10 ? 'count-low' : 'count-ok'}`}
                        >
                            {title.length} characters
                        </span>
                    </div>
                </div>

                {/* Description */}
                <div className="ask-field">
                    <label className="ask-label">
                        Description <span className="ask-optional">(optional)</span>
                    </label>
                    <textarea
                        className="ask-textarea"
                        placeholder="Add more context — what kind of answer is expected? Any follow-up questions the interviewer asked?"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                    />
                </div>

                {/* Companies */}
                <div className="ask-field">
                    <label className="ask-label">
                        Companies where this was asked{' '}
                        <span className="ask-required">*</span>
                    </label>

                    {/* Selected Companies */}
                    {companies.length > 0 && (
                        <div className="ask-companies-selected">
                            {companies.map((company) => (
                                <span key={company} className="ask-company-tag">
                                    🏢 {company}
                                    <button
                                        type="button"
                                        className="ask-company-remove"
                                        onClick={() => removeCompany(company)}
                                    >
                                        <FiX />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Company Input */}
                    <div className="ask-company-input-row">
                        <input
                            type="text"
                            className={`ask-input ${errors.companies ? 'ask-error-input' : ''}`}
                            placeholder="Type company name and press Enter..."
                            value={companyInput}
                            onChange={(e) => setCompanyInput(e.target.value)}
                            onKeyDown={handleCompanyKeyDown}
                        />
                        <button
                            type="button"
                            className="ask-company-add-btn"
                            onClick={addCompany}
                            disabled={!companyInput.trim()}
                        >
                            <FiPlus /> Add
                        </button>
                    </div>
                    {errors.companies && (
                        <span className="ask-error">{errors.companies}</span>
                    )}

                    {/* Suggested Companies */}
                    {suggestedCompanies.length > 0 && (
                        <div className="ask-company-suggestions">
                            <span className="ask-suggestions-label">Quick add:</span>
                            {suggestedCompanies.slice(0, 8).map((company) => (
                                <button
                                    key={company}
                                    type="button"
                                    className="ask-suggestion-chip"
                                    onClick={() => setCompanies([...companies, company])}
                                >
                                    + {company}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Difficulty */}
                <div className="ask-field">
                    <label className="ask-label">Difficulty Level</label>
                    <div className="ask-difficulty-options">
                        {[
                            { key: 'junior', label: '🟢 Junior', desc: '0-2 years exp' },
                            {
                                key: 'mid-level',
                                label: '🟡 Mid-Level',
                                desc: '2-5 years exp',
                            },
                            { key: 'senior', label: '🔴 Senior', desc: '5+ years exp' },
                        ].map((d) => (
                            <label
                                key={d.key}
                                className={`ask-diff-option ${difficulty === d.key ? 'active' : ''}`}
                            >
                                <input
                                    type="radio"
                                    name="difficulty"
                                    value={d.key}
                                    checked={difficulty === d.key}
                                    onChange={(e) => setDifficulty(e.target.value)}
                                />
                                <span className="ask-diff-label">{d.label}</span>
                                <span className="ask-diff-desc">{d.desc}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Submit Buttons */}
                <div className="ask-actions">
                    <button
                        type="button"
                        className="ask-cancel-btn"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </button>
                    <button type="submit" className="ask-submit-btn">
                        <FiSend /> Post Question
                    </button>
                </div>
            </form>

            {/* Tips Sidebar */}
            <div className="ask-tips">
                <h3 className="ask-tips-title">💡 Tips for a great question</h3>
                <ul className="ask-tips-list">
                    <li>Write the question exactly as it was asked in the interview</li>
                    <li>Mention all companies where you've seen this question</li>
                    <li>Add context about follow-up questions if any</li>
                    <li>Choose the right difficulty level to help others filter</li>
                    <li>Avoid duplicate questions — search first!</li>
                </ul>
            </div>
        </main>
    );
}

export default AskQuestionPage;