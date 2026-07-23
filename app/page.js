"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="chat-main">
      <div className="home-container">
        <h1 className="home-title">
          Welcome to ChatViper
        </h1>

        <p className="home-description">
          ChatViper lets you connect instantly with random people from around the world through anonymous text conversations.
          No registration is required—just click the button below and start chatting.
          Meet new people, make friends, share ideas, or simply enjoy a casual conversation while staying completely anonymous.
        </p>

       <div
  style={{
    display: "flex",
    gap: "15px",
    justifyContent: "center",
    marginTop: "30px",
  }}
>
  <button
    className="home-button"
    onClick={() => router.push("/chat")}
  >
    Start Text Chat
  </button>

  <button
    className="home-button"
    onClick={() => router.push("/video")}
  >
    Start Video Chat
  </button>
</div>
      </div>
    </div>
  );
}