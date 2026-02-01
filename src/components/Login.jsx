import { signInWithPopup, signInAnonymously } from 'firebase/auth';
import { collection, addDoc } from "firebase/firestore";
import React from 'react'
import { auth, provider, db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsAuth }) => {
  const navigate = useNavigate();


  // ゲストログイン用の初期データ
  const defaultFriends = [
    { username: "山田" },
    { username: "田中" },
    { username: "矢井" },
  ];

  const defaultTags = [
    { tagname: "殿堂入り👑" },
    { tagname: "超ウケた🤣🤣" },
    { tagname: "ウケた🤣" },
  ];

  const defaultPosts = (friendsIds, tagIds) => [
    {
      title: "スンドゥブの豆腐落として洗ったら溶けてなくなった話",
      postsText: "",
      createdAt: new Date(),
      talkedTo: [
        { friendId: friendsIds[0], rating: 4 },
        { friendId: friendsIds[1], rating: 5 },
      ],
      tags: [tagIds[0]],
    },
    {
      title: "「取り皿」を注文したら「鶏から」が来た話",
      postsText: "",
      createdAt: new Date(),
      talkedTo: [
        { friendId: friendsIds[1], rating: 3 },
        { friendId: friendsIds[2], rating: 2 },
      ],
      tags: [tagIds[2]],
    },
    {
      title: "妹が修学旅行でいびきのうるさい友達の口にシールを貼ろうとした話",
      postsText: "",
      createdAt: new Date(),
      talkedTo: [
        { friendId: friendsIds[2], rating: 4 },
      ],
      tags: [tagIds[1]],
    },
  ];

  const initData = async (uid) => {
    // まず friends を追加して ID を控える
    const friendsRef = collection(db, `users/${uid}/friends`);
    const friendIds = [];
    for (const friend of defaultFriends) {
      const ref = await addDoc(friendsRef, friend);
      friendIds.push(ref.id);
    }

    const tagsRef = collection(db, `users/${uid}/tags`);
    const tagIds = [];
    for (const tag of defaultTags) {
      const ref = await addDoc(tagsRef, tag);
      tagIds.push(ref.id);
    }

    // posts を追加 (talkedTo と tags を紐付ける)
    const postsRef = collection(db, `users/${uid}/posts`);
    for (const post of defaultPosts(friendIds, tagIds)) {
      await addDoc(postsRef, {
        ...post,
        author: {
          username: "ゲストユーザー",
          id: uid,
        },
        // createdAt: serverTimestamp(),
      });
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

  // ゲストログイン
  const loginAnonymously = () => {
    signInAnonymously(auth)
      .then(async (result) => {
        const user = result.user;
        localStorage.setItem("isAuth", "true");
        localStorage.setItem("uid", user.uid);
        localStorage.setItem("username", "ゲストユーザー");

        // 初期データを追加
        await initData(user.uid);

        setIsAuth(true);
        navigate("/");
      })
      .catch((err) => alert(err.message));
  };


  return (
    <div className="page">
      <div className="loginCard mt-10">
        <p className="text-lg mb-4 text-center">ログインして始める</p>
        <button className='btn-blue' onClick={loginInWithGoogle}>Googleでログイン</button>
        <button className='btn-gray' onClick={loginAnonymously}>ゲストとして試す</button>
      </div>
    </div>
  )
}

export default Login;