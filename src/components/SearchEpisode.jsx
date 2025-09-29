import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const SearchEpisode = () => {
  const [friendsList, setFriendsList] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        console.log("未ログインです");
        return;
      }

      console.log("ログインユーザー:", user);

      // 自分の友達
      const friendsSnap = await getDocs(
        collection(db, `users/${user.uid}/friends`)
      );
      const friends = friendsSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setFriendsList(friends);

      // 自分の投稿
      const postsSnap = await getDocs(
        collection(db, `users/${user.uid}/posts`)
      );
      const postsData = postsSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setPosts(postsData);

      // 初期は全件表示
      setFilteredPosts(postsData);
    });

    return () => unsubscribe();
  }, []);


  const handleSearch = () => {
    if (selectedFriends.length === 0) {
      setFilteredPosts(posts);
      return;
    }

    const result = posts.filter((post) => {
      const talkedTo = post.talkedTo || [];
      const talkedIds = talkedTo.map((t) =>
        typeof t === "string" ? t : t.friendId
      );
      return selectedFriends.every((friendId) => !talkedIds.includes(friendId));
    });

    setFilteredPosts(result);
  };

  const handleFriendChange = (friendId) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleEdit = (post) => {
    navigate(`/edit/${post.id}`, { state: { post } });
  };


  return (
    <div className="page p-4">
      <h1 className="text-center text-2xl mb-4">エピソードトーク検索</h1>

      <div className="mb-2">まだ話していない友達（複数選択可）</div>
      <div className="flex flex-wrap gap-3 mb-4">
        {friendsList.map((friend) => (
          <label
            key={friend.id}
            className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-md text-base cursor-pointer hover:bg-gray-200 transition"
          >
            <input
              type="checkbox"
              checked={selectedFriends.includes(friend.id)}
              onChange={() => handleFriendChange(friend.id)}
            />
            {friend.username}
          </label>
        ))}
      </div>

      <div className="buttonGroup flex gap-3 mb-4">
        <button className="btn-blue" onClick={handleSearch}>
          検索
        </button>
      </div>

      <h3 className="text-lg font-semibold mb-2">検索結果</h3>
      <div className="flex flex-col gap-4">
        {filteredPosts.length === 0 ? (
          <p>該当するエピソードトークはありません。</p>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="p-4 border border-gray-300 rounded-lg bg-white shadow-sm"
            >
              <h4 className="mb-1 text-lg sm:text-base md:text-lg">{post.title}</h4>
              <p className="mb-1 text-base sm:text-sm md:text-base">{post.postsText}</p>
              <p className="text-sm text-gray-600">
                話した友達:{" "}
                {(post.talkedTo || [])
                  .map((item) => {
                    if (typeof item === "string") {
                      return friendsList.find((f) => f.id === item)?.username || "";
                    } else if (item.friendId) {
                      return friendsList.find((f) => f.id === item.friendId)?.username || "";
                    }
                    return "";
                  })
                  .filter((name) => name)
                  .join(", ")}
              </p>
              <button className="btn-blue-sm mt-2" onClick={() => handleEdit(post)}>編集</button>

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchEpisode;
