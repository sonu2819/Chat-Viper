"use client";

import { useEffect, useState, useRef } from "react";
import { ref, get, remove } from "firebase/database";
import { db } from "@/lib/firebase";

import { listenForMatch, endMatch, findAndMatch } from "@/services/match";
import { joinQueue } from "@/services/queue";
import { sendMessage, listenMessages } from "@/services/messages";

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
    <main style={styles.main}>
      <div style={styles.container}>
        <h1 style={styles.statusTitle}>{status}</h1>
        {isSearching && <div style={styles.spinner}>⏳ Searching...</div>}

        {match ? (
          <>
            <div style={styles.chatBox}>
              {messages.length === 0 ? (
                <p style={styles.emptyMessage}>Say hello 👋</p>
              ) : (
                messages.map((msg) => {
                  // System message styling
                  if (msg.isSystem) {
                    return (
                      <div key={msg.id} style={styles.systemMessage}>
                        {msg.text}
                      </div>
                    );
                  }
                  return (
                    <div
                      key={msg.id}
                      style={{
                        ...styles.messageWrapper,
                        justifyContent:
                          msg.senderId === userId ? "flex-end" : "flex-start",
                      }}
                    >
                      <div
                        style={{
                          ...styles.bubble,
                          background:
                            msg.senderId === userId ? "#2563eb" : "#374151",
                        }}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div style={styles.inputRow}>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
                style={styles.input}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button onClick={handleSend} style={styles.sendBtn}>
                Send
              </button>
              <button onClick={handleNext} style={styles.nextBtn}>
                Next
              </button>
            </div>
          </>
        ) : (
          <div style={styles.waitingContainer}>
            <p style={styles.waitingText}>
              {isSearching
                ? "Searching..."
                : "No match yet. Press Next to find someone."}
            </p>
            {!isSearching && (
              <button onClick={handleNext} style={styles.findBtn}>
                Find a stranger
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

// Styles
const styles = {
  main: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#111827",
    color: "#fff",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
  },
  container: {
    width: "100%",
    maxWidth: "600px",
    background: "#1f2937",
    borderRadius: "12px",
    padding: "24px",
    boxSizing: "border-box",
  },
  statusTitle: {
    fontSize: "1.5rem",
    marginBottom: "0.5rem",
    textAlign: "center",
  },
  spinner: {
    textAlign: "center",
    margin: "1rem 0",
    color: "#9ca3af",
  },
  chatBox: {
    height: "350px",
    overflowY: "auto",
    background: "#111827",
    borderRadius: "10px",
    padding: "15px",
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
  },
  emptyMessage: {
    color: "#6b7280",
    textAlign: "center",
    marginTop: "auto",
    marginBottom: "auto",
  },
  messageWrapper: {
    display: "flex",
    marginBottom: "12px",
  },
  bubble: {
    color: "#fff",
    padding: "10px 14px",
    borderRadius: "15px",
    maxWidth: "70%",
    wordBreak: "break-word",
  },
  systemMessage: {
    textAlign: "center",
    color: "#9ca3af",
    fontSize: "0.9rem",
    margin: "8px 0",
    fontStyle: "italic",
  },
  inputRow: {
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    outline: "none",
    fontSize: "1rem",
  },
  sendBtn: {
    padding: "12px 20px",
    borderRadius: "8px",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },
  nextBtn: {
    padding: "12px 20px",
    borderRadius: "8px",
    border: "none",
    background: "#ef4444",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },
  waitingContainer: {
    textAlign: "center",
    padding: "2rem 0",
  },
  waitingText: {
    color: "#9ca3af",
    marginBottom: "1rem",
  },
  findBtn: {
    padding: "12px 24px",
    borderRadius: "8px",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1rem",
  },
};