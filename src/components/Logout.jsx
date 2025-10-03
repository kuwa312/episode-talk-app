import { signOut } from "firebase/auth";
import React from "react";
import { auth } from "../firebase";
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
      <div className="logoutCard mt-10">
        <p className="text-lg mb-4 text-center">ログアウトする</p>
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
