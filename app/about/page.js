export const metadata = {
  title: "About",
  description:
    "Learn more about ChatViper, the anonymous random text chat platform.",
};

export default function AboutPage() {
  return (
    <div className="page-container">
      <h1>About ChatViper</h1>

      <p>
        ChatViper is a free anonymous text chat platform that connects people
        from around the world instantly. No registration or personal
        information is required—just start chatting with a random stranger in
        seconds.
      </p>

      <p>
        Our goal is to provide a simple, fast, and privacy-focused platform
        where users can enjoy meaningful conversations, make new friends, or
        simply pass the time without sharing their identity.
      </p>

      <h2>Why Choose ChatViper?</h2>

      <ul>
        <li>100% anonymous text chatting</li>
        <li>No registration or sign-up required</li>
        <li>Instant random user matching</li>
        <li>Fast and lightweight experience</li>
        <li>Works on desktop, tablet, and mobile devices</li>
        <li>Privacy-focused with no personal profiles</li>
        <li>Completely free to use</li>
      </ul>

      <h2>Our Mission</h2>

      <p>
        We believe online conversations should be easy, accessible, and
        respectful. ChatViper is designed to help people connect with strangers
        from different backgrounds while maintaining their privacy and enjoying
        a smooth chatting experience.
      </p>
    </div>
  );
}