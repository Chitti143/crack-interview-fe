import { useState } from 'react';
import { FiSend, FiEdit3 } from 'react-icons/fi';
import './AnswerForm.css';

function AnswerForm({ questionId, onSubmit }) {
    const [body, setBody] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!body.trim()) return;

        const newAnswer = {
            id: `a_${Date.now()}`,
            questionId,
            body: body.trim(),
            likes: 0,
            likedBy: [],
            postedBy: 'siva_chitti9',
            createdAt: new Date().toISOString().split('T')[0],
        };

        onSubmit(newAnswer);
        setBody('');
        setIsExpanded(false);
    };

    return (
        <div className="answer-form-container">
            <h3 className="af-title">
                <FiEdit3 /> Your Answer
            </h3>

            <form onSubmit={handleSubmit} className="answer-form">
                <textarea
                    className="af-textarea"
                    placeholder="Share your knowledge... Write a clear, detailed answer that helps others understand the concept."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    onFocus={() => setIsExpanded(true)}
                    rows={isExpanded ? 8 : 3}
                />

                {isExpanded && (
                    <div className="af-footer">
                        <div className="af-tips">
                            <span className="af-tip">💡 Include examples for a better answer</span>
                        </div>
                        <div className="af-actions">
                            <button
                                type="button"
                                className="af-cancel"
                                onClick={() => {
                                    setIsExpanded(false);
                                    setBody('');
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="af-submit"
                                disabled={!body.trim()}
                            >
                                <FiSend /> Submit Answer
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}

export default AnswerForm;