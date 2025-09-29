import React, { useEffect, useState } from "react";
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

const Tags = ({ isAuth }) => {
    const [tagsList, setTagsList] = useState([]);
    const [tagname, setTagname] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuth) {
            navigate("/login");
            return;
        }

        if (!auth.currentUser) return;

        // tags コレクションをリアルタイムで監視
        const tagsRef = collection(db, `users/${auth.currentUser.uid}/tags`);
        const q = query(tagsRef, orderBy("name")); // 50音順にソート
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setTagsList(list);
        });

        return () => unsubscribe();
    }, [isAuth, navigate]);

    const addTag = async () => {
        if (!tagname || !auth.currentUser) return;

        await addDoc(collection(db, `users/${auth.currentUser.uid}/tags`), { tagname });
        setTagname("");
        // onSnapshot が自動で反映してくれるので setTagsList は不要
    };

    const deleteTag = async (id) => {
        if (!auth.currentUser) return;

        const confirmDelete = window.confirm("本当にこのタグを削除していいですか？");
        if (!confirmDelete) return;

        await deleteDoc(doc(db, `users/${auth.currentUser.uid}/tags`, id));
        // onSnapshot が自動で反映してくれる
    };

    return (
        <div>
            <div className="page lg:max-w-[700px]">
                <h2 className="text-center text-2xl">タグ一覧</h2>
                <div className="flex gap-2">
                    <input
                        className="input flex-1"
                        type="text"
                        value={tagname}
                        placeholder="追加するタグ"
                        onChange={(e) => setTagname(e.target.value)}
                    />
                    <button className="btn-blue" onClick={addTag}>追加</button>
                </div>

                <ul className="flex flex-col gap-2 mt-2">
                    {tagsList.map(tag => (
                        <li key={tag.id} className="flex justify-between items-center
                            px-2.5 py-1.5 text-sm
                            sm:px-3 sm:py-2 sm:text-sm
                            md:text-base
                            border border-gray-300 rounded-lg bg-gray-50"
                        >
                            {tag.name || "No Name"}
                            <button className="btn-red" onClick={() => deleteTag(tag.id)}>削除</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Tags;
