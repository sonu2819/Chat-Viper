export const metadata = {
  title: "Features",
  description: "Explore the features of ChatViper.",
};

const features = [
  {
    title: "Anonymous Chat",
    description: "Chat with strangers without revealing your identity.",
    icon: "🕵️",
  },
  {
    title: "No Registration",
    description: "Start chatting instantly without creating an account.",
    icon: "⚡",
  },
  {
    title: "Random Matching",
    description: "Connect with random people from around the world.",
    icon: "🎲",
  },
  {
    title: "Fast Performance",
    description: "Lightweight interface with instant loading.",
    icon: "🚀",
  },
  {
    title: "Mobile Friendly",
    description: "Works perfectly on desktop, tablet, and mobile.",
    icon: "📱",
  },
  {
    title: "Privacy Focused",
    description: "Your conversations stay anonymous and secure.",
    icon: "🔒",
  },
  {
    title: "Free Forever",
    description: "Enjoy unlimited chatting without paying anything.",
    icon: "💬",
  },
  {
  title: "Real-Time Messaging",
  description: "Send and receive messages instantly with no delays.",
  icon: "💨",
},
{
  title: "Safe & Moderated",
  description: "Built-in moderation helps create a safer chatting experience.",
  icon: "🛡️",
},
];

export default function FeaturesPage() {
  return (
    <div className="page-container">
      <h1>ChatViper Features</h1>

      <p className="features-intro">
        Everything you need for a fast, anonymous, and enjoyable chatting
        experience.
      </p>

      <div className="features-grid">
        {features.map((feature) => (
          <div key={feature.title} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>

            <h2>{feature.title}</h2>

            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}