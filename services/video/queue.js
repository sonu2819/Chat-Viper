// services/queue.js
import { db } from "@/lib/firebase";
import { ref, set, remove, get, onDisconnect } from "firebase/database";

// Add user to waiting queue and auto-remove on disconnect
export async function joinQueue(userId) {
  console.log("JOIN VIDEO QUEUE");
  console.log("Path:", `videoWaitingQueue/${userId}`);

  const queueRef = ref(db, `videoWaitingQueue/${userId}`);
  await set(queueRef, { joinedAt: Date.now() });
  await onDisconnect(queueRef).remove();
}
// Remove user from waiting queue manually
export async function leaveQueue(userId) {
  await remove(ref(db, `videoWaitingQueue/${userId}`));
}

// Check if a user is currently in the waiting queue
export async function isInQueue(userId) {
  const snap = await get(ref(db, `videoWaitingQueue/${userId}`));
  return snap.exists();
}

// Get all waiting users (for debugging or admin)
export async function getWaitingUsers() {
  const snap = await get(ref(db, "videoWaitingQueue"));
  return snap.exists() ? snap.val() : {};
}