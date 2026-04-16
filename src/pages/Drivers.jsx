import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import DriverCard from "../components/DriverCard";

export default function Drivers() {
  const { currentUser } = useAuth();
  const [drivers, setDrivers] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDrivers() {
      try {
        const res = await fetch("https://f1api.dev/api/current/drivers?limit=30");
        const data = await res.json();
        setDrivers(data.drivers || []);
      } catch (err) {
        console.error("Failed to fetch drivers", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDrivers();
  }, []);

  useEffect(() => {
    async function fetchFavourites() {
      if (!currentUser) return;
      const snapshot = await getDocs(
        collection(db, "users", currentUser.uid, "favourites")
      );
      setFavourites(snapshot.docs.map((doc) => doc.id));
    }
    fetchFavourites();
  }, [currentUser]);

  function handleFavouriteToggle(driverId) {
    setFavourites((prev) =>
      prev.includes(driverId)
        ? prev.filter((id) => id !== driverId)
        : [...prev, driverId]
    );
  }

  if (loading) return <div className="loading">Loading drivers...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Current Season Drivers</h1>
        <p>2025 Formula 1 World Championship</p>
      </div>
      <div className="drivers-grid">
        {drivers.map((driver) => (
          <DriverCard
            key={driver.driverId}
            driver={driver}
            isFavourite={favourites.includes(driver.driverId)}
            onFavouriteToggle={handleFavouriteToggle}
          />
        ))}
      </div>
    </div>
  );
}