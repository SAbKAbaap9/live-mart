import React, { useState } from 'react';
import { submitFeedback } from '../services/orderService';

const FeedbackForm = ({ productId, orderId, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await submitFeedback({
        productId,
        orderId,
        rating,
        comment
      });
      alert('Feedback submitted successfully!');
      if (onSuccess) onSuccess();
      setComment('');
      setRating(5);
    } catch (error) {
      alert('Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel" style={styles.form}>
      <h3 style={styles.title}>Leave Feedback</h3>

      <div style={styles.rating}>
        <label style={styles.label}>Rating:</label>
        <div style={styles.stars}>
          {[1, 2, 3, 4, 5].map(star => (
            <span
              key={star}
              onClick={() => setRating(star)}
              style={{
                ...styles.star,
                color: star <= rating ? '#fbbf24' : 'rgba(255,255,255,0.3)'
              }}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Comment:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          rows="4"
          style={styles.textarea}
          placeholder="Share your experience..."
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="btn-primary"
        style={styles.button}
      >
        {loading ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  );
};

const styles = {
  form: {
    maxWidth: '500px',
    margin: '20px auto'
  },
  title: {
    color: 'white',
    marginBottom: '20px'
  },
  rating: {
    marginBottom: '20px'
  },
  label: {
    color: 'white',
    display: 'block',
    marginBottom: '10px',
    fontWeight: '600'
  },
  stars: {
    display: 'flex',
    gap: '10px'
  },
  star: {
    fontSize: '32px',
    cursor: 'pointer',
    transition: 'color 0.3s'
  },
  field: {
    marginBottom: '20px'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.3)',
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    fontSize: '16px',
    fontFamily: 'Inter, sans-serif'
  },
  button: {
    width: '100%',
    padding: '12px'
  }
};

export default FeedbackForm;

