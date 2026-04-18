import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function TeamDetail() {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [teamRes, driversRes] = await Promise.all([
          fetch(`https://f1api.dev/api/current/teams/${teamId}`),
          fetch(`https://f1api.dev/api/current/teams/${teamId}/drivers`),
        ]);
        const teamData = await teamRes.json();
        const driversData = await driversRes.json();
        setTeam(teamData.team?.[0] || null);
        setDrivers(driversData.drivers?.map((d) => d.driver) || []);
      } catch (err) {
        console.error("Failed to fetch team", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [teamId]);

  if (loading) return <div className="loading">Loading team...</div>;
  if (!team) return <div className="loading">Team not found.</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>{team.teamName}</h1>
        <p>{team.teamNationality} — Est. {team.firstAppeareance}</p>
      </div>

      <div className="team-detail-grid">
        <div className="race-detail-card">
          <h2>Team Info</h2>
          <ul className="circuit-list">
            <li><span>Nationality</span><span>{team.teamNationality}</span></li>
            <li><span>First Entry</span><span>{team.firstAppeareance}</span></li>
            <li><span>Constructors Titles</span><span>{team.constructorsChampionships ?? 0}</span></li>
            <li><span>Drivers Titles</span><span>{team.driversChampionships ?? 0}</span></li>
          </ul>
        </div>

        <div className="race-detail-card">
          <h2>2026 Drivers</h2>
          {drivers.length === 0 ? (
            <p style={{ color: "#aaa", fontSize: "14px" }}>No drivers found.</p>
          ) : (
            <ul className="team-drivers-list">
              {drivers.map((driver) => (
                <li key={driver.driverId} className="team-driver-item">
                  <span className="team-driver-number">#{driver.number}</span>
                  <span className="team-driver-name">
                    {driver.name} {driver.surname}
                  </span>
                  <span className="team-driver-short">{driver.shortName}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}