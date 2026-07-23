import { db } from "@/lib/firebase";
import { ref, set, push, onValue } from "firebase/database";

let peerConnection = null;

const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export function createPeerConnection(remoteVideoRef) {
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }

  peerConnection = new RTCPeerConnection(configuration);

  peerConnection.onicecandidate = async (event) => {
    if (!event.candidate) return;
    const matchId = peerConnection.matchId;
    const side = peerConnection.side;
    if (!matchId || !side) return;

    await push(
      ref(db, `signals/${matchId}/${side}Candidates`),
      event.candidate.toJSON()
    );
    console.log("ICE Candidate Sent");
  };

  peerConnection.ontrack = (event) => {
    console.log("Remote stream received");
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = event.streams[0];
    }
  };

  return peerConnection;
}

export function getPeerConnection() {
  return peerConnection;
}

export function closePeerConnection() {
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }
}

// ---------- OFFER ----------
export async function createOffer(matchId) {
  const pc = getPeerConnection();
  if (!pc) throw new Error("No peer connection");

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  await set(ref(db, `signals/${matchId}/offer`), offer);
  console.log("Offer Created");
}

export function listenOffer(matchId, callback) {
  let processed = false;

  return onValue(ref(db, `signals/${matchId}/offer`), (snapshot) => {
    if (!snapshot.exists() || processed) return;

    const pc = getPeerConnection();
    if (!pc) return;

    // If already have remote description or state is stable, skip
    if (pc.signalingState === "stable" && pc.currentRemoteDescription) {
      console.log("Skipping offer – already in stable state");
      return;
    }

    processed = true;
    callback(snapshot.val());
  });
}

// ---------- ANSWER ----------
export async function createAnswer(matchId, offer) {
  const pc = getPeerConnection();
  if (!pc) throw new Error("No peer connection");

  if (
    pc.currentRemoteDescription &&
    pc.currentRemoteDescription.sdp === offer.sdp
  ) {
    console.log("Answer already created");
    return;
  }

  await pc.setRemoteDescription(new RTCSessionDescription(offer));
  console.log("Remote description set");

  flushBufferedCandidates(pc);

  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);

  await set(ref(db, `signals/${matchId}/answer`), answer);

  console.log("Answer Created");
}

export function listenAnswer(matchId) {
  let processed = false;

  return onValue(ref(db, `signals/${matchId}/answer`), async (snapshot) => {
    if (!snapshot.exists() || processed) return;

    const pc = getPeerConnection();
    if (!pc) return;

    // If already in stable state and remote description exists, skip
    if (pc.signalingState === "stable" && pc.currentRemoteDescription) {
      console.log("Skipping answer – already in stable state");
      return;
    }

    // If same SDP already set, skip
    if (
      pc.currentRemoteDescription &&
      pc.currentRemoteDescription.sdp === snapshot.val().sdp
    ) {
      console.log("Remote answer already set, skipping");
      return;
    }

    processed = true;

    try {
      await pc.setRemoteDescription(
        new RTCSessionDescription(snapshot.val())
      );
      console.log("Answer Received");

      flushBufferedCandidates(pc);
    } catch (err) {
      console.error("Failed to set remote answer:", err);
    }
  });
}

// ---------- ICE CANDIDATES (with buffering) ----------
const candidateBuffers = new WeakMap();

function getCandidateBuffer(pc) {
  if (!candidateBuffers.has(pc)) {
    candidateBuffers.set(pc, {
      candidates: [],
      flushed: false,
    });
  }

  return candidateBuffers.get(pc);
}

function flushBufferedCandidates(pc) {
  const buffer = candidateBuffers.get(pc);

  if (!buffer || buffer.flushed) return;

  buffer.candidates.forEach(async (candidate) => {
    try {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
      console.log("Buffered ICE Candidate Added");
    } catch (err) {
      console.error("Failed to add buffered ICE candidate:", err);
    }
  });

  buffer.candidates = [];
  buffer.flushed = true;
}

export function listenIceCandidates(matchId, side) {
  const pc = getPeerConnection();

  if (!pc) return () => {};

  const otherSide = side === "user1" ? "user2" : "user1";
  const processed = new Set();
  const buffer = getCandidateBuffer(pc);

  return onValue(
    ref(db, `signals/${matchId}/${otherSide}Candidates`),
    (snapshot) => {
      if (!snapshot.exists()) return;

      snapshot.forEach((child) => {
        const key = child.key;

        if (processed.has(key)) return;
        processed.add(key);

        const candidateData = child.val();
        const candidate = new RTCIceCandidate(candidateData);

        if (pc.remoteDescription && pc.remoteDescription.type) {
          pc.addIceCandidate(candidate).catch((err) => {
            console.error("Failed to add ICE candidate:", err);

            // Fallback: buffer it
            buffer.candidates.push(candidateData);
          });
        } else {
          console.log(
            "Buffering ICE candidate until remote description is set"
          );
          buffer.candidates.push(candidateData);
        }
      });
    }
  );
}