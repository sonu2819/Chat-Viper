export const metadata = {
  title: "Features | ChatViper",
  description:
    "Discover ChatViper's anonymous text and video chat features.",
};

const features = [
  {
    title: "Anonymous Text Chat",
    description:
      "Chat instantly with random strangers without creating an account or sharing personal information.",
    icon: "💬",
  },
  {
    title: "Anonymous Video Chat",
    description:
      "Start face-to-face conversations with random people while keeping your identity private.",
    icon: "📹",
  },
  {
    title: "Instant Random Matching",
    description:
      "Get matched with a new stranger in seconds and switch to someone new anytime.",
    icon: "🎲",
  },
  {
    title: "One-Click Next",
    description:
      "Skip your current conversation instantly and connect with another random person.",
    icon: "⏭️",
  },
  {
    title: "Real-Time Messaging",
    description:
      "Exchange messages instantly with smooth real-time communication.",
    icon: "⚡",
  },
  {
    title: "High-Quality Video",
    description:
      "Enjoy fast and responsive video conversations using WebRTC technology.",
    icon: "🎥",
  },
  {
    title: "Privacy First",
    description:
      "No registration, no usernames, and no permanent chat history.",
    icon: "🔒",
  },
  {
    title: "Cross-Platform",
    description:
      "Use ChatViper on desktop, tablet, or mobile with a responsive interface.",
    icon: "📱",
  },
  {
    title: "Completely Free",
    description:
      "Unlimited anonymous text and video chatting without subscriptions or hidden fees.",
    icon: "🆓",
  },
];

export default function FeaturesPage() {
  return (
    <div className="page-container">
      <h1>ChatViper Features</h1>

      <p className="features-intro">
        ChatViper combines anonymous text chatting and video chatting into one
        simple platform. No registration is required—just choose your preferred
        chat mode and connect with random people from around the world in
        seconds.
      </p>

      <div className="features-grid">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="feature-card"
          >
            <div className="feature-icon">
              {feature.icon}
            </div>

            <h2>{feature.title}</h2>

            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}