import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import './ErrorMessage.css';

function ErrorMessage({ message = 'Something went wrong', onRetry }) {
    return (
        <div className="error-container">
            <FiAlertCircle className="error-icon" />
            <h3 className="error-title">Oops!</h3>
            <p className="error-text">{message}</p>
            {onRetry && (
                <button className="error-retry" onClick={onRetry}>
                    <FiRefreshCw /> Try Again
                </button>
            )}
        </div>
    );
}

export default ErrorMessage;