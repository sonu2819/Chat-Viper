// services/wave.js
import { db } from "@/lib/firebase";
import { ref, set, onValue, remove } from "firebase/database";

// Send a wave to the other user in the match
export async function sendWave(matchId, userId) {
  if (!matchId || !userId) return;
  const waveRef = ref(db, `waves/${matchId}/${userId}`);
  await set(waveRef, {
    timestamp: Date.now(),
    sender: userId,
  });
  // Auto-clear after 2 seconds (optional – we'll clear on receive side after showing)
  // But we'll let the receive side clear after display.
}

// Listen for waves from the other user (exclude self)
export function listenForWaves(matchId, selfUserId, callback) {
  const waveRef = ref(db, `waves/${matchId}`);
  return onValue(waveRef, (snapshot) => {
    if (!snapshot.exists()) return;
    const data = snapshot.val();
    // Find wave from the other user (not self)
    for (const [userId, waveData] of Object.entries(data)) {
      if (userId !== selfUserId) {
        // Trigger callback with the wave data
        callback(waveData);
        // Remove this wave after displaying (optional)
        // We'll remove it after the animation is shown in the component
        // For now, we just call callback and let component handle removal.
        // But we can remove it immediately to avoid re-trigger.
        // We'll remove it after callback to prevent multiple triggers.
        remove(ref(db, `waves/${matchId}/${userId}`)).catch(console.error);
        break; // only one wave at a time
      }
    }
  });
}