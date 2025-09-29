import React, { useEffect, useState } from "react";
import "../index.css";
import { addDoc, collection, getDoc, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

const CreatePost = ({ isAuth }) => {
  const [title, setTitle] = useState();
  const [postText, setPostText] = useState();
  const [tagname, setTagname] = useState("");
  const [tagsList, setTagsList] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const navigate = useNavigate();



  useEffect(() => {
    // const dummyTags = [
    //   { id: "1", name: "友達" },
    //   { id: "2", name: "学校" },
    //   { id: "3", name: "旅行" },
    // ];
    // setTagsList(dummyTags);

    const fetchTags = async () => {
      if (!isAuth) {
        navigate("/login");
      }
      const data = await getDocs(collection(db, "tags"));
      setTagsList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }

    fetchTags();

  }, [isAuth, navigate]);

  // 選択状態を切り替え
  const handleTagsChange = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId) // 選択解除
        : [...prev, tagId] // 追加
    );
  };

  const addTag = async () => {
    if (tagname === "") return;

    const docRef = await addDoc(collection(db, "tags"), {
      name: tagname,
    });

    const newList = [...tagsList, { id: docRef.id, name: tagname }];
    setTagsList(newList);
    setTagname("");
  }

  // 更新処理
    const createPost = async () => {

    if (!auth.currentUser) return;
    await addDoc(
      collection(db, `users/${auth.currentUser.uid}/posts`),
      {
        title: title || "",
        postsText: postText || "",
        tags: selectedTags,
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
        <div>タグを選択</div>


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
                  {tag.name}
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
            placeholder="追加するタグ"
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
