import Link from "next/link";
export default function NotFound() {
  return (<main className="w" style={{ minHeight: "100svh", display: "grid", placeItems: "center", textAlign: "center" }}><div><h1 style={{ margin: "0 auto 1.5rem", fontSize: "clamp(4rem,14vw,10rem)" }}>404</h1><Link className="btn p" href="/">Back to homepage</Link></div></main>);
}
