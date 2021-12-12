import { useEffect, useRef, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { formatRelative } from "date-fns";

export default function ChatRoom(props) {
  // constants
  const db = props.db;
  const dummySpace = useRef();
  // user details
  const { uid, displayName, photoURL } = props.user;
  const { id, groupName } = props.group;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // automatically check db for new messages
  useEffect(() => {
    // ログアウトしたときにunsubscribeしたい
    // const collection = db.collection("messages").orderBy("createdAt").limit(100)
    // const unsubsctibe = collection.onSnapshot((querySnapShot) => {
    //   const data = querySnapShot.docs.map((doc) => ({
    //     ...doc.data(),
    //     id: doc.id,
    //   }));
    // });

    // firestore で groupに紐づくメッセージを取得するように変更
    db.collection("chatRooms")
      .doc(id)
      .collection("messages")
      .orderBy("createdAt")
      .limit(100)
      .onSnapshot((querySnapShot) => {
        const data = querySnapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setMessages(data);
      });
  }, [db]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO groupの下にmessageがつくようにする
    db.collection("chatRooms")
      .doc(id)
      .collection("messages")
      .add({
        text: newMessage,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        displayName,
        photoURL,
    });

    setNewMessage("");

    // scroll down the chat
    dummySpace.current.scrollIntoView({ behavor: "smooth" });
  };

  console.log(props.group);

  return (
    <main id="chat_room">
      <ul>
        {messages.map((message) => (
          <li key={message.id} className={message.uid === uid ? "sent" : "received"}>
            <section>
              {/* display user image */}
              {message.photoURL ? (
                <img
                  src={message.photoURL}
                  alt="Avatar"
                  width={45}
                  height={45}
                />
              ) : null}
            </section>
            <section>
              {/* display message text */}
              <p>{message.text}</p>

              {/* display user name */}
              {message.displayName ? <span>{message.displayName}</span> : null}
              <br />
              {/* display message date and time */}
              {message.createdAt?.seconds ? (
                <span>
                  {formatRelative(
                    new Date(message.createdAt.seconds * 1000),
                    new Date()
                  )}
                </span>
              ) : null}
            </section>
          </li>
        ))}
      </ul>
      <section ref={dummySpace}></section>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message here..."
        />

        <button type="submit" disabled={!newMessage}>
          Send
        </button>
      </form>
    </main>
  );
}