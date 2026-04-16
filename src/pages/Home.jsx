import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [standings, setStandings] = useState([]);
  const [nextRace, setNextRace] = useState(null);
  const [countdown, setCountdown] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [standingsRes, nextRaceRes] = await Promise.all([
          fetch("https://f1api.dev/api/current/drivers-championship?limit=3"),
          fetch("https://f1api.dev/api/current/next"),
        ]);
        const standingsData = await standingsRes.json();
        const nextRaceData = await nextRaceRes.json();
        setStandings(standingsData.drivers_championship || []);
        setNextRace(nextRaceData.race?.[0] || null);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // countdown timer
  useEffect(() => {
    if (!nextRace?.schedule?.race?.date) return;
    function updateCountdown() {
      const raceDate = new Date(nextRace.schedule.race.date);
      const now = new Date();
      const diff = raceDate - now;
      if (diff <= 0) {
        setCountdown("Race day!");
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [nextRace]);

  const medals = ["🥇", "🥈", "🥉"];

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="home">
      {/* Hero */}
      <div className="hero">
        <h1>Welcome to <span>F1 Pitstop</span></h1>
        <p>Your hub for Formula 1 standings, races, and fan discussion.</p>
        <Link to="/drivers" className="hero-btn">Explore Drivers</Link>
      </div>

      <div className="home-grid">
        {/* Next Race */}
        {nextRace && (
          <div className="card next-race">
            <h2>Next Race</h2>
            <h3>{nextRace.circuit.circuitName}</h3>
            <p className="location">
              {nextRace.circuit.city}, {nextRace.circuit.country}
            </p>
            <p className="race-date">
              {new Date(nextRace.schedule.race.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <div className="countdown">{countdown}</div>
            <Link to="/races" className="card-link">Full Schedule →</Link>
          </div>
        )}

        {/* Top 3 Standings */}
        <div className="card standings-card">
          <h2>Driver Standings</h2>
          <ul className="standings-list">
            {standings.map((entry, i) => (
              <li key={entry.driverId} className="standing-item">
                <span className="medal">{medals[i]}</span>
                <div className="driver-info">
                  <span className="driver-name">
                    {entry.driver.name} {entry.driver.surname}
                  </span>
                  <span className="team-name">{entry.team.teamName}</span>
                </div>
                <span className="points">{entry.points} pts</span>
              </li>
            ))}
          </ul>
          <Link to="/drivers" className="card-link">Full Standings →</Link>
        </div>
      </div>
    </div>
  );
}