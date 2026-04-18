import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [standings, setStandings] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const [teamsRes, standingsRes] = await Promise.all([
          fetch("https://f1api.dev/api/current/teams?limit=30"),
          fetch("https://f1api.dev/api/current/constructors-championship?limit=30"),
        ]);
        const teamsData = await teamsRes.json();
        const standingsData = await standingsRes.json();

        const pointsMap = {};
        standingsData.constructors_championship?.forEach((entry) => {
          pointsMap[entry.teamId] = entry.points;
        });

        setTeams(teamsData.teams || []);
        setStandings(pointsMap);
      } catch (err) {
        console.error("Failed to fetch teams", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading teams...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Current Season Teams</h1>
        <p>2026 Formula 1 World Championship</p>
      </div>
      <div className="teams-grid">
        {teams.map((team) => (
          <div
            key={team.teamId}
            className="team-card"
            onClick={() => navigate(`/teams/${team.teamId}`)}
          >
            <div className="team-card-header">
              <h3>{team.teamName}</h3>
              <span className="team-nationality">🌍 {team.teamNationality}</span>
            </div>
            <div className="team-card-body">
              <div className="team-stat">
                <span>First Entry</span>
                <span>{team.firstAppeareance}</span>
              </div>
              <div className="team-stat">
                <span>Constructors Titles</span>
                <span>{team.constructorsChampionships ?? 0}</span>
              </div>
              <div className="team-stat">
                <span>Drivers Titles</span>
                <span>{team.driversChampionships ?? 0}</span>
              </div>
              <div className="team-stat highlight">
                <span>Championship Points</span>
                <span>{standings[team.teamId] ?? 0} pts</span>
              </div>
            </div>
            <div className="team-card-footer">
              <span className="team-card-link">View Team →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}