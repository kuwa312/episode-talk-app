import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import CreatePost from "./components/CreatePost";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Navbar from "./components/Navbar";
import { useState } from "react";
import Friends from "./components/Friends";
import Edit from "./components/Edit";
import SearchEpisode from "./components/SearchEpisode";

function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth") === "true");


  return (
    <Router>
      <Navbar isAuth={isAuth} />
      <Routes>
        <Route path="/" element={<Home isAuth={isAuth} />}></Route>
        <Route path="/createpost" element={<CreatePost isAuth={isAuth} />}></Route>
        <Route path="/friends" element={<Friends isAuth={isAuth} />}></Route>
        <Route path="/search" element={<SearchEpisode isAuth={isAuth} />}></Route>
        <Route path="/login" element={<Login setIsAuth={setIsAuth} />}></Route>
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/logout" element={<Logout setIsAuth={setIsAuth} />}></Route>
      </Routes>

    </Router>
  );
}

export default App;
