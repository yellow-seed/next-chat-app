import { useEffect, useRef, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { formatRelative } from "date-fns";
import ChatRoom from "./chatRoom";

export default function ChatGroup(props) {
  const db = props.db;
  const user = props.user;
  // const { uid, displayName } = props.user;

  const [groups, setGroups] = useState([]);
  const [newGroup, setNewGroup] = useState("");
  const [selectedGroup, setSelectedGroup] = useState({});

  useEffect(() => {
    db.collection("chatGroups")
      .orderBy("createdAt")
      .limit(100)
      .onSnapshot((querySnapShot) => {
        const data = querySnapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setGroups(data);
      });
  }, [db]);

  const handleSubmit = (e) => {
    e.preventDefault();

    db.collection("chatGroups").add({
      displayName,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

  const showSelectedGroup = (group) => {
    console.log(group);
    setSelectedGroup(group);
  };

  return (
    <main id="chat_group">
      <ul>
        {groups.map((group) => (
          <li key={group.id}>
            <section>
              {group.displayName ? <span onClick={() => showSelectedGroup(group)}>{group.displayName}</span> : null}
              <br />
            </section>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newGroup}
          onChange={(e) => setNewGroup(e.target.value)}
          placeholder="Type your group here..."
        />

        <button type="submit" disabled={!newGroup}>
          グループを作成
        </button>
      </form>
      <section id="selected_group">
        {/* ここに上で選択したGroupに紐づくChatRoomをおきたい */}
        {selectedGroup ? (
          <>
            <ChatRoom user={user} db={db}/>
          </>
        ) : (
          <>
          </>
        )}
      </section>
    </main>
  );
}