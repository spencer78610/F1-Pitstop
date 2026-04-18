import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Drivers from "./pages/Drivers";
import Races from "./pages/Races";
import Favourites from "./pages/Favourites";
import RaceDetail from "./pages/RaceDetail";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/races" element={<Races />} />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/races/:raceId" element={<RaceDetail />} />
      </Routes>
    </>
  );
}