import { useEffect, useState } from "react";
import API from "../api/apiClient";
import StoryCard from "../components/StoryCard";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/stories?page=${page}&limit=10`);
        setStories(res.data.stories || res.data);
        if (res.data.totalPages) {
          setTotalPages(res.data.totalPages);
        }
      } catch (err) {
        setError("Failed to fetch stories");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [page]);

  if (loading && stories.length === 0) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="empty-text">📰 Loading stories...</div>
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
        <h1 className="page-title">🔥 Trending Stories</h1>
        <p className="page-subtitle">Stay updated with the latest news from around the web</p>
      </div>

      {stories.length === 0 ? (
        <div className="empty-container">
          <p className="empty-text">No stories available yet. Check back soon!</p>
        </div>
      ) : (
        <>
          {stories.map((story) => (
            <StoryCard
              key={story._id}
              story={story}
              isBookmarked={user?.bookmarks?.includes(story._id)}
            />
          ))}

          <div className="pagination-container">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="pagination-btn"
            >
              ← Previous
            </button>
            <span className="pagination-info">
              Page <strong>{page}</strong> of <strong>{totalPages}</strong>
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="pagination-btn"
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
