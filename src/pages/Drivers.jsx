// src/pages/Drivers.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import DriverCard from "../components/DriverCard";

export default function Drivers() {
  const { currentUser } = useAuth();
  const [drivers, setDrivers] = useState([]);
  const [standings, setStandings] = useState({});
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [driversRes, standingsRes] = await Promise.all([
          fetch("https://f1api.dev/api/current/drivers?limit=30"),
          fetch("https://f1api.dev/api/current/drivers-championship?limit=30"),
        ]);
        const driversData = await driversRes.json();
        const standingsData = await standingsRes.json();

        // build a map of driverId -> points for easy lookup
        const pointsMap = {};
        standingsData.drivers_championship?.forEach((entry) => {
          pointsMap[entry.driverId] = entry.points;
        });

        setDrivers(driversData.drivers || []);
        setStandings(pointsMap);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
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
        <p>2026 Formula 1 World Championship</p>
      </div>
      <div className="drivers-grid">
        {drivers.map((driver) => (
          <DriverCard
            key={driver.driverId}
            driver={driver}
            points={standings[driver.driverId] ?? 0}
            isFavourite={favourites.includes(driver.driverId)}
            onFavouriteToggle={handleFavouriteToggle}
          />
        ))}
      </div>
    </div>
  );
}