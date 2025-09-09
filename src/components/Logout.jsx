import { signInWithPopup, signOut } from "firebase/auth";
import React from "react";
import { auth, provider } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./logout.css"

const Logout = ({ setIsAuth }) => {
  const navigate = useNavigate();
  const logout = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      setIsAuth(false);
      navigate("/login");
    });
  };

  return (
    <div>
      <p>ログアウトする</p>
      <button className="btn-blue" onClick={logout}>ログアウト</button>
    </div>
  );
};

export default Logout;
