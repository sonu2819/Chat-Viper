// import { db } from "@/lib/firebase";

// import {
//   ref,
//   set,
//   remove,
//   get,
// } from "firebase/database";

// import { createMatch } from "./match";


// // Add user to waiting queue
// export async function joinQueue(userId) {
//   await set(ref(db, `waitingQueue/${userId}`), {
//     joinedAt: Date.now(),
//   });
// }


// // Remove user from waiting queue
// export async function leaveQueue(userId) {
//   await remove(ref(db, `waitingQueue/${userId}`));
// }


// // Find new stranger
// export async function findNewStranger(userId) {
//   await joinQueue(userId);

//   setTimeout(() => {
//     tryMatch(userId);
//   }, 500);
// }


// // Try matching
// export async function tryMatch(userId) {
//   const snapshot = await get(ref(db, "waitingQueue"));

//   if (!snapshot.exists()) return;

//   const users = Object.keys(snapshot.val());

//   console.log("Waiting users:", users);

//   if (users.length < 2) return;


//   const stranger = users.find(
//     (id) => id !== userId
//   );


//   if (!stranger) return;


//   console.log(
//     "Creating match:",
//     userId,
//     stranger
//   );


//   await createMatch(
//     userId,
//     stranger
//   );


//   console.log(
//     "Match created successfully"
//   );
// }

// services/queue.js
import { db } from "@/lib/firebase";
import { ref, set, remove, get, onDisconnect } from "firebase/database";

// Add user to waiting queue and auto-remove on disconnect
export async function joinQueue(userId) {
  const queueRef = ref(db, `waitingQueue/${userId}`);
  await set(queueRef, { joinedAt: Date.now() });
  // Automatically remove from queue if client disconnects
  await onDisconnect(queueRef).remove();
}

// Remove user from waiting queue manually
export async function leaveQueue(userId) {
  await remove(ref(db, `waitingQueue/${userId}`));
}

// Check if a user is currently in the waiting queue
export async function isInQueue(userId) {
  const snap = await get(ref(db, `waitingQueue/${userId}`));
  return snap.exists();
}

// Get all waiting users (for debugging or admin)
export async function getWaitingUsers() {
  const snap = await get(ref(db, "waitingQueue"));
  return snap.exists() ? snap.val() : {};
}