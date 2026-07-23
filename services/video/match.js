// services/video/match.js
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

import { joinQueue } from "./queue";

// Create a new match between two users
export async function createMatch(user1, user2) {
  const matchRef = push(ref(db, "videoMatches"));
  const matchId = matchRef.key;

  await set(matchRef, {
    user1,
    user2,
    createdAt: Date.now(),
  });

  await set(ref(db, `videoUserMatches/${user1}`), matchId);
  await set(ref(db, `videoUserMatches/${user2}`), matchId);

  // Safe even if one user isn't in the queue
  await remove(ref(db, `videoWaitingQueue/${user1}`));
  await remove(ref(db, `videoWaitingQueue/${user2}`));

  return matchId;
}

// End a match
export async function endMatch(matchId) {
  const matchSnap = await get(ref(db, `videoMatches/${matchId}`));
  if (!matchSnap.exists()) return;

  const { user1, user2 } = matchSnap.val();

  await remove(ref(db, `videoUserMatches/${user1}`));
  await remove(ref(db, `videoUserMatches/${user2}`));

  // Optional cleanup
  await remove(ref(db, `videoMessages/${matchId}`));
  await remove(ref(db, `signals/${matchId}`));
  await remove(ref(db, `waves/${matchId}`));

  await remove(ref(db, `videoMatches/${matchId}`));
}

// Listen for match
export function listenForMatch(userId, callback) {
  return onValue(
    ref(db, `videoUserMatches/${userId}`),
    async (snapshot) => {
      const matchId = snapshot.val();

      if (!matchId) {
        callback(null);
        return;
      }

      try {
        const matchSnap = await get(
          ref(db, `videoMatches/${matchId}`)
        );

        if (!matchSnap.exists()) {
          await remove(ref(db, `videoUserMatches/${userId}`));
          callback(null);
          return;
        }

        callback({
          matchId,
          ...matchSnap.val(),
        });
      } catch (err) {
        console.error(err);
        callback(null);
      }
    }
  );
}

// Find stranger and create match
export async function findAndMatch(userId) {
  const queueRef = ref(db, "videoWaitingQueue");

  for (let i = 0; i < 5; i++) {
    const snap = await get(queueRef);

    // Nobody waiting
    if (!snap.exists()) {
      await joinQueue(userId);
      return null;
    }

    const users = Object.keys(snap.val());

    const strangerId = users.find((id) => id !== userId);

    // Only ourselves
    if (!strangerId) {
      await joinQueue(userId);
      return null;
    }

    // Atomically claim the stranger
    const tx = await runTransaction(queueRef, (current) => {
      if (!current) return current;

      if (!current[strangerId]) {
        return current;
      }

      const updated = { ...current };
      delete updated[strangerId];

      return updated;
    });

    if (!tx.committed) {
      continue;
    }

    const matchId = await createMatch(userId, strangerId);

    return {
      matchId,
      strangerId,
    };
  }

  await joinQueue(userId);
  return null;
}