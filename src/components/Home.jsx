import React, { useEffect, useState } from "react";
import "./Home.css";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [postList, setPostList] = useState([]);
  const [friendsMap, setFriendsMap] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      // posts
      const postData = await getDocs(collection(db, "posts"));
      const posts = postData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

      // friends
      const friendData = await getDocs(collection(db, "friends"));
      const friends = friendData.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      // {id: username} のマップを作成
      const map = {};
      friends.forEach((f) => {
        map[f.id] = f.username;
      });

      setFriendsMap(map);
      setPostList(posts);
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("本当に削除していいですか？");
    if (!confirmDelete) return;

    await deleteDoc(doc(db, "posts", id));
    setPostList((prev) => prev.filter((post) => post.id !== id));
  };

  const handleEdit = (post) => {
    navigate(`/edit/${post.id}`, { state: { post } });
  };

  // 話した友達の名前を取得
  const getFriendNames = (talkedTo = []) => {
    if (talkedTo.length === 0) return "";

    // オブジェクト配列 or 文字列配列を判定
    if (typeof talkedTo[0] === "string") {
      return talkedTo.map((id) => friendsMap[id] || "不明な友達").join("、");
    } else {
      return talkedTo
        .map((item) => friendsMap[item.friendId] || "不明な友達")
        .join("、");
    }
  };

  // 平均評価を計算
  const getAverageRating = (talkedTo = []) => {
    if (talkedTo.length === 0) return null;
    if (typeof talkedTo[0] === "string") return null; // 古いデータは評価なし

    const ratings = talkedTo.map((item) => item.rating || 0);
    const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    return avg.toFixed(1); // 小数1桁で表示
  };

  if (postList.length === 0) {
    return <div className="noEpisode">エピソードが存在しません</div>;
  }

  // useEffect(() => {
  //   if (!isAuth) {
  //     navigate("/login");
  //   }
  // }, []);

  return (
    <div className="homePage">
      {postList.map((post) => {
        const avgRating = getAverageRating(post.talkedTo);

        return (
          <div className="postContents" key={post.id}>
            <div className="postHeader">
              <h1>{post.title}</h1>
            </div>

            <div className="postTextContainer">{post.postsText}</div>

            {/* 話した友達と平均評価を表示 */}
            {post.talkedTo && post.talkedTo.length > 0 && (
              <div className="talkedTo">
                <strong>話した友達:</strong> {getFriendNames(post.talkedTo)}
                {avgRating && (
                  <span className="avgRating">（おもしろさ: {avgRating}）</span>
                )}
              </div>
            )}

            <div className="buttons">
              {post.author.id === auth.currentUser?.uid && (
                <>
                  <button onClick={() => handleEdit(post)}>編集</button>
                  <button onClick={() => handleDelete(post.id)}>削除</button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
