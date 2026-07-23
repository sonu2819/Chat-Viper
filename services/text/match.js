// services/match.js
import { db } from "@/lib/firebase";
import {
  ref,
  push,
  set,
  remove,
  get,
  runTransaction,
  onValue,
} from "firebase/database";

// ✅ Add this import to fix the error
import { joinQueue } from "./queue";

// Create a new match between two users, and store match ID under each user
export async function createMatch(user1, user2) {
  const matchRef = push(ref(db, "matches"));
  const matchId = matchRef.key;

  await set(matchRef, {
    user1,
    user2,
    createdAt: Date.now(),
  });

  await set(ref(db, `userMatches/${user1}`), matchId);
  await set(ref(db, `userMatches/${user2}`), matchId);

  await remove(ref(db, `waitingQueue/${user1}`));
  await remove(ref(db, `waitingQueue/${user2}`));

  return matchId;
}

// End a match – delete match and user references
export async function endMatch(matchId) {
  const matchSnap = await get(ref(db, `matches/${matchId}`));
  if (!matchSnap.exists()) return;

  const match = matchSnap.val();
  const { user1, user2 } = match;

  await remove(ref(db, `userMatches/${user1}`));
  await remove(ref(db, `userMatches/${user2}`));
  await remove(ref(db, `matches/${matchId}`));
}

// Listen for the current match of a user
export function listenForMatch(userId, callback) {
  const userMatchRef = ref(db, `userMatches/${userId}`);
  return onValue(userMatchRef, async (snapshot) => {
    const matchId = snapshot.val();
    if (!matchId) {
      callback(null);
      return;
    }

    try {
      const matchSnap = await get(ref(db, `matches/${matchId}`));
      if (!matchSnap.exists()) {
        await remove(ref(db, `userMatches/${userId}`));
        callback(null);
        return;
      }
      callback({ matchId, ...matchSnap.val() });
    } catch (error) {
      console.error("Error fetching match:", error);
      callback(null);
    }
  });
}

// Atomic matching with retry
export async function findAndMatch(userId) {
  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    attempts++;

    const queueSnap = await get(ref(db, "waitingQueue"));
    if (!queueSnap.exists()) {
      // Queue empty – add self and wait
      await joinQueue(userId);
      return null;
    }

    const users = Object.keys(queueSnap.val());
    const strangerId = users.find((id) => id !== userId);
    if (!strangerId) {
      // Only self in queue
      await joinQueue(userId);
      return null;
    }

    const queueRef = ref(db, "waitingQueue");
    const result = await runTransaction(queueRef, (currentData) => {
      if (!currentData) return currentData;
      if (!(userId in currentData) || !(strangerId in currentData)) {
        return currentData; // someone already taken, abort
      }
      const newData = { ...currentData };
      delete newData[userId];
      delete newData[strangerId];
      return newData;
    });

    if (result.committed) {
      const matchId = await createMatch(userId, strangerId);
      return { matchId, strangerId };
    } else {
      // Transaction aborted – someone else took one of them, retry
      continue;
    }
  }

  // If we couldn't match after max attempts, just join the queue
  await joinQueue(userId);
  return null;
}