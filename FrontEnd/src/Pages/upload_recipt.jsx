import { useState, useEffect } from "react";
import "../CSS/upload_Receipts.css";

export default function UploadReceipt() {
  const [files, setFiles] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5001/api/receipts")
      .then((res) => res.json())
      .then((data) => {
        setFiles(data.files || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const currentFile = files[index];
  const fileUrl = currentFile
    ? `http://localhost:5001/uploads/${currentFile}`
    : null;

  return (
    <div className="page">
      {loading ? null : files.length === 0 ? (
        <p className="empty">No receipts found.</p>
      ) : (
        <>
          <div className="header">
            <h1 className="title">Receipts</h1>
            <span className="counter">
              {index + 1} of {files.length}
            </span>
          </div>

          <div className="card">
            <div className="filename-bar">
              <div className="dot" />
              <span className="filename">{currentFile}</span>
            </div>

            <div className="viewer">
              <iframe src={fileUrl} title={currentFile} />
            </div>

            <div className="nav">
              <button
                className="nav-btn"
                onClick={() => setIndex((i) => i - 1)}
                disabled={index === 0}
              >
                ← Previous
              </button>

              <button
                className="nav-btn"
                onClick={() => setIndex((i) => i + 1)}
                disabled={index === files.length - 1}
              >
                Next →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}