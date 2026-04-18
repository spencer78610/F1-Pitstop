import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import DriverCard from "../components/DriverCard";
import { useNavigate } from "react-router-dom";

export default function Favourites() {
  const { currentUser } = useAuth();
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    async function fetchFavourites() {
      try {
        const snapshot = await getDocs(
          collection(db, "users", currentUser.uid, "favourites")
        );
        setFavourites(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Failed to fetch favourites", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFavourites();
  }, [currentUser]);

  function handleFavouriteToggle(driverId) {
    setFavourites((prev) => prev.filter((d) => d.driverId !== driverId));
  }

  if (loading) return <div className="loading">Loading favourites...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>My Favourite Drivers</h1>
        <p>Your saved drivers for the 2026 season</p>
      </div>

      {favourites.length === 0 ? (
        <div className="empty-state">
          <p>You haven't saved any drivers yet.</p>
          <button className="hero-btn" onClick={() => navigate("/drivers")}>
            Browse Drivers
          </button>
        </div>
      ) : (
        <div className="drivers-grid">
          {favourites.map((driver) => (
            <DriverCard
              key={driver.driverId}
              driver={driver}
              isFavourite={true}
              onFavouriteToggle={handleFavouriteToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}