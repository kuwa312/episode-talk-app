import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [postList, setPostList] = useState([]);
  const [friendsMap, setFriendsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setPostList([]);
        setFriendsMap({});
        setLoading(false);
        navigate("/login");
        return;
      }

      setUser(currentUser);

      const postsSnapshot = await getDocs(
        collection(db, `users/${auth.currentUser.uid}/posts`)
      );
      const posts = postsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

      const friendsSnapshot = await getDocs(
        collection(db, `users/${auth.currentUser.uid}/friends`)
      );
      const friends = friendsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

      const map = {};
      friends.forEach(f => map[f.id] = f.username);
      setFriendsMap(map);

      setFriendsMap(map);
      setPostList(posts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("本当に削除していいですか？");
    if (!confirmDelete) return;

    await deleteDoc(doc(db, `users/${auth.currentUser.uid}/posts`, id));
    setPostList((prev) => prev.filter((post) => post.id !== id));
  };

  const handleEdit = (post) => {
    navigate(`/edit/${post.id}`, { state: { post } });
  };

  const getFriendNames = (talkedTo = []) => {
    if (talkedTo.length === 0) return "";
    if (typeof talkedTo[0] === "string") {
      return talkedTo.map((id) => friendsMap[id] || "不明な友達").join("、");
    } else {
      return talkedTo
        .map((item) => friendsMap[item.friendId] || "不明な友達")
        .join("、");
    }
  };

  const getAverageRating = (talkedTo = []) => {
    if (talkedTo.length === 0) return null;
    if (typeof talkedTo[0] === "string") return null;
    const ratings = talkedTo.map((item) => item.rating || 0);
    const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    return avg.toFixed(1);
  };

  if (loading) {
    return <div className="page text-center mt-10">読み込み中…</div>;
  }

  if (!user) {
    return <div className="page text-center mt-10">ユーザーがいません</div>;
  }

  if (postList.length === 0) {
    return <div className="page text-center mt-10 text-lg text-gray-500">エピソードが存在しません</div>;
  }

  return (
    <div className="page">
      <h1 className="text-center text-2xl">エピソードトーク一覧</h1>
      {postList.map((post) => {
        const avgRating = getAverageRating(post.talkedTo);

        return (
          <div className="card" key={post.id}>
            <div>
              <h1 className="text-base sm:text-lg md:text-xl break-words">{post.title}</h1>
            </div>

            <div className="text-base leading-relaxed whitespace-pre-wrap break-words max-sm:text-sm">{post.postsText}</div>

            {post.talkedTo && post.talkedTo.length > 0 && (
              <div className="text-sm text-gray-600">
                <strong>話した友達:</strong> {getFriendNames(post.talkedTo)}
                {avgRating && (
                  <span className="ml-2 font-bold text-orange-400">（おもしろさ: {avgRating}）</span>
                )}
              </div>
            )}

            <div className="flex gap-2.5 mt-2 max-sm:gap-1.5">
              {post.author.id === user.uid && (
                <>
                  <button className="btn-blue" onClick={() => handleEdit(post)}>編集</button>
                  <button className="btn-red" onClick={() => handleDelete(post.id)}>削除</button>
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
