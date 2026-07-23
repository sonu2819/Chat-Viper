import { db } from "@/lib/firebase";
import { ref, push, set, onValue } from "firebase/database";

export async function sendMessage(matchId, senderId, text) {
  const messageRef = push(ref(db, `videoMessages/${matchId}`));

  await set(messageRef, {
    senderId,
    text,
    createdAt: Date.now(),
  });
}

export function listenMessages(matchId, callback) {
  const messagesRef = ref(db, `videoMessages/${matchId}`);

  return onValue(messagesRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }

    const data = snapshot.val();

    const videoMessages = Object.entries(data).map(([id, msg]) => ({
      id,
      ...msg,
    }));

    callback(videoMessages);
  });
}