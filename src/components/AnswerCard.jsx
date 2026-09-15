import { useState } from 'react';
import { FiThumbsUp, FiThumbsDown, FiMessageCircle, FiShare2, FiFlag, FiAward } from 'react-icons/fi';
import './AnswerCard.css';

function AnswerCard({ answer, rank }) {
    const [likes, setLikes] = useState(answer.likes);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);

    const isBestAnswer = rank === 1;

    const handleLike = () => {
        if (liked) {
            setLikes(likes - 1);
            setLiked(false);
        } else {
            setLikes(disliked ? likes + 2 : likes + 1);
            setLiked(true);
            setDisliked(false);
        }
    };

    const handleDislike = () => {
        if (disliked) {
            setLikes(likes + 1);
            setDisliked(false);
        } else {
            setLikes(liked ? likes - 2 : likes - 1);
            setDisliked(true);
            setLiked(false);
        }
    };

    const timeAgo = (dateStr) => {
        const days = Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
        return `${Math.floor(days / 30)} months ago`;
    };

    return (
        <div className={`answer-card ${isBestAnswer ? 'best-answer' : ''}`}>
            {/* Best Answer Badge */}
            {isBestAnswer && (
                <div className="best-answer-badge">
                    <FiAward /> Best Answer
                </div>
            )}

            <div className="ac-layout">
                {/* Left: Vote Buttons */}
                <div className="ac-votes">
                    <button
                        className={`ac-vote-btn ${liked ? 'voted-up' : ''}`}
                        onClick={handleLike}
                    >
                        <FiThumbsUp />
                    </button>
                    <span className={`ac-vote-count ${liked ? 'count-up' : ''} ${disliked ? 'count-down' : ''}`}>
                        {likes}
                    </span>
                    <button
                        className={`ac-vote-btn ${disliked ? 'voted-down' : ''}`}
                        onClick={handleDislike}
                    >
                        <FiThumbsDown />
                    </button>
                </div>

                {/* Right: Answer Content */}
                <div className="ac-content">
                    <div className="ac-body">{answer.body}</div>

                    {/* Answer Footer */}
                    <div className="ac-footer">
                        <div className="ac-actions">
                            <button className="ac-action-btn">
                                <FiMessageCircle /> Reply
                            </button>
                            <button className="ac-action-btn">
                                <FiShare2 /> Share
                            </button>
                            <button className="ac-action-btn">
                                <FiFlag /> Report
                            </button>
                        </div>

                        <div className="ac-author">
                            <div className="ac-avatar">
                                {answer.postedBy.charAt(0).toUpperCase()}
                            </div>
                            <div className="ac-author-info">
                                <span className="ac-author-name">@{answer.postedBy}</span>
                                <span className="ac-author-date">{timeAgo(answer.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AnswerCard;