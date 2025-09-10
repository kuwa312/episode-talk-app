import React, { useEffect, useState } from "react";
import "../index.css";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

const CreatePost = ({ isAuth }) => {
  const [title, setTitle] = useState();
  const [postText, setPostText] = useState();

  const navigate = useNavigate();

  const createPost = async () => {
    await addDoc(collection(db, "posts"), {
      title: title || "",
      postsText: postText || "",
      author: {
        username: auth.currentUser.displayName,
        id: auth.currentUser.uid,
      },
    });

    navigate("/");
    q;
  };

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="page">
      <h1 className="text-center text-2xl">エピソードトークを追加する</h1>
      <div className="card">
        <div className="flex flex-col gap-2">
          <div>タイトル</div>
          <input className="p-2"
            type="text"
            placeholder="タイトルを記入"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div>内容</div>
          <textarea
            placeholder="内容を記入"
            onChange={(e) => setPostText(e.target.value)}
          ></textarea>
        </div>
        <button className="btn-blue" onClick={createPost}>
          追加する
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
