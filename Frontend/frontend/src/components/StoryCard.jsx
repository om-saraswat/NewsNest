import { useAuth } from "../context/AuthContext";
import API from "../api/apiClient";
import { useState } from "react";

const StoryCard = ({ story, isBookmarked: initialBookmarked, onBookmarkChange }) => {
    const { isAuthenticated, user, setUser } = useAuth();
    const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);

    const handleBookmark = async () => {
        if (!isAuthenticated) {
            alert("Please login to bookmark stories");
            return;
        }

        try {
            const res = await API.post(`/stories/${story._id}/bookmark`);
            setIsBookmarked(res.data.bookmarked);

            // Update user context bookmarks
            setUser(prev => ({ 
                ...prev, 
                bookmarks: res.data.bookmarks 
            }));

            if (onBookmarkChange) {
                onBookmarkChange(story._id, res.data.bookmarked);
            }
        } catch (error) {
            console.error("Error toggling bookmark:", error);
            alert("Failed to toggle bookmark");
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="story-card">
            <button
                onClick={handleBookmark}
                className={`story-card-bookmark ${isBookmarked ? 'bookmarked' : ''}`}
                title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
            >
                {isBookmarked ? '★' : '☆'}
            </button>
            <div className="story-card-content">
                <div className="story-card-title">
                    <a href={story.url} target="_blank" rel="noopener noreferrer">
                        {story.title}
                    </a>
                </div>
                <div className="story-card-meta">
                    <span>⭐ {story.points} points</span>
                    <span>•</span>
                    <span>by {story.author}</span>
                    <span>•</span>
                    <span>{formatDate(story.postedAt || story.createdAt)}</span>
                </div>
            </div>
        </div>
    );
};

export default StoryCard;
