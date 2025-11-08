import { useState } from "react";

function UploadFile() {
  const [file, setFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "http://localhost:5000/upload");

      // אחוזי העלאה
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setProgress(percent);
        }
      };

      xhr.onload = () => {
        setLoading(false);
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          if (data.pdf) setPdfUrl(`http://172.24.208.1/${data.pdf}`);
          setProgress(100);
          setTimeout(() => setProgress(0), 1500); // אפס אחוזים אחרי הצלחה
        } else {
          alert("אירעה שגיאה בהעלאה.");
        }
      };

      xhr.onerror = () => {
        setLoading(false);
        alert("אירעה שגיאה בהעלאה.");
      };

      xhr.send(formData);

    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("אירעה שגיאה בהעלאה.");
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: "#fff",
    }}>
      <div style={{
        background: "#1b1b1b",
        padding: "50px 40px",
        borderRadius: 20,
        boxShadow: "0 15px 30px rgba(0,255,255,0.2)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: 400,
        width: "90%",
      }}>
        {/* כותרת עם לב */}
        <h1 style={{
          fontSize: "2rem",
          fontWeight: "700",
          color: "#00fff0",
          marginBottom: 10,
          display: "flex",
          alignItems: "center",
          gap: "10px",
          animation: "pulse 1.5s infinite"
        }}>
         hello michal shraga <span style={{ fontSize: "2rem", color: "#ff3860" }}>❤️</span>
        </h1>

        <h2 style={{
          fontSize: "1.2rem",
          color: "#8aa6a3",
          marginBottom: 30,
          textAlign: "center"
        }}>
          העלאת קובץ DOCX להמרה ל-PDF
        </h2>

        <input
          type="file"
          onChange={handleFileChange}
          style={{
            padding: 12,
            borderRadius: 12,
            border: "2px dashed #00fff0",
            background: "#111",
            color: "#fff",
            cursor: "pointer",
            marginBottom: 20,
            width: "100%",
            textAlign: "center",
          }}
        />

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          style={{
            padding: "12px 40px",
            borderRadius: 15,
            border: "none",
            background: "#00fff0",
            color: "#1b1b1b",
            fontWeight: "bold",
            fontSize: "1rem",
            cursor: "pointer",
            width: "100%",
            transition: "0.3s",
            boxShadow: "0 0 10px #00fff0, 0 0 20px #00fff0",
            marginBottom: 15,
          }}
          onMouseEnter={(e) => e.target.style.background = "#00d6d6"}
          onMouseLeave={(e) => e.target.style.background = "#00fff0"}
        >
          {loading ? `ממיר... ${progress}%` : "📄 העלה והמר"}
        </button>

        {/* Progress Bar */}
        {loading && (
          <div style={{
            width: "100%",
            height: 10,
            borderRadius: 5,
            background: "#333",
            overflow: "hidden",
            marginBottom: 15
          }}>
            <div style={{
              width: `${progress}%`,
              height: "100%",
              background: "#00fff0",
              transition: "width 0.2s ease"
            }}></div>
          </div>
        )}

        {pdfUrl && (
          <div style={{ marginTop: 10, width: "100%" }}>
            <a href={pdfUrl} download style={{ width: "100%" }}>
              <button style={{
                width: "100%",
                padding: "12px 0",
                borderRadius: 15,
                border: "none",
                background: "#ff3860",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "0.3s",
                boxShadow: "0 0 10px #ff3860, 0 0 20px #ff3860",
              }}
              onMouseEnter={(e) => e.target.style.background = "#e03258"}
              onMouseLeave={(e) => e.target.style.background = "#ff3860"}
              >
                📥 הורד PDF
              </button>
            </a>
          </div>
        )}

        {/* אנימציה לפולס של הלב */}
        <style>{`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
        `}</style>
      </div>
    </div>
  );
}

export default UploadFile;
