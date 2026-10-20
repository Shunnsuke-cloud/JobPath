import { ImageResponse } from "next/og";

export const alt = "JobPath — Your career, connected. 就活のすべてを、ひとつの場所に。";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px", background: "radial-gradient(ellipse at 85% 80%, #303369, #070b17 75%)", color: "#f8fafc", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", gap: "7px", alignItems: "center", marginBottom: "48px" }}>{[32, 48, 39].map((height, i) => <div key={i} style={{ width: "12px", height, borderRadius: "3px", background: i === 2 ? "#67e8f9" : "#818cf8" }} />)}<span style={{ fontSize: "42px", marginLeft: "18px", fontWeight: 700 }}>JobPath.</span></div>
      <div style={{ fontSize: "82px", lineHeight: 1.15, letterSpacing: "-3px", fontWeight: 700, display: "flex", flexDirection: "column" }}><span>Your career,</span><span style={{ color: "#a5b4fc" }}>connected.</span></div>
      <div style={{ color: "#94a3b8", fontSize: "20px", letterSpacing: "5px", marginTop: "40px" }}>LESS CHAOS. MORE CLARITY.</div>
      <div style={{ display: "flex", position: "absolute", right: "80px", top: "100px", width: "370px", height: "370px", border: "1px solid #818cf833", borderRadius: "50%" }} />
    </div>, size,
  );
}
