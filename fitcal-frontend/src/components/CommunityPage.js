import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CommunityPage.css';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';


const CommunityPage = () => {
  const { userId } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('viewComments');
  const [comments, setComments] = useState([]);
  

  useEffect(() => {
   
 
   
    // Fetch comments from the backend when the component loads
    axios.get('http://localhost:5000/api/comments')
      .then(response => {
        setComments(response.data);
      })
      .catch(error => {
        console.error('Error fetching comments:', error);
      });
  }, []);

  const handleAddComment = (newComment) => {
    axios.post('http://localhost:5000/api/comments', {
      user_id: userId,
      text: newComment,
    })
      .then(response => {
        // Re-fetch comments after adding
        return axios.get('http://localhost:5000/api/comments');
      })
      .then(response => {
        setComments(response.data);
      })
      .catch(error => {
        console.error('Error adding comment:', error);
      });
  };

  const handleLike = (id, liked) => {
    axios.patch(`http://localhost:5000/api/comments/${id}/like`, { user_id: userId })
      .then(response => {
        // Re-fetch comments after toggling like
        return axios.get(`http://localhost:5000/api/comments`, {
          params: { user_id: userId }
        });
      })
      .then(response => {
        setComments(response.data);
      })
      .catch(error => {
        console.error('Error toggling like:', error);
      });
  };
  
  

  const renderContent = () => {
    if (activeTab === 'viewComments') {
      return (
        <div>
          <h3>Yorumlar</h3>
          <ul>
            {comments.map((comment) => (
              <li key={comment.comment_id} className="comment-item">
              <div className="comment-text">
                <strong>{comment.full_name}:</strong> {comment.text} ({comment.likes} beğeni)
              </div>
              <div className="comment-actions">
                <button
                  className="like-button"
                  onClick={() => handleLike(comment.comment_id, comment.liked)}
                >
                  {comment.liked ? 'Beğeniyi Geri Al' : 'Beğen'}
                </button>
              </div>
            </li>
            
            ))}
          </ul>
        </div>
      );
    } else if (activeTab === 'addComment') {
      return (
        <div>
          <h3>Yorum Ekle</h3>
          <textarea
            id="newComment"
            placeholder="Tarifinizi veya tavsiyenizi buraya yazın..."
            className="comment-input"
          ></textarea>
          <button
            className="submit-button"
            onClick={() => {
              const comment = document.getElementById('newComment').value;
              if (comment) {
                handleAddComment(comment);
                document.getElementById('newComment').value = '';
              }
            }}
          >
            Gönder
          </button>
        </div>
      );
    } else if (activeTab === 'topComments') {
      return (
        <div>
          <h3>En Beğenilen Yorumlar</h3>
          <ul>
            {comments
              .sort((a, b) => b.likes - a.likes)
              .slice(0, 3)
              .map((comment) => (
                <li key={comment.comment_id} className="comment-item">
                  <div className="comment-text">
                    <strong>{comment.full_name}:</strong> {comment.text} ({comment.likes} beğeni)
                    <button
                      className="like-button"
                      onClick={() => handleLike(comment.comment_id, comment.liked)}
                    >
                      {comment.liked ? 'Beğeniyi Geri Al' : 'Beğen'}
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      );
    }
  };
  
  

  return (
    <div className="community-page">
      <h1>FITCAL</h1>
      <div className="community-buttons">
        <button className="tab-button" onClick={() => setActiveTab('viewComments')}>Yorumları Görüntüle</button>
        <button className="tab-button" onClick={() => setActiveTab('addComment')}>Yorum Ekle</button>
        <button className="tab-button" onClick={() => setActiveTab('topComments')}>En Beğenilen Yorumlar</button>
      </div>
      {renderContent()}
    </div>
  );
};

export default CommunityPage;
