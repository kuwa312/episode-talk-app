import React, { useEffect, useState } from "react";
import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
} from "firebase/firestore";
import { db } from "../firebase";


const Friends = ({ isAuth }) => {
    const [friendsList, setFriendsList] = useState([]);
    const [username, setUsername] = useState("");

    // 50音順でソートする関数
    const sortFriends = (list) => {
        return list.sort((a, b) => a.username.localeCompare(b.username, "ja"));
    };

    // 初回レンダリングでデータ取得
    useEffect(() => {
        const getFriends = async () => {
            const data = await getDocs(collection(db, "friends"));
            const list = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setFriendsList(sortFriends(list));
        };
        getFriends();
    }, []);

    // 友達追加
    const addFriend = async () => {
        if (!username) return;
        const docRef = await addDoc(collection(db, "friends"), { username });
        const newList = [...friendsList, { username, id: docRef.id }];
        setFriendsList(sortFriends(newList));
        setUsername("");
    };

    // 友達削除
    const deleteFriend = async (id) => {
        const confirmDelete =
            window.confirm("本当にこの友達を削除していいですか？");
        if (!confirmDelete) return;

        await deleteDoc(doc(db, "friends", id));
        const newList = friendsList.filter((friend) => friend.id !== id);
        setFriendsList(sortFriends(newList));
    };

    useEffect(() => {
        if (!isAuth) {
            navigate("/login");
        }
    }, []);

    return (
        <div>
            <div className="page  lg:max-w-[700px]">
                <h2 className="text-center text-2xl">ともだち一覧</h2>
                <div className="flex gap-2" >
                    <input
                        className="flex-1"
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
