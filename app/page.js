"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="app-main">
      <div className="home-container">
        <h1 className="home-title">
          Welcome to ChatViper
        </h1>

        <p className="home-description">
          ChatViper lets you connect instantly with random people from around the world through anonymous text conversations.
          No registration is required—just click the button below and start chatting.
          Meet new people, make friends, share ideas, or simply enjoy a casual conversation while staying completely anonymous.
        </p>

        <button
          className="home-button"
          onClick={() => router.push("/chat")}
        >
          Start Text Chat
        </button>
      </div>
    </main>
  );
}