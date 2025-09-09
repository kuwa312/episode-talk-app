import { signInWithPopup, signOut } from "firebase/auth";
import React from "react";
import { auth, provider } from "../firebase";
import { useNavigate } from "react-router-dom";


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
    <div className="page">
      <div className="card">
        <p className="text-lg mb-4">ログアウトする</p>
        <button
          onClick={logout}
          className="btn-blue"
        >
          ログアウト
        </button>
      </div>
    </div>
  );
};

export default Logout;
