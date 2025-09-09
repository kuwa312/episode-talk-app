import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import "./SearchEpisode.css";

const SearchEpisode = () => {
  const [friendsList, setFriendsList] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  // 初期データ取得
  useEffect(() => {
    const fetchData = async () => {
      // friends
      const friendsSnap = await getDocs(collection(db, "friends"));
      setFriendsList(
        friendsSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );

      // posts
      const postsSnap = await getDocs(collection(db, "posts"));
      setPosts(postsSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    fetchData();
  }, []);

  // フィルタ処理
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

      // 選んだ友達すべてが talkedTo に含まれていない
      return selectedFriends.every((friendId) => !talkedIds.includes(friendId));
    });

    setFilteredPosts(result);
  };


  // 友達のチェック切り替え
  const handleFriendChange = (friendId) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  return (
    <div className="searchEpisode">
      <h2>エピソードトーク検索</h2>

      <div>まだ話していない友達（複数選択可）</div>
      <div className="friendsCheckboxes">
        {friendsList.map((friend) => (
          <label key={friend.id} className="friendOption">
            <input
              type="checkbox"
              checked={selectedFriends.includes(friend.id)}
              onChange={() => handleFriendChange(friend.id)}
            />
            {friend.username}
          </label>
        ))}
      </div>

      <div className="buttonGroup">
        <button onClick={handleSearch}>検索</button>
      </div>

      <h3>検索結果</h3>
      <div className="results">
        {filteredPosts.length === 0 ? (
          <p>該当するエピソードトークはありません。</p>
        ) : (
          filteredPosts.map((post) => (
            <div key={post.id} className="postCard">
              <h4>{post.title}</h4>
              <p>{post.postsText}</p>
              <p className="talkedTo">
                話した友達:{" "}
                {(post.talkedTo || [])
                  .map((item) => {
                    if (typeof item === "string") {
                      // 旧仕様: 文字列ID
                      return (
                        friendsList.find((f) => f.id === item)?.username || ""
                      );
                    } else if (item.friendId) {
                      // 新仕様: { friendId, rating }
                      return (
                        friendsList.find((f) => f.id === item.friendId)
                          ?.username || ""
                      );
                    }
                    return "";
                  })
                  .filter((name) => name) // 空文字を除去
                  .join(", ")}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchEpisode;
