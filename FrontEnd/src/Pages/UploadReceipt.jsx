import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Image as ImageIcon, 
  File, 
  Upload, 
  Check, 
  Save, 
  X,
  FileSearch,
  ChevronRight
} from 'lucide-react';
import { Card, Button, Badge, cn } from '../Components/ui';
import { api } from '../utils/api';

function getExt(filename) {
  return filename?.split('.').pop()?.toLowerCase() || '';
}

function FileItem({ file, isActive, onClick }) {
  const ext = getExt(file);
  const Icon = ext === 'txt' ? FileText : ext === 'pdf' ? File : ImageIcon;

  return (
    <button
      className={cn(
        'receipt-file-item',
        isActive && 'active'
      )}
      onClick={onClick}
    >
      <div className={cn('file-icon-box', ext)}>
        <Icon size={18} />
      </div>
      <div className="file-info">
        <span className="file-name">{file}</span>
        <span className="file-ext">{ext.toUpperCase()}</span>
      </div>
      {isActive && <ChevronRight size={16} className="active-arrow" />}
    </button>
  );
}

export default function UploadReceipt() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedText, setSelectedText] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [textData, setTextData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const data = await api.get('/receipts');
      setFiles(data.files || []);
    } catch (err) {
      console.error('Error fetching receipts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedText) {
      setTextData(null);
      return;
    }

    api.get(`/receipts/text/${selectedText}`)
      .then(data => setTextData(data))
      .catch(err => console.error(err));
  }, [selectedText]);

  const textFiles = files.filter(f => /\.txt$/i.test(f));
  const mediaFiles = files.filter(f => /\.(png|jpg|jpeg|pdf)$/i.test(f));

  const mediaUrl = selectedMedia
    ? `http://localhost:5001/uploads/${selectedMedia}`
    : null;

  const isImage = /\.(png|jpg|jpeg)$/i.test(selectedMedia || '');
  const isPDF = /\.pdf$/i.test(selectedMedia || '');

  const saveBill = async () => {
    if (!selectedText) return;
    try {
      setIsSaving(true);
      const data = await api.post(`/receipts/save/${selectedText}`);
      alert(data.message || 'Bill saved successfully');
    } catch (err) {
      alert('Failed to save bill');
    } finally {
      setIsSaving(false);
    }
  };

  const saveAllBills = async () => {
    try {
      setIsSaving(true);
      const data = await api.post('/receipts/save-all');
      alert(`Saved: ${data.saved}\nSkipped: ${data.skipped}`);
    } catch (err) {
      alert('Failed to save all bills');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>Scanning receipts...</p>
      </div>
    );
  }

  return (
    <div className="receipts-container">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Receipts & Documents</h1>
          <p className="page-subtitle">Process uploaded receipts and convert them to bill entries</p>
        </div>
        <div className="header-actions">
          <Button 
            variant="primary" 
            onClick={saveAllBills} 
            disabled={isSaving || files.length === 0}
          >
            {isSaving ? 'Processing...' : <><Save size={18} /> Save All Records</>}
          </Button>
        </div>
      </div>

      <div className="receipts-grid">
        {/* Left Column: Text Records */}
        <section className="receipt-col">
          <div className="col-header">
            <div className="icon-badge txt"><FileText size={16} /></div>
            <h3>Text Data</h3>
            <Badge variant="primary">{textFiles.length}</Badge>
          </div>
          
          <Card className="file-list-card">
            <div className="file-list">
              {textFiles.length === 0 ? (
                <div className="empty-files">No text records.</div>
              ) : (
                textFiles.map(f => (
                  <FileItem 
                    key={f} 
                    file={f} 
                    isActive={selectedText === f}
                    onClick={() => { setSelectedText(f); setSelectedMedia(null); }}
                  />
                ))
              )}
            </div>
          </Card>

          <Card className="viewer-card">
            {textData ? (
              <div className="text-viewer">
                <div className="viewer-header">
                  <h4>Extracted Information</h4>
                  <Button size="sm" onClick={saveBill} disabled={isSaving}>
                    <Check size={14} /> Save as Bill
                  </Button>
                </div>
                <div className="data-grid">
                  {Object.entries(textData).map(([k, v]) => (
                    <div key={k} className="data-row">
                      <span className="data-label">{k}</span>
                      <span className="data-value">{v || 'N/A'}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="viewer-placeholder">
                <FileSearch size={40} />
                <p>Select a record to preview data</p>
              </div>
            )}
          </Card>
        </section>

        {/* Right Column: Media Files */}
        <section className="receipt-col">
          <div className="col-header">
            <div className="icon-badge media"><ImageIcon size={16} /></div>
            <h3>PDFs & Images</h3>
            <Badge variant="primary">{mediaFiles.length}</Badge>
          </div>

          <Card className="file-list-card">
            <div className="file-list">
              {mediaFiles.length === 0 ? (
                <div className="empty-files">No media files.</div>
              ) : (
                mediaFiles.map(f => (
                  <FileItem 
                    key={f} 
                    file={f} 
                    isActive={selectedMedia === f}
                    onClick={() => { setSelectedMedia(f); setSelectedText(null); }}
                  />
                ))
              )}
            </div>
          </Card>

          <Card className={cn('viewer-card media-viewer', !selectedMedia && 'is-empty')}>
            {selectedMedia ? (
              <div className="media-container">
                {isPDF ? (
                  <iframe src={mediaUrl} title={selectedMedia} className="pdf-frame" />
                ) : (
                  <img src={mediaUrl} alt={selectedMedia} className="receipt-img" />
                )}
                <div className="media-overlay">
                  <Badge variant="secondary">{selectedMedia}</Badge>
                </div>
              </div>
            ) : (
              <div className="viewer-placeholder">
                <Upload size={40} />
                <p>Select a file to view document</p>
              </div>
            )}
          </Card>
        </section>
      </div>
    </div>
  );
}