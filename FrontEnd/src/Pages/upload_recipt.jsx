import { useState, useEffect } from "react";
import "../CSS/upload_Receipts.css";

function getExt(filename) {
  return filename?.split(".").pop()?.toLowerCase() || "";
}

function FileItem({ file, isActive, onClick, type }) {
  const ext = getExt(file);
  const extClass = ext === "txt" ? "txt" : ext === "pdf" ? "pdf" : "img";

  return (
    <button
      className={`rp-file-item ${isActive ? "active " + type : ""}`}
      onClick={onClick}
    >
      <span className={`rp-file-ext ${extClass}`}>{ext}</span>
      <span className="rp-file-name">{file}</span>
    </button>
  );
}

export default function UploadReceipt() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedText, setSelectedText] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [textData, setTextData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5001/api/receipts")
      .then((res) => res.json())
      .then((data) => {
        setFiles(data.files);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedText) return;

    fetch(`http://localhost:5001/api/receipts/text/${selectedText}`)
      .then((res) => res.json())
      .then((data) => setTextData(data));
  }, [selectedText]);

  const textFiles = files.filter((f) => /\.txt$/i.test(f));
  const mediaFiles = files.filter((f) => /\.(png|jpg|jpeg|pdf)$/i.test(f));

  const mediaUrl = selectedMedia
    ? `http://localhost:5001/uploads/${selectedMedia}`
    : null;

  const isImage = /\.(png|jpg|jpeg)$/i.test(selectedMedia || "");
  const isPDF = /\.pdf$/i.test(selectedMedia || "");

  if (loading) {
    return <div className="rp-loading">Loading receipts…</div>;
  }

  return (
    <div className="rp-page">
      <div className="rp-topbar">
        <h1 className="rp-title">Receipts</h1>
        <span className="rp-subtitle">{files.length} files</span>
      </div>

      <div className="rp-grid">

        {/* TEXT COLUMN */}
        <div className="rp-col">
          <div className="rp-col-header">
            <div className="rp-col-icon txt">T</div>
            <span className="rp-col-label">Text Records</span>
          </div>

          <div className="rp-file-list">
            {textFiles.map((f) => (
              <FileItem
                key={f}
                file={f}
                isActive={selectedText === f}
                onClick={() => setSelectedText(f)}
                type="txt"
              />
            ))}
          </div>

          <div className="rp-viewer-panel">
            <div className="rp-viewer-body">
              {textData && (
                <div className="rp-text-card">
                  {Object.entries(textData).map(([k, v]) => (
                    <div key={k} className="rp-receipt-row">
                      <span className="rp-receipt-label">{k}</span>
                      <span className="rp-receipt-value">{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rp-divider" />

        {/* MEDIA COLUMN */}
        <div className="rp-col">
          <div className="rp-col-header">
            <div className="rp-col-icon media">⊞</div>
            <span className="rp-col-label">PDFs & Images</span>
          </div>

          <div className="rp-file-list">
            {mediaFiles.map((f) => (
              <FileItem
                key={f}
                file={f}
                isActive={selectedMedia === f}
                onClick={() => setSelectedMedia(f)}
                type="media"
              />
            ))}
          </div>

          <div className="rp-viewer-panel">
            <div className="rp-viewer-body">
              {isPDF && <iframe src={mediaUrl} title={selectedMedia} />}
              {isImage && <img src={mediaUrl} alt={selectedMedia} />}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}