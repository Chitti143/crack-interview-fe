import { useState } from 'react';
import { FiZap, FiUser, FiArrowRight } from 'react-icons/fi';
import { useUser } from '../context/UserContext';
import './UsernameModal.css';

function UsernameModal() {
    const { showModal, saveUsername } = useUser();
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    if (!showModal) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        const trimmed = name.trim();
        if (!trimmed) {
            setError('Please enter a username');
            return;
        }
        if (trimmed.length < 3) {
            setError('Username must be at least 3 characters');
            return;
        }
        if (trimmed.length > 20) {
            setError('Username must be 20 characters or less');
            return;
        }

        saveUsername(trimmed);
    };

    const preview = name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '_');

    return (
        <div className="modal-overlay">
            <div className="modal-card">
                {/* Logo */}
                <div className="modal-logo">
                    <FiZap className="modal-logo-icon" />
                    <span className="modal-logo-text">
                        Crack<span className="modal-logo-highlight">Interview</span>
                    </span>
                </div>

                {/* Welcome Text */}
                <h2 className="modal-title">Welcome! 👋</h2>
                <p className="modal-subtitle">
                    Choose a display name to start asking questions and sharing answers
                    with the community.
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="modal-input-group">
                        <span className="modal-at">@</span>
                        <input
                            type="text"
                            className={`modal-input ${error ? 'modal-input-error' : ''}`}
                            placeholder="e.g. siva_chitti9"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setError('');
                            }}
                            autoFocus
                            maxLength={20}
                        />
                    </div>

                    {/* Preview */}
                    {name.trim() && !error && (
                        <p className="modal-preview">
                            You'll appear as <strong>@{preview}</strong>
                        </p>
                    )}

                    {/* Error */}
                    {error && <p className="modal-error">{error}</p>}

                    {/* Submit */}
                    <button type="submit" className="modal-submit" disabled={!name.trim()}>
                        Start Exploring <FiArrowRight />
                    </button>
                </form>

                {/* Features */}
                <div className="modal-features">
                    <div className="modal-feature">
                        <FiUser className="modal-feature-icon" />
                        <span>No email or password needed</span>
                    </div>
                    <div className="modal-feature">
                        <FiZap className="modal-feature-icon" />
                        <span>Start answering questions instantly</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UsernameModal;