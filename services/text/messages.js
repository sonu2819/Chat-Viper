import { db } from "@/lib/firebase";
import { ref, push, set, onValue } from "firebase/database";

export async function sendMessage(matchId, senderId, text) {
  const messageRef = push(ref(db, `matches/${matchId}/messages`));
  await set(messageRef, {
    senderId,
    text,
    createdAt: Date.now(),
  });
}

export function listenMessages(matchId, callback) {
  const messagesRef = ref(db, `matches/${matchId}/messages`);
  return onValue(messagesRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }
    const data = snapshot.val();
    const messages = Object.entries(data).map(([id, msg]) => ({
      id,
      ...msg,
    }));
    callback(messages);
  });
}