import { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

export default function DiscussionBoard({ raceId }) {
  const { currentUser } = useAuth();
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "discussions", raceId, "comments"),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [raceId]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      await addDoc(collection(db, "discussions", raceId, "comments"), {
        message: message.trim(),
        userId: currentUser.uid,
        displayName: currentUser.email.split("@")[0],
        createdAt: serverTimestamp(),
      });
      setMessage("");
    } catch (err) {
      console.error("Failed to post comment", err);
    }
  }

  async function handleDelete(commentId, commentUserId) {
    if (commentUserId !== currentUser?.uid) return;
    await deleteDoc(doc(db, "discussions", raceId, "comments", commentId));
  }

  function formatDate(timestamp) {
    if (!timestamp) return "";
    return new Date(timestamp.seconds * 1000).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="discussion-board">
      <h2 className="discussion-title">Race Discussion</h2>

      {loading ? (
        <p className="discussion-loading">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="discussion-empty">
          No comments yet. Be the first to start the discussion!
        </p>
      ) : (
        <ul className="comments-list">
          {comments.map((comment) => (
            <li key={comment.id} className="comment">
              <div className="comment-header">
                <span className="comment-author">{comment.displayName}</span>
                <span className="comment-date">{formatDate(comment.createdAt)}</span>
              </div>
              <p className="comment-message">{comment.message}</p>
              {currentUser?.uid === comment.userId && (
                <button
                  className="comment-delete"
                  onClick={() => handleDelete(comment.id, comment.userId)}
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {currentUser ? (
        <form onSubmit={handleSubmit} className="comment-form">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share your thoughts on this race..."
            rows={3}
            className="comment-input"
          />
          <button type="submit" className="comment-submit">
            Post Comment
          </button>
        </form>
      ) : (
        <p className="discussion-login">
          <a href="/login">Log in</a> to join the discussion.
        </p>
      )}
    </div>
  );
}