import { useNavigate } from "react-router-dom";

export default function RaceCard({ race }) {
  const navigate = useNavigate();
  const raceDate = new Date(race.schedule.race.date);
  const isPast = raceDate < new Date();

  return (
    <div
      className={`race-card ${isPast ? "race-past" : "race-upcoming"}`}
      onClick={() => navigate(`/races/${race.raceId}`)}
    >
      <div className="race-card-round">Round {race.round}</div>
      <div className="race-card-body">
        <h3>{race.circuit.circuitName}</h3>
        <p className="race-card-location">
          {race.circuit.city}, {race.circuit.country}
        </p>
        <p className="race-card-date">
          {raceDate.toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
      <div className="race-card-footer">
        {isPast && race.winner ? (
          <span className="race-winner">
            🏆 {race.winner.name} {race.winner.surname}
          </span>
        ) : isPast ? (
          <span className="race-status past">Completed</span>
        ) : (
          <span className="race-status upcoming">Upcoming</span>
        )}
        <span className="race-card-link">Details →</span>
      </div>
    </div>
  );
}