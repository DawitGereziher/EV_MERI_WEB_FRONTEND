import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../dashboard/Sidebar';
import MobileHeader from '../dashboard/MobileHeader';
import ReplyModal from './ReplyModal';
import '../../styles/reviews.css';

const Reviews = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState('All Ratings');
  const [filterStation, setFilterStation] = useState('All Stations');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [stations, setStations] = useState([]);
  const [reviewStats, setReviewStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    fiveStars: 0,
    fourStars: 0,
    threeStars: 0,
    twoStars: 0,
    oneStars: 0
  });
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchReviews();
    fetchStations();
  }, [navigate]);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://mengedmate-backend.onrender.com/api/stations/reviews/', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const reviewsList = data.results || data || [];
        setReviews(reviewsList);
        calculateReviewStats(reviewsList);
      } else {
        console.error('Failed to fetch reviews:', response.status);
        // Use mock data for demo
        setReviews(mockReviews);
        calculateReviewStats(mockReviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // Use mock data for demo
      setReviews(mockReviews);
      calculateReviewStats(mockReviews);
    } finally {
      setLoading(false);
    }
  };

  const fetchStations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://mengedmate-backend.onrender.com/api/stations/', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const stationsList = data.results || data || [];
        setStations(stationsList);
      }
    } catch (error) {
      console.error('Error fetching stations:', error);
    }
  };

  const calculateReviewStats = (reviewsList) => {
    const totalReviews = reviewsList.length;
    const averageRating = totalReviews > 0 
      ? reviewsList.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0;

    const ratingCounts = {
      fiveStars: reviewsList.filter(r => r.rating === 5).length,
      fourStars: reviewsList.filter(r => r.rating === 4).length,
      threeStars: reviewsList.filter(r => r.rating === 3).length,
      twoStars: reviewsList.filter(r => r.rating === 2).length,
      oneStars: reviewsList.filter(r => r.rating === 1).length,
    };

    setReviewStats({
      totalReviews,
      averageRating,
      ...ratingCounts
    });
  };

  const mockReviews = [
    {
      id: 1,
      station_name: 'EVMERI Station 1',
      station_id: 'sta2c4',
      user_email: 'jo***@example.com',
      rating: 5,
      review_text: 'Excellent charging station! Fast charging and clean facilities.',
      charging_speed_rating: 5,
      location_rating: 4,
      amenities_rating: 5,
      created_at: '2024-06-15T10:30:00Z',
      is_active: true,
      reply: {
        id: 1,
        station_owner_name: 'EVMERI Solutions',
        reply_text: 'Thank you for your wonderful feedback! We\'re delighted to hear you had an excellent experience.',
        created_at: '2024-06-15T14:20:00Z'
      }
    },
    {
      id: 2,
      station_name: 'Tola Station',
      station_id: 'sta977',
      user_email: 'al***@example.com',
      rating: 4,
      review_text: 'Good station, but could use more parking spaces.',
      charging_speed_rating: 4,
      location_rating: 3,
      amenities_rating: 4,
      created_at: '2024-06-14T15:45:00Z',
      is_active: true,
      reply: null
    },
    {
      id: 3,
      station_name: 'EVMERI Station 1',
      station_id: 'sta2c4',
      user_email: 'sa***@example.com',
      rating: 5,
      review_text: 'Perfect location and very reliable charging.',
      charging_speed_rating: 5,
      location_rating: 5,
      amenities_rating: 4,
      created_at: '2024-06-13T09:20:00Z',
      is_active: true,
      reply: null
    },
    {
      id: 4,
      station_name: 'Tola Station',
      station_id: 'sta977',
      user_email: 'mi***@example.com',
      rating: 3,
      review_text: 'Average experience. Charging was slow.',
      charging_speed_rating: 2,
      location_rating: 4,
      amenities_rating: 3,
      created_at: '2024-06-12T14:10:00Z',
      is_active: true,
      reply: {
        id: 2,
        station_owner_name: 'Tola Energy',
        reply_text: 'Thank you for your feedback. We are working on upgrading our charging infrastructure to improve speed.',
        created_at: '2024-06-12T16:30:00Z'
      }
    },
    {
      id: 5,
      station_name: 'EVMERI Station 1',
      station_id: 'sta2c4',
      user_email: 'da***@example.com',
      rating: 4,
      review_text: 'Good overall experience, will come back.',
      charging_speed_rating: 4,
      location_rating: 4,
      amenities_rating: 4,
      created_at: '2024-06-11T11:30:00Z',
      is_active: true,
      reply: null
    }
  ];

  const filteredReviews = reviews.filter(review => {
    const ratingMatch = filterRating === 'All Ratings' || review.rating.toString() === filterRating;
    const stationMatch = filterStation === 'All Stations' || review.station_name === filterStation;
    return ratingMatch && stationMatch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

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

  const getUniqueStations = () => {
    const stationNames = reviews.map(review => review.station_name).filter(Boolean);
    return [...new Set(stationNames)];
  };

  const handleReplyClick = (review) => {
    setSelectedReview(review);
    setShowReplyModal(true);
  };

  const handleReplySubmit = (replyData) => {
    // Update the review with the new reply
    setReviews(prevReviews =>
      prevReviews.map(review =>
        review.id === selectedReview.id
          ? { ...review, reply: replyData }
          : review
      )
    );

    setSuccessMessage('Reply sent successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="reviews-page">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="reviews-content">
        <MobileHeader onMenuClick={() => setSidebarOpen(true)} title="Reviews" />
        <header className="reviews-header">
          <div className="header-left">
            <h1>Station Reviews</h1>
            <p>Monitor and manage customer feedback for your charging stations</p>
          </div>
          <div className="header-right">
            <button
              className="btn btn-primary export-btn"
              onClick={() => window.print()}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
              Export Reviews
            </button>
          </div>
        </header>

        <div className="reviews-stats">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                </svg>
              </div>
              <div className="stat-content">
                <h3>Total Reviews</h3>
                <p className="stat-value">{reviewStats.totalReviews}</p>
                <span className="stat-label">Customer feedback</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              </div>
              <div className="stat-content">
                <h3>Average Rating</h3>
                <p className="stat-value">{reviewStats.averageRating.toFixed(1)}</p>
                <span className="stat-label">Out of 5 stars</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              </div>
              <div className="stat-content">
                <h3>5-Star Reviews</h3>
                <p className="stat-value">{reviewStats.fiveStars}</p>
                <span className="stat-label">Excellent ratings</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                </svg>
              </div>
              <div className="stat-content">
                <h3>Response Rate</h3>
                <p className="stat-value">85%</p>
                <span className="stat-label">Customer engagement</span>
              </div>
            </div>
          </div>
        </div>

        <div className="reviews-filters">
          <div className="filters-row">
            <div className="filter-group">
              <label htmlFor="rating-filter">Filter by Rating:</label>
              <select
                id="rating-filter"
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="filter-select"
              >
                <option value="All Ratings">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="station-filter">Filter by Station:</label>
              <select
                id="station-filter"
                value={filterStation}
                onChange={(e) => setFilterStation(e.target.value)}
                className="filter-select"
              >
                <option value="All Stations">All Stations</option>
                {getUniqueStations().map(stationName => (
                  <option key={stationName} value={stationName}>
                    {stationName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="reviews-table-container">
          {successMessage && (
            <div className="success-message" style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '20px', height: '20px' }}>
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              {successMessage}
            </div>
          )}

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner">
                <svg className="animate-spin" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"/>
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              </div>
              <p>Loading reviews...</p>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                </svg>
              </div>
              <h3>No reviews found</h3>
              <p>No customer reviews match your current filters</p>
            </div>
          ) : (
            <>
              <div className="reviews-list">
                {currentReviews.map(review => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <div className="review-info">
                        <h4>{review.station_name}</h4>
                        <span className="station-id">ID: {review.station_id}</span>
                      </div>
                      <div className="review-rating">
                        <div className="stars">
                          {renderStars(review.rating)}
                        </div>
                        <span className="rating-number">{review.rating}/5</span>
                      </div>
                    </div>

                    <div className="review-content">
                      <div className="reviewer-info">
                        <span className="reviewer-email">{review.user_email}</span>
                        <span className="review-date">{formatDate(review.created_at)}</span>
                      </div>

                      {review.review_text && (
                        <p className="review-text">{review.review_text}</p>
                      )}

                      <div className="detailed-ratings">
                        {review.charging_speed_rating && (
                          <div className="rating-detail">
                            <span className="rating-label">Charging Speed:</span>
                            <div className="stars small">
                              {renderStars(review.charging_speed_rating)}
                            </div>
                          </div>
                        )}
                        {review.location_rating && (
                          <div className="rating-detail">
                            <span className="rating-label">Location:</span>
                            <div className="stars small">
                              {renderStars(review.location_rating)}
                            </div>
                          </div>
                        )}
                        {review.amenities_rating && (
                          <div className="rating-detail">
                            <span className="rating-label">Amenities:</span>
                            <div className="stars small">
                              {renderStars(review.amenities_rating)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Station Owner Reply */}
                    {review.reply && (
                      <div className="station-reply">
                        <div className="reply-header">
                          <div className="reply-owner">
                            <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '16px', height: '16px', marginRight: '6px' }}>
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                            <strong>{review.reply.station_owner_name}</strong>
                            <span className="owner-badge">Station Owner</span>
                          </div>
                          <span className="reply-date">{formatDate(review.reply.created_at)}</span>
                        </div>
                        <p className="reply-text">{review.reply.reply_text}</p>
                      </div>
                    )}

                    <div className="review-actions">
                      {!review.reply ? (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleReplyClick(review)}
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                          </svg>
                          Reply
                        </button>
                      ) : (
                        <span className="replied-indicator">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                          </svg>
                          Replied
                        </span>
                      )}
                      <button className="btn btn-outline btn-sm">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        Mark as Read
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <div className="pagination-info">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredReviews.length)} of {filteredReviews.length} reviews
                  </div>
                  <div className="pagination-controls">
                    <button
                      className="pagination-btn pagination-nav"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                      </svg>
                      Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                      <button
                        key={pageNum}
                        className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    ))}

                    <button
                      className="pagination-btn pagination-nav"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <footer className="reviews-footer">
          <div className="footer-content">
            <p>© 2024 evmeri Inc. All rights reserved.</p>
            <div className="footer-links">
              <a href="#about">About Us</a>
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
        </footer>
      </div>

      {/* Reply Modal */}
      {showReplyModal && selectedReview && (
        <ReplyModal
          review={selectedReview}
          onClose={() => {
            setShowReplyModal(false);
            setSelectedReview(null);
          }}
          onReplySubmit={handleReplySubmit}
        />
      )}
    </div>
  );
};

export default Reviews;
