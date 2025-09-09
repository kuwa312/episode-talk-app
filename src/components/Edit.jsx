import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import "./Edit.css";

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [postsText, setPostsText] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [friendsList, setFriendsList] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  // [{ friendId: "xxx", rating: 3 }, ...]

  // 投稿データと友達データを取得
  useEffect(() => {
    const fetchPost = async () => {
      const postRef = doc(db, "posts", id);
      const postSnap = await getDoc(postRef);

      if (postSnap.exists()) {
        const postData = postSnap.data();
        setTitle(postData.title);
        setPostsText(postData.postsText);
        setAuthorId(postData.author.id);
        setSelectedFriends(postData.talkedTo || []);
      } else {
        alert("投稿が見つかりません。");
        navigate("/");
      }
    };

    const fetchFriends = async () => {
      const data = await getDocs(collection(db, "friends"));
      setFriendsList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    fetchPost();
    fetchFriends();
  }, [id, navigate]);

  // 友達の選択状態を切り替え
  const handleFriendChange = (friendId) => {
    setSelectedFriends((prev) => {
      const exists = prev.find((f) => f.friendId === friendId);
      if (exists) {
        // すでに選択されていれば削除
        return prev.filter((f) => f.friendId !== friendId);
      } else {
        // 新しく選択 → rating初期値は3にしておく
        return [...prev, { friendId, rating: 3 }];
      }
    });
  };

  // 評価を変更
  const handleRatingChange = (friendId, rating) => {
    setSelectedFriends((prev) =>
      prev.map((f) =>
        f.friendId === friendId ? { ...f, rating: Number(rating) } : f
      )
    );
  };

  // 更新処理
  const handleUpdate = async () => {
    if (authorId !== auth.currentUser?.uid) {
      alert("この投稿を編集する権限がありません。");
      return;
    }

    const postRef = doc(db, "posts", id);
    await updateDoc(postRef, {
      title,
      postsText,
      talkedTo: selectedFriends, // 評価込みで保存
    });

    navigate("/");
  };

  return (
    <div className="editPage">
      <h2>エピソードトークを編集</h2>

      <div>タイトル</div>
      <input
        type="text"
        value={title}
        placeholder="タイトル"
        onChange={(e) => setTitle(e.target.value)}
      />

      <div>内容</div>
      <textarea
        value={postsText}
        placeholder="本文"
        onChange={(e) => setPostsText(e.target.value)}
      />

      <div>話した友達（複数選択 & 評価）</div>
      <div className="friendsCheckboxes">
        {friendsList.map((friend) => {
          const selected = selectedFriends.find(
            (f) => f.friendId === friend.id
          );
          return (
            <div key={friend.id} className="friendOption">
              <label>
                <input
                  type="checkbox"
                  checked={!!selected}
                  onChange={() => handleFriendChange(friend.id)}
                />
                {friend.username}
              </label>
              {selected && (
                <select
                  value={selected.rating}
                  onChange={(e) =>
                    handleRatingChange(friend.id, e.target.value)
                  }
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              )}
            </div>
          );
        })}
      </div>

      <div className="buttonGroup">
        <button onClick={handleUpdate}>更新</button>
        <button onClick={() => navigate("/")}>キャンセル</button>
      </div>
    </div>
  );
};

export default Edit;
