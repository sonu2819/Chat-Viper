"use client";
import styles from './chat.module.css'
import ChatMenu from "@/components/ChatMenu";
import { useEffect, useState, useRef } from "react";
import { ref, get, remove } from "firebase/database";
import { db } from "@/lib/firebase";
import { FiSend, FiSkipForward, FiSearch } from "react-icons/fi";

import { listenForMatch, endMatch, findAndMatch } from "@/services/text/match";
import { joinQueue } from "@/services/text/queue";
import { sendMessage, listenMessages } from "@/services/text/messages";

export default function ChatPage() {
  const [userId, setUserId] = useState("");
  const [match, setMatch] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [status, setStatus] = useState("Looking for a stranger...");
  const [isSearching, setIsSearching] = useState(false);

  const unsubscribeMatchRef = useRef(null);
  const unsubscribeMessagesRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Helper to clean up listeners
  const cleanupListeners = () => {
    if (unsubscribeMatchRef.current) {
      unsubscribeMatchRef.current();
      unsubscribeMatchRef.current = null;
    }
    if (unsubscribeMessagesRef.current) {
      unsubscribeMessagesRef.current();
      unsubscribeMessagesRef.current = null;
    }
  };

  // Helper to add a system message (e.g., when stranger leaves)
  const addSystemMessage = (text) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `system-${Date.now()}`,
        senderId: "system",
        text,
        isSystem: true,
        createdAt: Date.now(),
      },
    ]);
  };

  useEffect(() => {
    let isMounted = true;

    async function init() {
      let id = sessionStorage.getItem("userId");
      if (!id) {
        id = crypto.randomUUID();
        sessionStorage.setItem("userId", id);
      }
      setUserId(id);

      // Check for existing match
      try {
        const matchIdSnap = await get(ref(db, `userMatches/${id}`));
        if (matchIdSnap.exists()) {
          const matchId = matchIdSnap.val();
          const matchSnap = await get(ref(db, `matches/${matchId}`));
          if (matchSnap.exists()) {
            const matchData = matchSnap.val();
            if (isMounted) {
              setMatch({ matchId, ...matchData });
              setStatus("🎉 Connected.");
              // Listen to messages
              unsubscribeMessagesRef.current = listenMessages(matchId, (msgs) => {
                if (isMounted) setMessages(msgs);
              });
            }
            return;
          } else {
            // Clean orphan
            await remove(ref(db, `userMatches/${id}`));
          }
        }
      } catch (error) {
        console.error("Error resuming match:", error);
      }

      // No match – join queue and try to match
      setIsSearching(true);
      setStatus("Looking for a stranger...");
      await joinQueue(id);
      const result = await findAndMatch(id);
      setIsSearching(false);

      if (result) {
        const { matchId } = result;
        const matchSnap = await get(ref(db, `matches/${matchId}`));
        if (matchSnap.exists()) {
          if (isMounted) {
            setMatch({ matchId, ...matchSnap.val() });
            setStatus("🎉 Connected.");
            unsubscribeMessagesRef.current = listenMessages(matchId, (msgs) => {
              if (isMounted) setMessages(msgs);
            });
          }
        }
      } else {
        // Waiting in queue
        if (isMounted) {
          setStatus("Waiting for someone to join...");
          unsubscribeMatchRef.current = listenForMatch(id, (data) => {
            if (!data) {
              // Stranger disconnected (this should not happen while waiting, but just in case)
              setMatch(null);
              setStatus("Stranger disconnected. Press Next to find a new chat.");
              addSystemMessage("Stranger has left the chat.");
              if (unsubscribeMessagesRef.current) {
                unsubscribeMessagesRef.current();
                unsubscribeMessagesRef.current = null;
              }
              return;
            }
            setMatch(data);
            setStatus("🎉 Connected.");
            if (unsubscribeMessagesRef.current) {
              unsubscribeMessagesRef.current();
            }
            unsubscribeMessagesRef.current = listenMessages(data.matchId, (msgs) => {
              if (isMounted) setMessages(msgs);
            });
          });
        }
      }
    }

    init();

    return () => {
      isMounted = false;
      cleanupListeners();
      // Queue removal handled by onDisconnect
    };
  }, []);

  async function handleSend() {
    if (!text.trim() || !match) return;
    await sendMessage(match.matchId, userId, text);
    setText("");
  }

  async function handleNext() {
    // Clear listeners
    cleanupListeners();

    // End current match if any
    if (match) {
      // The other user will see the match disappear; they will get a system message
      await endMatch(match.matchId);
      setMatch(null);
      setMessages([]);
    }

    // Start searching
    setIsSearching(true);
    setStatus("Looking for a new stranger...");
    setMessages([]);

    await joinQueue(userId);
    const result = await findAndMatch(userId);
    setIsSearching(false);

    if (result) {
      const { matchId } = result;
      const matchSnap = await get(ref(db, `matches/${matchId}`));
      if (matchSnap.exists()) {
        setMatch({ matchId, ...matchSnap.val() });
        setStatus("🎉 Connected.");
        unsubscribeMessagesRef.current = listenMessages(matchId, (msgs) => {
          setMessages(msgs);
        });
      }
    } else {
      setStatus("Waiting for a stranger...");
      // Listen for match via listenForMatch
      unsubscribeMatchRef.current = listenForMatch(userId, (data) => {
        if (!data) {
          // This case can happen if the stranger disconnects while we are waiting
          setMatch(null);
          setStatus("Stranger disconnected. Press Next to find a new chat.");
          addSystemMessage("Stranger has left the chat.");
          return;
        }
        setMatch(data);
        setStatus("🎉 Connected.");
        if (unsubscribeMessagesRef.current) {
          unsubscribeMessagesRef.current();
        }
        unsubscribeMessagesRef.current = listenMessages(data.matchId, (msgs) => {
          setMessages(msgs);
        });
      });
    }
  }



  return (
  <div className={styles.chatPage}>

   


    <div className={styles.chatContainer}>
      
<div className={styles.chatHeader}>
  <ChatMenu />

  <h1 className={styles.chatStatusTitle}>
    {status}
  </h1>
</div>

      {isSearching && (
        <div className={styles.chatSpinner}>
          ⏳ Searching...
        </div>
      )}
      

      {match ? (
        <>
          <div className={styles.chatBox}>

            {messages.length === 0 ? (
              <p className={styles.chatEmptyMessage}>
                Say hello 👋
              </p>
            ) : (
              messages.map((msg) => {

                if (msg.isSystem) {
                  return (
                    <div
                      key={msg.id}
                      className={styles.chatSystemMessage}
                    >
                      {msg.text}
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={styles.chatMessageWrapper}
                    style={{
                      justifyContent:
                        msg.senderId === userId
                          ? "flex-end"
                          : "flex-start",
                    }}
                  >
                    <div
                      className={`${styles.chatBubble} ${
                        msg.senderId === userId
                          ? styles.sent
                          : styles.received
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );

              })
            )}

            <div ref={messagesEndRef} />

          </div>

          <div className={styles.chatInputRow}>

            <button
              className={styles.chatSendBtn}
              onClick={handleSend}
            >
              Send
            </button>

            <input
              className={styles.chatInput}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
            />

            <button
              className={styles.chatNextBtn}
              onClick={handleNext}
            >
              Next
            </button>

          </div>
        </>
      ) : (
        <div className={styles.chatWaitingContainer}>

          <p className={styles.chatWaitingText}>
            {isSearching
              ? "Searching..."
              : "No match yet. Press Next to find someone."}
          </p>

          {!isSearching && (
            <button
              className={styles.chatFindBtn}
              onClick={handleNext}
            >
              Find a stranger
            </button>
          )}

        </div>
      )}

    </div>
  </div>
);

}