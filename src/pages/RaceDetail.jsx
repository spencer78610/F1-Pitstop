// src/pages/RaceDetail.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DiscussionBoard from "../components/DiscussionBoard";

export default function RaceDetail() {
  const { raceId } = useParams();
  const [race, setRace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRaces() {
      try {
        const res = await fetch("https://f1api.dev/api/current?limit=30");
        const data = await res.json();
        const found = data.races?.find((r) => r.raceId === raceId);
        setRace(found || null);
      } catch (err) {
        console.error("Failed to fetch race", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRaces();
  }, [raceId]);

  if (loading) return <div className="loading">Loading race...</div>;
  if (!race) return <div className="loading">Race not found.</div>;

  const raceDate = new Date(race.schedule.race.date);
  const isPast = raceDate < new Date();

  return (
    <div className="page">
      <div className="page-header">
        <h1>{race.circuit.circuitName}</h1>
        <p>{race.circuit.city}, {race.circuit.country} — Round {race.round}</p>
      </div>

      <div className="race-detail-grid">
        <div className="race-detail-card">
          <h2>Schedule</h2>
          <ul className="schedule-list">
            {race.schedule.fp1.date && <li><span>FP1</span><span>{race.schedule.fp1.date}</span></li>}
            {race.schedule.fp2.date && <li><span>FP2</span><span>{race.schedule.fp2.date}</span></li>}
            {race.schedule.fp3.date && <li><span>FP3</span><span>{race.schedule.fp3.date}</span></li>}
            {race.schedule.qualy.date && <li><span>Qualifying</span><span>{race.schedule.qualy.date}</span></li>}
            {race.schedule.sprintRace.date && <li><span>Sprint</span><span>{race.schedule.sprintRace.date}</span></li>}
            <li className="race-row"><span>Race</span><span>{race.schedule.race.date}</span></li>
          </ul>
        </div>

        <div className="race-detail-card">
          <h2>Circuit Info</h2>
          <ul className="circuit-list">
            <li><span>Length</span><span>{race.circuit.circuitLength}</span></li>
            <li><span>Corners</span><span>{race.circuit.corners}</span></li>
            <li><span>Lap Record</span><span>{race.circuit.lapRecord}</span></li>
            <li><span>First GP</span><span>{race.circuit.firstParticipationYear}</span></li>
          </ul>
        </div>

        {isPast && race.winner && (
          <div className="race-detail-card winner-card">
            <h2>Race Winner</h2>
            <p className="winner-name">🏆 {race.winner.name} {race.winner.surname}</p>
            {race.teamWinner && <p className="winner-team">{race.teamWinner.teamName}</p>}
          </div>
        )}
      </div>

      <DiscussionBoard raceId={raceId} />
    </div>
  );
}