"use client";

import styles from "./video.module.css";
import { useEffect, useRef, useState } from "react";
import { get, ref } from "firebase/database";
import { db } from "@/lib/firebase";

import {
  createPeerConnection,
  createOffer,
  createAnswer,
  listenOffer,
  listenAnswer,
  closePeerConnection,
  getPeerConnection,
  listenIceCandidates,
} from "@/services/webrtc";

import {
  findAndMatch,
  listenForMatch,
  endMatch,
} from "@/services/match";

import {
  sendWave,
  listenForWaves,
} from "@/services/wave";

export default function VideoPage() {
  const [userId, setUserId] = useState("");
  const [match, setMatch] = useState(null);
  const [status, setStatus] = useState("Looking for stranger...");
  const [isConnecting, setIsConnecting] = useState(false);
  const [showWave, setShowWave] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);

  const listenersRef = useRef([]);
  const matchListenerUnsub = useRef(null);
  const currentMatchIdRef = useRef(null);

  const waveListenerUnsub = useRef(null);
  const waveTimeoutRef = useRef(null);

  function generateId() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }

    return (
      Date.now().toString(36) +
      Math.random().toString(36).slice(2)
    );
  }

  function cleanup() {
    if (localStreamRef.current) {
      localStreamRef.current
        .getTracks()
        .forEach((track) => track.stop());

      localStreamRef.current = null;
    }

    closePeerConnection();

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    listenersRef.current.forEach((unsub) => {
      if (typeof unsub === "function") {
        unsub();
      }
    });

    listenersRef.current = [];

    if (waveTimeoutRef.current) {
      clearTimeout(waveTimeoutRef.current);
      waveTimeoutRef.current = null;
    }

    setShowWave(false);

    if (waveListenerUnsub.current) {
      waveListenerUnsub.current();
      waveListenerUnsub.current = null;
    }
  }

  function setupWaveListener(matchId, selfId) {
    if (waveListenerUnsub.current) {
      waveListenerUnsub.current();
      waveListenerUnsub.current = null;
    }

    const unsub = listenForWaves(
      matchId,
      selfId,
      () => {
        setShowWave(true);

        if (waveTimeoutRef.current) {
          clearTimeout(waveTimeoutRef.current);
        }

        waveTimeoutRef.current = setTimeout(() => {
          setShowWave(false);
          waveTimeoutRef.current = null;
        }, 1500);
      }
    );

    waveListenerUnsub.current = unsub;
    listenersRef.current.push(unsub);
  }

  async function handleWave() {
    if (!match || !match.matchId) return;

    await sendWave(match.matchId, userId);

    setShowWave(true);

    if (waveTimeoutRef.current) {
      clearTimeout(waveTimeoutRef.current);
    }

    waveTimeoutRef.current = setTimeout(() => {
      setShowWave(false);
      waveTimeoutRef.current = null;
    }, 1500);
  }

  async function setupWebRTC(matchData, userId) {
    try {
      if (
        currentMatchIdRef.current ===
        matchData.matchId
      ) {
        console.log(
          "Already setting up this match, skipping"
        );
        return;
      }

      currentMatchIdRef.current =
        matchData.matchId;

      cleanup();

      const localStream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

      localStreamRef.current = localStream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject =
          localStream;
      }

      const pc =
        createPeerConnection(remoteVideoRef);

      localStream
        .getTracks()
        .forEach((track) =>
          pc.addTrack(track, localStream)
        );

      pc.matchId = matchData.matchId;
      pc.side =
        matchData.user1 === userId
          ? "user1"
          : "user2";

      const iceUnsub =
        listenIceCandidates(
          matchData.matchId,
          pc.side
        );

      listenersRef.current.push(iceUnsub);

      if (pc.side === "user1") {
        await createOffer(matchData.matchId);

        const answerUnsub =
          listenAnswer(matchData.matchId);

        listenersRef.current.push(answerUnsub);
      } else {
        const offerUnsub =
          listenOffer(
            matchData.matchId,
            async (offer) => {
              await createAnswer(
                matchData.matchId,
                offer
              );
            }
          );

        listenersRef.current.push(offerUnsub);
      }

      setupWaveListener(
        matchData.matchId,
        userId
      );

      setStatus("Connected");
      setIsConnecting(false);
    } catch (err) {
      console.error(
        "WebRTC setup error:",
        err
      );

      setStatus("Error: " + err.message);
      setIsConnecting(false);
    }
  }

  async function startNewChat(userId) {
    setIsConnecting(true);
    setStatus("Looking for stranger...");

    currentMatchIdRef.current = null;

    cleanup();

    try {
      const result =
        await findAndMatch(userId);

      if (result) {
        const matchSnap = await get(
          ref(
            db,
            `matches/${result.matchId}`
          )
        );

        if (matchSnap.exists()) {
          const matchData = {
            matchId: result.matchId,
            ...matchSnap.val(),
          };

          setMatch(matchData);

          await setupWebRTC(
            matchData,
            userId
          );

          return;
        }
      }

      setStatus("Waiting for a stranger...");
      setIsConnecting(false);
    } catch (err) {
      console.error(
        "Error finding match:",
        err
      );

      setStatus("Error: " + err.message);
      setIsConnecting(false);
    }
  }

  async function handleNext() {
    if (isConnecting) return;

    const id =
      sessionStorage.getItem("userId");

    if (!id) return;

    if (match && match.matchId) {
      await endMatch(match.matchId);
    }

    currentMatchIdRef.current = null;

    await startNewChat(id);
  }

  useEffect(() => {
    let id =
      sessionStorage.getItem("userId");

    if (!id) {
      id = generateId();

      sessionStorage.setItem(
        "userId",
        id
      );
    }

    setUserId(id);

    const unsub =
      listenForMatch(
        id,
        async (matchData) => {
          if (matchData) {
            if (
              currentMatchIdRef.current !==
              matchData.matchId
            ) {
              setMatch(matchData);

              setStatus(
                "Match found, connecting..."
              );

              await setupWebRTC(
                matchData,
                id
              );
            }
          } else {
            setMatch(null);

            setStatus(
              "Stranger disconnected"
            );

            currentMatchIdRef.current =
              null;

            cleanup();

            setIsConnecting(false);
          }
        }
      );

    matchListenerUnsub.current = unsub;

    startNewChat(id);

    return () => {
      cleanup();

      if (matchListenerUnsub.current) {
        matchListenerUnsub.current();
        matchListenerUnsub.current =
          null;
      }
    };
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <h1>Video Chat</h1>

        <p className={styles.status}>
          {status}
        </p>
      </div>

      <div className={styles.videos}>
        <div className={styles.remoteBox}>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
          />

          <div className={styles.localBox}>
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
            />
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <button
          onClick={handleNext}
          disabled={isConnecting}
          className={`${styles.button} ${styles.next} ${
            isConnecting
              ? styles.disabled
              : ""
          }`}
        >
          {isConnecting
            ? "Connecting..."
            : "Next"}
        </button>

        <button
          onClick={handleWave}
          disabled={
            !match || !match.matchId
          }
          className={`${styles.button} ${styles.wave} ${
            !match || !match.matchId
              ? styles.disabled
              : ""
          }`}
        >
          👋 Wave
        </button>
      </div>

      {showWave && (
        <div
          className={styles.waveOverlay}
        >
          👋
        </div>
      )}
    </div>
  );
}