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



const Friends = ({ isAuth }) => {
    const [friendsList, setFriendsList] = useState([]);
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    // 50音順でソートする関数
    const sortFriends = (list) => {
        return list.sort((a, b) => a.username.localeCompare(b.username, "ja"));
    };


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const data = await getDocs(
                    collection(db, `users/${user.uid}/friends`)
                );
                const list = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                setFriendsList(sortFriends(list));
            } else {
                setFriendsList([]); // ログアウト時は空
            }
        });

        return () => unsubscribe();
    }, []);


    const addFriend = async () => {

        if (!username || !auth.currentUser) return;

        const docRef = await addDoc(collection(db, `users/${auth.currentUser.uid}/friends`), { username });

        const newList = [...friendsList, { username, id: docRef.id }];
        setFriendsList(sortFriends(newList));
        setUsername("");
    };

    const deleteFriend = async (id) => {

        if (!auth.currentUser) return;

        const confirmDelete =
            window.confirm("本当にこの友達を削除していいですか？");
        if (!confirmDelete) return;

        await deleteDoc(doc(db, `users/${auth.currentUser.uid}/friends`, id));
        const newList = friendsList.filter((friend) => friend.id !== id);
        setFriendsList(sortFriends(newList));
    };

    useEffect(() => {
        if (!isAuth) {
            navigate("/login");
        }
    }, [isAuth, navigate]);

    return (
        <div>
            <div className="page  lg:max-w-[700px]">
                <h2 className="text-center text-2xl">ともだち一覧</h2>
                <div className="flex gap-2" >
                    <input
                        className="input flex-1"
                        type="text"
                        value={username}
                        placeholder="追加するともだち"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <button className="btn-blue" onClick={addFriend}>追加</button>
                </div>

                <ul className="flex flex-col gap-2">
                    {friendsList.map((friend) => (
                        <li
                            class="flex justify-between items-center
         px-2.5 py-1.5 text-sm
         sm:px-3 sm:py-2 sm:text-sm
         md:text-base
         border border-gray-300 rounded-lg bg-gray-50"
                        >
                            {friend.username ? friend.username : "No Name"}
                            <button className="btn-red" onClick={() => deleteFriend(friend.id)}>削除</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Friends;
