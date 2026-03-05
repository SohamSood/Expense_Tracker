import { useState, useEffect } from "react";

export default function UploadReceipt() {
  const [files, setFiles] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/receipts")
      .then((r) => r.json())
      .then((data) => {
        if (data.files && data.files.length > 0) {
          setFiles(data.files);
        } else {
          setError("No receipts found in the uploads folder.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Could not reach the server. Is the backend running?");
        setLoading(false);
      });
  }, []);

  const current = files[index];
  const fileUrl = current ? `http://localhost:5000/uploads/${current}` : null;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Receipts Viewer</h1>

        {loading && <p style={styles.muted}>Loading receipts…</p>}
        {error && <p style={styles.error}>{error}</p>}

        {!loading && !error && files.length > 0 && (
          <>
            {/* File name + counter */}
            <div style={styles.meta}>
              <span style={styles.filename}>{current}</span>
              <span style={styles.counter}>{index + 1} / {files.length}</span>
            </div>

            {/* Viewer */}
            <div style={styles.viewer}>
              <iframe
                src={fileUrl}
                title={current}
                style={styles.iframe}
              />
            </div>

            {/* Navigation */}
            <div style={styles.nav}>
              <button
                style={{ ...styles.btn, ...(index === 0 ? styles.btnDisabled : {}) }}
                onClick={() => setIndex((i) => i - 1)}
                disabled={index === 0}
              >
                ← Prev
              </button>
              <button
                style={{ ...styles.btn, ...(index === files.length - 1 ? styles.btnDisabled : {}) }}
                onClick={() => setIndex((i) => i + 1)}
                disabled={index === files.length - 1}
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f4f6f8",
    fontFamily: "'Segoe UI', sans-serif",
    padding: "24px",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "32px",
    width: "100%",
    maxWidth: "640px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
  },
  heading: {
    margin: "0 0 20px",
    fontSize: "22px",
    fontWeight: 700,
    color: "#111",
  },
  meta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  filename: {
    fontSize: "13px",
    color: "#555",
    fontWeight: 500,
    wordBreak: "break-all",
  },
  counter: {
    fontSize: "13px",
    color: "#999",
    whiteSpace: "nowrap",
    marginLeft: "12px",
  },
  viewer: {
    width: "100%",
    height: "420px",
    borderRadius: "10px",
    overflow: "hidden",
    background: "#f0f0f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "20px",
    border: "1px solid #e5e7eb",
  },
  image: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
  },
  iframe: {
    width: "100%",
    height: "100%",
    border: "none",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
  },
  btn: {
    flex: 1,
    padding: "10px 0",
    borderRadius: "8px",
    border: "1px solid #d0d5dd",
    background: "#fff",
    color: "#333",
    fontWeight: 600,
    fontSize: "14px",
    cursor: "pointer",
  },
  btnDisabled: {
    opacity: 0.35,
    cursor: "not-allowed",
  },
  muted: { color: "#888", fontSize: "14px" },
  error: { color: "#c0392b", fontSize: "14px" },
};