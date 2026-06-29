// A thin banner shown when the device is offline. The reel still works (offline
// roast + faux bg), so this just sets expectations rather than blocking.
import React, { useEffect, useState } from "react";

export function OfflineBanner() {
  const [online, setOnline] = useState(typeof navigator === "undefined" ? true : navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);
  if (online) return null;
  return (
    <div role="status" style={{ background: "var(--warning, #B8730A)", color: "#fff", font: "var(--type-cap)", fontWeight: 700, textAlign: "center", padding: "4px 8px" }}>
      You're offline, so roasts run in offline mode.
    </div>
  );
}
