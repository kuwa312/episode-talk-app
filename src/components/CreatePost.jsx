import React, { useEffect, useState } from "react";
import "../index.css";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

const CreatePost = ({ isAuth }) => {
  const [title, setTitle] = useState();
  const [postText, setPostText] = useState();
  const [tagname, setTagname] = useState("");
  const [tagsList, setTagsList] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const [friendsList, setFriendsList] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);



  const navigate = useNavigate();



  useEffect(() => {
    // const dummyTags = [
    //   { id: "1", tagname: "友達" },
    //   { id: "2", tagname: "学校" },
    //   { id: "3", tagname: "旅行" },
    // ];
    // setTagsList(dummyTags);

    const fetchFriends = async () => {
      if (!auth.currentUser) return;
      const data = await getDocs(collection(db, `users/${auth.currentUser.uid}/friends`));
      setFriendsList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };


    const fetchTags = async () => {
      if (!isAuth) {
        navigate("/login");
      }
      const data = await getDocs(collection(db, `users/${auth.currentUser.uid}/tags`));
      setTagsList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }

    fetchTags();
    fetchFriends();

  }, [isAuth, navigate]);

  const handleFriendChange = (friendId) => {
    setSelectedFriends((prev) => {
      const exists = prev.find((f) => f.friendId === friendId);
      if (exists) {
        return prev.filter((f) => f.friendId !== friendId);
      } else {
        return [...prev, { friendId, rating: 3 }];
      }
    });
  };


  const handleRatingChange = (friendId, rating) => {
    setSelectedFriends((prev) =>
      prev.map((f) =>
        f.friendId === friendId ? { ...f, rating: Number(rating) } : f
      )
    );
  };

  const handleTagsChange = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const addTag = async () => {
    if (tagname === "") return;

    const docRef = await addDoc(collection(db, `users/${auth.currentUser.uid}/tags`), {
      tagname: tagname,
    });

    const newList = [...tagsList, { id: docRef.id, tagname: tagname }];
    setTagsList(newList);
    setTagname("");
  }

  const createPost = async () => {

    if (!auth.currentUser) return;
    await addDoc(
      collection(db, `users/${auth.currentUser.uid}/posts`),
      {
        title: title || "",
        postsText: postText || "",
        tags: selectedTags,
        talkedTo: selectedFriends,
        author: {
          username: auth.currentUser.displayName,
          id: auth.currentUser.uid,
        },
        createdAt: new Date(),
      }
    );

    navigate("/");
  };



  return (
    <div className="page">
      <h1 className="text-center text-2xl">エピソードトークを追加する</h1>
      <div className="card">
        <div className="flex flex-col gap-2">
          <div>タイトル</div>
          <input className="input p-2"
            type="text"
            placeholder="タイトルを記入"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div>内容</div>
          <textarea className="textarea"
            placeholder="内容を記入"
            onChange={(e) => setPostText(e.target.value)}
          ></textarea>
        </div>

        <div>話した友達（複数選択 & 評価）</div>
        <div className="flex flex-wrap gap-3 mx-0 my-0">
          {friendsList.map((friend) => {
            const selected = selectedFriends.find(
              (f) => f.friendId === friend.id
            );
            return (
              <div key={friend.id} className="flex items-center gap-3 bg-gray-100 friendOption px-1 py-2 md:px-2 md:py-3 rounded-lg shadow-sm translate-colors hover:bg-gray-200 text-sm md:text-base">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!selected}
                    onChange={() => handleFriendChange(friend.id)}
                  />
                  {friend.username}
                </label>
                {selected && (
                  <select className="px-2 py-1 rounded-md border border-gray-300 text-sm md:text-base bg-white ml-0 md:ml-1"
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


        <div>タグを選択(複数選択可)</div>
        <div className="flex flex-wrap gap-3 mx-0 my-0">
          {tagsList.map((tag) => {
            const selected = selectedTags.includes(tag.id);
            return (
              <div key={tag.id} className="flex items-center gap-3 bg-gray-100 friendOption px-1 py-2 md:px-2 md:py-3 rounded-lg shadow-sm translate-colors hover:bg-gray-200 text-sm md:text-base">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!selected}
                    onChange={() => handleTagsChange(tag.id)}
                  />
                  {tag.tagname}
                </label>
              </div>
            );
          })}
        </div>
        <div className="flex gap-2" >
          <input
            className="input flex-1"
            type="text"
            value={tagname}
            placeholder="タグを新規作成"
            onChange={(e) => setTagname(e.target.value)}
          />
          <button className="btn-blue" onClick={addTag}>タグを追加</button>
        </div>

        <button className="btn-blue" onClick={createPost}>
          追加する
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
