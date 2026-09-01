import Link from "next/link";

export default function OrderSuccessPage() {
  return (
    <div className="wrap" style={{ padding: "80px 24px", maxWidth: 600, textAlign: "center" }}>
      <h1>Thanks — you're in.</h1>
      <p style={{ color: "var(--ink-soft)", margin: "16px 0 26px" }}>
        If you paid by card, access unlocks immediately. If you paid by crypto, it can take a few
        minutes for the network confirmation to come through — refresh your account page shortly.
      </p>
      <Link className="btn btn-primary" href="/account">Go to my account</Link>
    </div>
  );
}
