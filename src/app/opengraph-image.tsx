import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#050505",
          position: "relative",
        }}
      >
        {/* gradient glow */}
        <div
          style={{
            position: "absolute",
            width: 900,
            height: 900,
            borderRadius: 9999,
            filter: "blur(120px)",
            opacity: 0.25,
            background:
              "radial-gradient(circle, #7b5cff 0%, #ff5cc8 45%, #e33340 100%)",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://djslaps-site.vercel.app/logo.png"
            width={140}
            height={140}
            alt=""
            style={{ borderRadius: 28 }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 96,
              fontWeight: 800,
              color: "#f4f4f4",
              letterSpacing: -3,
            }}
          >
            DJSLAPS
          </div>
        </div>
        <div
          style={{
            marginTop: 36,
            display: "flex",
            fontSize: 30,
            color: "#9a9a9a",
          }}
        >
          WE PLAY WE WIN OR LOSE WE CRY EITHER WAY
        </div>
        <div
          style={{
            marginTop: 20,
            padding: "10px 32px",
            borderRadius: 999,
            border: "1px solid #262626",
            display: "flex",
            fontSize: 22,
            color: "#ff5cc8",
          }}
        >
          Hinglish gaming & horror · djslaps-site.vercel.app
        </div>
      </div>
    ),
    size,
  );
}
