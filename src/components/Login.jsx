import { signInWithPopup } from 'firebase/auth';
import React from 'react'
import { auth, provider } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsAuth }) => {
  const navigate = useNavigate();

  const loginInWithGoogle = () => {
    // GoogleでLogin
    signInWithPopup(auth, provider).then((result) => {

      const user = result.user;

      localStorage.setItem("isAuth", true);

      localStorage.setItem("uid", user.uid);
      localStorage.setItem("username", user.displayName);

      setIsAuth(true);
      navigate("/");

    });
  };

  return (
    <div className="page">
      <div className="card mt-10">
        <p className="text-lg mb-4 text-center">ログインして始める</p>
        <button className='btn-blue' onClick={loginInWithGoogle}>Googleでログイン</button>
      </div>
    </div>
  )
}

export default Login;