import { useEffect, useState } from "react";
import API from "../api/apiClient";
import StoryCard from "../components/StoryCard";
import { useAuth } from "../context/AuthContext";

const Bookmarks = () => {
  const [bookmarkedStories, setBookmarkedStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const res = await API.get('/stories/my/bookmarks');
        setBookmarkedStories(res.data || []);
      } catch (err) {
        setError("Failed to fetch bookmarked stories");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [user?.bookmarks]);

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="empty-text">📚 Loading your bookmarks...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-container">{error}</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">📚 My Bookmarks</h1>
        <p className="page-subtitle">Your collection of saved stories</p>
      </div>

      {bookmarkedStories.length === 0 ? (
        <div className="empty-container">
          <p className="empty-text">You haven't bookmarked any stories yet. Go to the home page to find and bookmark your favorite stories!</p>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', color: 'var(--text-secondary)' }}>
            You have <strong style={{ color: 'var(--text-primary)' }}>{bookmarkedStories.length}</strong> bookmarked {bookmarkedStories.length === 1 ? 'story' : 'stories'}
          </div>
          {bookmarkedStories.map((story) => (
            <StoryCard 
              key={story._id} 
              story={story} 
              isBookmarked={true} 
            />
          ))}
        </>
      )}
    </div>
  );
};

export default Bookmarks;
