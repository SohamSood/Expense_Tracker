import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Image as ImageIcon, 
  File, 
  Upload, 
  Check, 
  Save, 
  X,
  FileSearch,
  ChevronRight,
  Plus
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
        <span className="file-name text-left truncate">{file}</span>
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
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef(null);

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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploading(true);
      // Use the raw axios instance from our unified API for FormData
      await api.instance.post('/receipts/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await fetchFiles(); // Refresh list
    } catch (err) {
      console.error('Upload error:', err);
      alert(err.response?.data?.error || 'Failed to upload file');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

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

  if (loading && files.length === 0) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>Scanning receipts...</p>
      </div>
    );
  }

  return (
    <div className="receipts-container p-4 md:p-8">
      <div className="page-header-row flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="page-title text-3xl font-bold">Receipts & Documents</h1>
          <p className="page-subtitle text-[var(--text-secondary)]">Upload and process receipts into bill entries</p>
        </div>
        <div className="header-actions flex gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            style={{ display: 'none' }}
            accept=".pdf,.png,.jpg,.jpeg,.txt"
          />
          <Button 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? <><Upload className="animate-spin mr-2" size={18} /> Uploading...</> : <><Plus size={18} /> Upload New</>}
          </Button>
          <Button 
            variant="primary" 
            onClick={saveAllBills} 
            disabled={isSaving || files.length === 0}
          >
            {isSaving ? 'Processing...' : <><Save size={18} /> Process All</>}
          </Button>
        </div>
      </div>

      <div className="receipts-grid grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Text Records */}
        <section className="receipt-col flex flex-col gap-6">
          <div className="col-header flex items-center gap-3">
            <div className="icon-badge txt bg-blue-100 text-blue-600 p-2 rounded-lg"><FileText size={18} /></div>
            <h3 className="text-xl font-semibold">Extracted Data (.txt)</h3>
            <Badge variant="primary">{textFiles.length}</Badge>
          </div>
          
          <Card className="file-list-card overflow-hidden">
            <div className="file-list max-h-[300px] overflow-y-auto">
              {textFiles.length === 0 ? (
                <div className="empty-files p-8 text-center text-gray-500">No text records found.</div>
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

          <Card className="viewer-card min-h-[300px] flex flex-col">
            {textData ? (
              <div className="text-viewer p-6 flex flex-col h-full">
                <div className="viewer-header flex justify-between items-center mb-6">
                  <h4 className="font-bold text-lg">Record Preview</h4>
                  <Button size="sm" onClick={saveBill} disabled={isSaving}>
                    <Check size={14} className="mr-2" /> Save as Bill
                  </Button>
                </div>
                <div className="data-grid flex-1 border rounded-lg p-4 bg-gray-50">
                  {Object.entries(textData).map(([k, v]) => (
                    <div key={k} className="data-row flex justify-between py-2 border-bottom last:border-0">
                      <span className="data-label text-gray-500 font-medium">{k}</span>
                      <span className="data-value font-semibold">{v || 'N/A'}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="viewer-placeholder flex-1 flex flex-col items-center justify-center p-12 text-gray-400">
                <FileSearch size={48} className="mb-4" />
                <p>Select a text record to see extracted data</p>
              </div>
            )}
          </Card>
        </section>

        {/* Right Column: Media Files */}
        <section className="receipt-col flex flex-col gap-6">
          <div className="col-header flex items-center gap-3">
            <div className="icon-badge media bg-purple-100 text-purple-600 p-2 rounded-lg"><ImageIcon size={18} /></div>
            <h3 className="text-xl font-semibold">Images & PDFs</h3>
            <Badge variant="primary">{mediaFiles.length}</Badge>
          </div>

          <Card className="file-list-card overflow-hidden">
            <div className="file-list max-h-[300px] overflow-y-auto">
              {mediaFiles.length === 0 ? (
                <div className="empty-files p-8 text-center text-gray-500">No media files found.</div>
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

          <Card className={cn('viewer-card media-viewer min-h-[400px] overflow-hidden flex flex-col', !selectedMedia && 'justify-center items-center')}>
            {selectedMedia ? (
              <div className="media-container relative h-full flex-1">
                {isPDF ? (
                  <iframe src={mediaUrl} title={selectedMedia} className="pdf-frame w-full h-[500px]" />
                ) : (
                  <div className="flex items-center justify-center h-full p-4">
                    <img src={mediaUrl} alt={selectedMedia} className="receipt-img max-w-full max-h-[500px] object-contain rounded-lg shadow-lg" />
                  </div>
                )}
                <div className="media-overlay absolute bottom-4 left-4">
                  <Badge variant="secondary" className="bg-white/90 backdrop-blur shadow-sm">{selectedMedia}</Badge>
                </div>
              </div>
            ) : (
              <div className="viewer-placeholder p-12 text-center text-gray-400">
                <Upload size={48} className="mx-auto mb-4" />
                <p>Select a file to view document preview</p>
              </div>
            )}
          </Card>
        </section>
      </div>
    </div>
  );
}