import { useState } from "react";
import Tesseract from "tesseract.js";

export function DocumentScannerModal({
  showDocumentScanner,
  setShowDocumentScanner,
  onScan
}) {
  const [imageSrc, setImageSrc] = useState(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!showDocumentScanner) return null;

  function handleFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  }

  async function runOcr() {
    if (!imageSrc) return;
    setBusy(true);
    try {
      const { data } = await Tesseract.recognize(imageSrc, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text" && m.progress) {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      const text = data?.text?.trim() || "";
      onScan && onScan(text);
    } catch (err) {
      onScan && onScan("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}>
      <div style={{
        background: "white",
        padding: 24,
        borderRadius: 12,
        width: "94%",
        maxWidth: 520,
        textAlign: "center"
      }}>
        <h3 style={{ margin: 0, marginBottom: 12 }}>Document Scanner</h3>
        <p style={{ color: "#6b7280", marginTop: 0, marginBottom: 12 }}>
          Use your phone camera to capture the document. OCR will extract text.
        </p>

        <div style={{ marginBottom: 12 }}>
          <input
            accept="image/*"
            capture="environment"
            type="file"
            onChange={handleFile}
            style={{ width: "100%" }}
          />
        </div>

        {imageSrc && (
          <div style={{ marginBottom: 12 }}>
            <img src={imageSrc} alt="preview" style={{ width: "100%", borderRadius: 8 }} />
          </div>
        )}

        {busy && <div style={{ marginBottom: 8 }}>Scanning... {progress}%</div>}

        <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
          <button
            onClick={() => setShowDocumentScanner(false)}
            style={{ padding: "8px 14px", borderRadius: 6, border: "1px solid #d1d5db", background: "#f9fafb" }}
            disabled={busy}
          >
            Cancel
          </button>

          <button
            onClick={runOcr}
            style={{ padding: "8px 14px", borderRadius: 6, border: "none", background: "#3b82f6", color: "white" }}
            disabled={busy || !imageSrc}
          >
            {busy ? `Scanning ${progress}%` : "Scan & Extract"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DocumentScannerModal;
