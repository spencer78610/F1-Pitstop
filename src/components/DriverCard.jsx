// src/components/DriverCard.jsx
import { useAuth } from "../context/AuthContext";
import { db } from "../../firebase";
import { doc, setDoc, deleteDoc } from "firebase/firestore";

export default function DriverCard({ driver, points, isFavourite, onFavouriteToggle }) {
  const { currentUser } = useAuth();

  async function handleFavourite() {
    if (!currentUser) return;
    const ref = doc(db, "users", currentUser.uid, "favourites", driver.driverId);
    if (isFavourite) {
      await deleteDoc(ref);
    } else {
      await setDoc(ref, { ...driver });
    }
    if (onFavouriteToggle) onFavouriteToggle(driver.driverId);
  }

  const teamName = driver.teamId
    ? driver.teamId.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Unknown Team";

  return (
    <div className="driver-card">
      <div className="driver-card-header">
        <span className="driver-number">#{driver.number}</span>
        <span className="driver-short">{driver.shortName}</span>
      </div>
      <div className="driver-card-body">
        <h3>{driver.name} {driver.surname}</h3>
        <p className="driver-team">{teamName}</p>
        <p className="driver-nationality">🌍 {driver.nationality}</p>
        <p className="driver-dob">🎂 {driver.birthday}</p>
        <p className="driver-points">🏆 {points} pts</p>
      </div>
      <div className="driver-card-footer">
        {currentUser && (
          <button
            onClick={handleFavourite}
            className={`fav-btn ${isFavourite ? "fav-active" : ""}`}
          >
            {isFavourite ? "★ Saved" : "☆ Favourite"}
          </button>
        )}
      </div>
    </div>
  );
}