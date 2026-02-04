import { createContext, useContext, useState, useEffect } from 'react';

const LikesContext = createContext();

const API_URL = 'http://localhost:3000/api';

export const LikesProvider = ({ children }) => {
    const [likesMap, setLikesMap] = useState({});

    const refreshLikes = () => {
        fetch(`${API_URL}/likes`)
            .then(res => res.json())
            .then(data => setLikesMap(data))
            .catch(err => console.error("Failed to fetch likes", err));
    };

    useEffect(() => {
        refreshLikes();
    }, []);

    const handleLike = async (imageId, isCurrentlyLiked) => {
        const action = isCurrentlyLiked ? 'dec' : 'inc';

        // Optimistic Update
        setLikesMap(prev => ({
            ...prev,
            [imageId]: (prev[imageId] || 0) + (isCurrentlyLiked ? -1 : 1)
        }));

        try {
            await fetch(`${API_URL}/like/${encodeURIComponent(imageId)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action })
            });
            // Optional: refresh from server to ensure sync
            // refreshLikes(); 
        } catch (err) {
            console.error("Failed to update like", err);
            // Revert on failure (simple revert: re-fetch or manual undo)
            refreshLikes();
        }
    };

    return (
        <LikesContext.Provider value={{ likesMap, handleLike, refreshLikes }}>
            {children}
        </LikesContext.Provider>
    );
};

export const useLikes = () => useContext(LikesContext);
