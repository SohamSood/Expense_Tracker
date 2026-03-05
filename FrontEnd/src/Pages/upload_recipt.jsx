import { useState, useEffect } from "react";

export default function UploadReceipt() {
  const [files, setFiles] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5001/api/receipts")
      .then((res) => res.json())
      .then((data) => {
        setFiles(data.files || []);
      });
  }, []);

  if (files.length === 0) {
    return <h2>No receipts found</h2>;
  }

  const currentFile = files[index];
  const fileUrl = `http://localhost:5001/uploads/${currentFile}`;

  return (
    <div>
      <h1>Receipts Viewer</h1>

      <p>{currentFile}</p>

      <iframe
        src={fileUrl}
        width="600"
        height="400"
      ></iframe>

      <br /><br />

      <button
        onClick={() => setIndex(index - 1)}
        disabled={index === 0}
      >
        Prev
      </button>

      <button
        onClick={() => setIndex(index + 1)}
        disabled={index === files.length - 1}
      >
        Next
      </button>
    </div>
  );
}