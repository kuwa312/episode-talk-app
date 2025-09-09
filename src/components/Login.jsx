import { signInWithPopup } from 'firebase/auth';
import React from 'react'
import { auth, provider } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsAuth }) => {
  const navigate = useNavigate();

  const loginInWithGoogle = () => {
    // GoogleでLogin
    signInWithPopup(auth, provider).then((result) => {
      localStorage.setItem("isAuth", true);
      setIsAuth(true);
      navigate("/");

    });
  };

  return (
    <div className="page">
      <div className="card">
        <p className="text-lg mb-4">ログインして始める</p>
        <button className='btn-blue' onClick={loginInWithGoogle}>Googleでログイン</button>
      </div>
    </div>
  )
}

export default Login;