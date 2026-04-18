import { useState, useEffect } from "react";
import RaceCard from "../components/RaceCard";

export default function Races() {
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function fetchRaces() {
      try {
        const res = await fetch("https://f1api.dev/api/current?limit=30");
        const data = await res.json();
        console.log(data); 
        setRaces(data.races || []);
      } catch (err) {
        console.error("Failed to fetch races", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRaces();
  }, []);

  const now = new Date();
  const filtered = races.filter((race) => {
    const raceDate = new Date(race.schedule.race.date);
    if (filter === "past") return raceDate < now;
    if (filter === "upcoming") return raceDate >= now;
    return true;
  });

  if (loading) return <div className="loading">Loading races...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>2026 Season Schedule</h1>
        <p>Full Formula 1 race calendar</p>
      </div>
      <div className="race-filters">
        {["all", "upcoming", "past"].map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      <div className="races-grid">
        {filtered.map((race) => (
          <RaceCard key={race.raceId} race={race} />
        ))}
      </div>
    </div>
  );
}