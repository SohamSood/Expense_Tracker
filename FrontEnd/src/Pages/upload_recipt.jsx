import { useState, useEffect } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .page {
    min-height: 100vh;
    background: #f7f5f2;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 48px 24px;
    font-family: 'DM Sans', sans-serif;
  }

  .header {
    width: 100%;
    max-width: 720px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 32px;
    border-bottom: 1px solid #e0dbd3;
    padding-bottom: 20px;
  }

  .title {
    font-family: 'DM Serif Display', serif;
    font-size: 28px;
    color: #1a1814;
    letter-spacing: -0.5px;
  }

  .counter {
    font-size: 13px;
    color: #9e9589;
    font-weight: 300;
    letter-spacing: 0.5px;
  }

  .card {
    width: 100%;
    max-width: 1000px;
    background: #fff;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 2px 16px rgba(0,0,0,0.06);
  }

  .filename-bar {
    padding: 12px 20px;
    background: #1a1814;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #c8b89a;
  }

  .filename {
    font-size: 12px;
    color: #c8b89a;
    font-weight: 400;
    letter-spacing: 0.3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .viewer {
    width: 100%;
    height: 720px;
    background: #f0ede8;
  }

  .viewer iframe {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
  }

  .nav {
    display: flex;
    border-top: 1px solid #ede9e3;
  }

  .nav-btn {
    flex: 1;
    padding: 16px;
    background: none;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: #1a1814;
    cursor: pointer;
    letter-spacing: 0.3px;
    transition: background 0.15s;
  }

  .nav-btn:hover:not(:disabled) {
    background: #f7f5f2;
  }

  .nav-btn:disabled {
    color: #ccc;
    cursor: not-allowed;
  }

  .nav-btn:first-child {
    border-right: 1px solid #ede9e3;
  }

  .empty {
    font-family: 'DM Serif Display', serif;
    font-size: 20px;
    color: #9e9589;
    margin-top: 120px;
  }
`;

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
  const fileUrl = currentFile ? `http://localhost:5001/uploads/${currentFile}` : null;

  return (
    <>
      <style>{styles}</style>
      <div className="page">
        {loading ? null : files.length === 0 ? (
          <p className="empty">No receipts found.</p>
        ) : (
          <>
            <div className="header">
              <h1 className="title">Receipts</h1>
              <span className="counter">{index + 1} of {files.length}</span>
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
    </>
  );
}