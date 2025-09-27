import { signInWithPopup, signInAnonymously } from 'firebase/auth';
import { collection, addDoc } from "firebase/firestore";
import React from 'react'
import { auth, provider, db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsAuth }) => {
  const navigate = useNavigate();


  // ゲストログイン用の初期データ
  const defaultFriends = [
    { username: "太郎" },
    { username: "花子" },
    { username: "John" },
  ];

  // 初期データをdbに追加
  const initFriends = async (uid) => {
    const friendsRef = collection(db, `users/${uid}/friends`);
    for (const friend of defaultFriends) {
      await addDoc(friendsRef, friend);
    }
  };

  const loginInWithGoogle = () => {
    signInWithPopup(auth, provider).then((result) => {
      const user = result.user;
      localStorage.setItem("isAuth", "true");
      localStorage.setItem("uid", user.uid);
      localStorage.setItem("username", user.displayName);
      setIsAuth(true);
      navigate("/");
    });
  };

  // 匿名ログイン
  const loginAnonymously = () => {
    signInAnonymously(auth)
      .then(async (result) => {
        const user = result.user;
        localStorage.setItem("isAuth", "true");
        localStorage.setItem("uid", user.uid);
        localStorage.setItem("username", "ゲストユーザー");

        // 初期データを必ず追加
        await initFriends(user.uid);

        setIsAuth(true);
        navigate("/");
      })
      .catch((err) => alert(err.message));
  };


  return (
    <div className="page">
      <div className="card mt-10">
        <p className="text-lg mb-4 text-center">ログインして始める</p>
        <button className='btn-blue' onClick={loginInWithGoogle}>Googleでログイン</button>
        <button className='btn-gray' onClick={loginAnonymously}>ゲストとして試す</button>
      </div>
    </div>
  )
}

export default Login;