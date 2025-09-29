import React, { useEffect, useState } from "react";
import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
} from "firebase/firestore";

import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

import { onAuthStateChanged } from "firebase/auth";



const Tags = ({ isAuth }) => {
    const [tagsList, setTagsList] = useState([]);
    const [tagname, setTagname] = useState("");
    const navigate = useNavigate();

    // 50音順でソートする関数
    const sortTags = (list) => {
        return list.sort((a, b) => a.tagname.localeCompare(b.tagname, "ja"));
    };



    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const data = await getDocs(
                    collection(db, `users/${user.uid}/tags`)
                );
                const list = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                setTagsList(sortTags(list));
            } else {
                setTagsList([]); // ログアウト時は空
            }
        });

        return () => unsubscribe();
    }, []);


    const addTag = async () => {

        if (!tagname || !auth.currentUser) return;

        const docRef = await addDoc(collection(db, `users/${auth.currentUser.uid}/tags`), { tagname });

        const newList = [...tagsList, { tagname, id: docRef.id }];
        setTagsList(sortTags(newList));
        setTagname("");
    };

    const deleteTag = async (id) => {

        if (!auth.currentUser) return;

        const confirmDelete =
            window.confirm("本当にこのタグを削除していいですか？");
        if (!confirmDelete) return;

        await deleteDoc(doc(db, `users/${auth.currentUser.uid}/tags`, id));
        const newList = tagsList.filter((tag) => tag.id !== id);
        setTagsList(sortTags(newList));
    };

    useEffect(() => {
        if (!isAuth) {
            navigate("/login");
        }
    }, [isAuth, navigate]);

    return (
        <div>
            <div className="page  lg:max-w-[700px]">
                <h2 className="text-center text-2xl">タグ一覧</h2>
                <div className="flex gap-2" >
                    <input
                        className="input flex-1"
                        type="text"
                        value={tagname}
                        placeholder="追加するタグ"
                        onChange={(e) => setTagname(e.target.value)}
                    />
                    <button className="btn-blue" onClick={addTag}>追加</button>
                </div>

                <ul className="flex flex-col gap-2">
                    {tagsList.map((tag) => (
                        <li key={tag.id}
                            className="flex justify-between items-center
         px-2.5 py-1.5 text-sm
         sm:px-3 sm:py-2 sm:text-sm
         md:text-base
         border border-gray-300 rounded-lg bg-gray-50"
                        >
                            {tag.tagname ? tag.tagname : "No Name"}
                            <button className="btn-red" onClick={() => deleteTag(tag.id)}>削除</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Tags;
