import { useState } from 'react';

const ReplyModal = ({ review, onClose, onReplySubmit }) => {
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!replyText.trim()) {
      setError('Please enter a reply message');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://mengedmate-backend.onrender.com/api/reviews/reply/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          review: review.id,
          reply_text: replyText.trim()
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onReplySubmit(data);
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to submit reply');
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
      setError('Failed to submit reply. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`star ${index < rating ? 'filled' : ''}`}>
        ★
      </span>
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content reply-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Reply to Review</h2>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {/* Review Summary */}
          <div className="review-summary">
            <div className="review-header">
              <h4>{review.station_name}</h4>
              <div className="review-rating">
                <div className="stars">
                  {renderStars(review.rating)}
                </div>
                <span className="rating-number">{review.rating}/5</span>
              </div>
            </div>
            
            <div className="reviewer-info">
              <span className="reviewer-email">{review.user_email}</span>
              <span className="review-date">{formatDate(review.created_at)}</span>
            </div>

            {review.review_text && (
              <div className="review-text">
                <p>"{review.review_text}"</p>
              </div>
            )}
          </div>

          {/* Reply Form */}
          <form onSubmit={handleSubmit} className="reply-form">
            <div className="form-group">
              <label htmlFor="reply-text">Your Reply</label>
              <textarea
                id="reply-text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a professional response to this review..."
                rows={6}
                maxLength={1000}
                required
              />
              <div className="character-count">
                {replyText.length}/1000 characters
              </div>
            </div>

            {error && (
              <div className="error-message">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                {error}
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !replyText.trim()}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin" viewBox="0 0 24 24" style={{ width: '16px', height: '16px', marginRight: '8px' }}>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"/>
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Send Reply'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReplyModal;
