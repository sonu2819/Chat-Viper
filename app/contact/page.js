export const metadata = {
  title: "Contact",
  description:
    "Contact ChatViper for support, feedback, bug reports, or abuse reports.",
};

export default function ContactPage() {
  return (
    <div className="page-container">
      <h1>Contact Us</h1>

      <p>
        We'd love to hear from you. Whether you have a question, feedback,
        found a bug, or need to report inappropriate behavior, we're here to
        help.
      </p>

      <h2>Get in Touch</h2>

      <p>
        <strong>Email:</strong>{" "}
        <a href="mailto:merestro106@gmail.com">
          merestro106@gmail.com
        </a>
      </p>

      <h2>When to Contact Us</h2>

      <ul>
        <li>General questions about ChatViper</li>
        <li>Bug reports and technical issues</li>
        <li>Suggestions and feature requests</li>
        <li>Report abuse or inappropriate behavior</li>
        <li>Business or partnership inquiries</li>
      </ul>

    
    </div>
  );
}