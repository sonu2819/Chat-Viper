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

  <div className="home-buttons">
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

  {/* Why ChatViper */}

  <section className="home-section">

    <h2>Why Choose ChatViper?</h2>

    <p>
      ChatViper is designed for fast, anonymous conversations.
      There's no sign-up, no profile creation, and no personal information required.
      Simply open the website and start chatting with someone new in seconds.
    </p>

  </section>

  {/* Features */}

  <section className="home-section">

    <h2>Features</h2>

    <div className="home-features">

      <div className="home-feature-card">
        <div className="feature-icon">💬</div>
        <h3>Anonymous Text Chat</h3>
        <p>
          Meet random people instantly through private text conversations.
        </p>
      </div>

      <div className="home-feature-card">
        <div className="feature-icon">📹</div>
        <h3>Video Chat</h3>
        <p>
          Start face-to-face conversations with strangers from around the world.
        </p>
      </div>

      <div className="home-feature-card">
        <div className="feature-icon">⚡</div>
        <h3>Instant Matching</h3>
        <p>
          Get matched with another user in just a few seconds.
        </p>
      </div>

      <div className="home-feature-card">
        <div className="feature-icon">🔒</div>
        <h3>Private & Secure</h3>
        <p>
          No account required and no chat history stored after the conversation ends.
        </p>
      </div>

    </div>

  </section>

  {/* How it Works */}

  <section className="home-section">

    <h2>How It Works</h2>

    <div className="home-steps">

      <div className="step">
        <span>1</span>
        <p>Choose Text Chat or Video Chat.</p>
      </div>

      <div className="step">
        <span>2</span>
        <p>We instantly connect you with a random stranger.</p>
      </div>

      <div className="step">
        <span>3</span>
        <p>Chat freely and press Next whenever you want a new conversation.</p>
      </div>

    </div>

  </section>

</div>
    </div>
  );
}