import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "./App.css";

function App() {
  const [recentQrs, setRecentQrs] = useState(() => {
  const saved = localStorage.getItem("recentQrs");
  return saved ? JSON.parse(saved) : [];
});
  const [type, setType] = useState("url");

  const [formData, setFormData] = useState({
    url: "",
    text: "",
    email: "",
    subject: "",
    message: "",
    phone: "",
    wifiName: "",
    wifiPassword: "",
    wifiSecurity: "WPA",
  });

  // QR customization
  const [size, setSize] = useState(250);
  const [foreground, setForeground] = useState("#000000");
  const [background, setBackground] = useState("#ffffff");
  const [level, setLevel] = useState("M");
  const [margin, setMargin] = useState(4);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const getValidationError = () => {
  if (type === "url") {
    if (!formData.url.trim()) {
      return "Please enter a URL.";
    }

    if (!/^https?:\/\/.+\..+/.test(formData.url)) {
      return "Please enter a valid URL starting with http:// or https://.";
    }
  }

  if (type === "text") {
    if (!formData.text.trim()) {
      return "Please enter some text.";
    }
  }

  if (type === "email") {
    if (!formData.email.trim()) {
      return "Please enter an email address.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return "Please enter a valid email address.";
    }
  }

  if (type === "phone") {
    if (!formData.phone.trim()) {
      return "Please enter a phone number.";
    }

    if (!/^[+]?[0-9\s-]{7,15}$/.test(formData.phone)) {
      return "Please enter a valid phone number.";
    }
  }

  if (type === "wifi") {
    if (!formData.wifiName.trim()) {
      return "Please enter the Wi-Fi network name.";
    }

    if (
      formData.wifiSecurity !== "nopass" &&
      !formData.wifiPassword.trim()
    ) {
      return "Please enter the Wi-Fi password.";
    }
  }

  return "";
};
  const generateQRData = () => {
    switch (type) {
      case "url":
        return formData.url;

      case "text":
        return formData.text;

      case "email":
        return `mailto:${formData.email}?subject=${encodeURIComponent(
          formData.subject
        )}&body=${encodeURIComponent(formData.message)}`;

      case "phone":
        return `tel:${formData.phone}`;

      case "wifi":
        return `WIFI:T:${formData.wifiSecurity};S:${formData.wifiName};P:${formData.wifiPassword};;`;

      default:
        return "";
    }
  };

  const validationError = getValidationError();
  const qrData = validationError ? "" : generateQRData();
  const saveRecentQR = () => {
  if (!qrData) return;

  const newQR = {
  id: Date.now(),
  type: type,
  data: qrData,
  formData: { ...formData },
  createdAt: new Date().toLocaleString(),
};

  const updated = [
    newQR,
    ...recentQrs.filter((qr) => qr.data !== qrData),
  ].slice(0, 5);

  setRecentQrs(updated);
  localStorage.setItem("recentQrs", JSON.stringify(updated));
};
  const downloadQR = () => {
  const canvas = document.querySelector(".qr-code");

  if (!canvas) {
    return;
  }

  const link = document.createElement("a");

  link.download = "qr-code.png";
  link.href = canvas.toDataURL("image/png");

  link.click();
};

  return (
    <div className="app">
      <header>
        <h1>QR Studio</h1>
        <p>Create beautiful QR codes instantly</p>
      </header>

      <main className="container">

        {/* LEFT SIDE */}
        <section className="controls">
          <h2>Create QR Code</h2>

          <label>QR Type</label>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="url">URL</option>
            <option value="text">Plain Text</option>
            <option value="email">Email</option>
            <option value="phone">Phone Number</option>
            <option value="wifi">Wi-Fi</option>
          </select>

          {/* URL */}
          {type === "url" && (
            <>
              <label>Website URL</label>

              <input
                type="url"
                name="url"
                placeholder="https://example.com"
                value={formData.url}
                onChange={handleChange}
              />
            </>
          )}

          {/* TEXT */}
          {type === "text" && (
            <>
              <label>Plain Text</label>

              <textarea
                name="text"
                placeholder="Enter your text"
                value={formData.text}
                onChange={handleChange}
              />
            </>
          )}

          {/* EMAIL */}
          {type === "email" && (
            <>
              <label>Email Address</label>

              <input
                type="email"
                name="email"
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={handleChange}
              />

              <label>Subject</label>

              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
              />

              <label>Message</label>

              <textarea
                name="message"
                placeholder="Your message"
                value={formData.message}
                onChange={handleChange}
              />
            </>
          )}

          {/* PHONE */}
          {type === "phone" && (
            <>
              <label>Phone Number</label>

              <input
                type="tel"
                name="phone"
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={handleChange}
              />
            </>
          )}

          {/* WIFI */}
          {type === "wifi" && (
            <>
              <label>Network Name</label>

              <input
                type="text"
                name="wifiName"
                placeholder="My Wi-Fi"
                value={formData.wifiName}
                onChange={handleChange}
              />

              <label>Password</label>

              <input
                type="password"
                name="wifiPassword"
                placeholder="Wi-Fi password"
                value={formData.wifiPassword}
                onChange={handleChange}
              />

              <label>Security</label>

              <select
                name="wifiSecurity"
                value={formData.wifiSecurity}
                onChange={handleChange}
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">No Password</option>
              </select>
            </>
          )}

          {/* CUSTOMIZATION */}
          <div className="customization">
            <h2>Customize</h2>

            <label>QR Size: {size}px</label>

            <input
              type="range"
              min="150"
              max="400"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
            />

            <div className="color-row">
              <div>
                <label>Foreground</label>

                <input
                  type="color"
                  value={foreground}
                  onChange={(e) => setForeground(e.target.value)}
                />
              </div>

              <div>
                <label>Background</label>

                <input
                  type="color"
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                />
              </div>
            </div>

            <label>Error Correction</label>

            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="L">Low (L)</option>
              <option value="M">Medium (M)</option>
              <option value="Q">Quartile (Q)</option>
              <option value="H">High (H)</option>
            </select>

            <label>Margin: {margin}</label>

            <input
              type="range"
              min="0"
              max="10"
              value={margin}
              onChange={(e) => setMargin(Number(e.target.value))}
            />
          </div>
          {validationError && (
            <p className="error-message">
               ⚠ {validationError}
            </p>
          )}
        </section>

        {/* RIGHT SIDE */}
        <section className="preview">
          <h2>Preview</h2>
          <div className="qr-box">
           {qrData ? (
            <QRCodeCanvas
              className="qr-code"
              value={qrData}
              size={size}
              fgColor={foreground}
              bgColor={background}
              level={level}
              marginSize={margin}
            />
          ) : (
            <p>Enter information to generate a QR code</p>
          )}
        </div>
          
            
          {qrData && (
             <button className="download-btn" onClick={downloadQR}>
              Download PNG
             </button>
          )}
          {qrData && (
              <button
              className="save-btn"
              onClick={saveRecentQR}
            >
              Save to Recent
            </button>
          )}
        </section>
<section className="recent-section">
  <div className="recent-header">
    <h2>Recent QR Codes</h2>

    {recentQrs.length > 0 && (
      <button
        className="clear-btn"
        onClick={() => {
          setRecentQrs([]);
          localStorage.removeItem("recentQrs");
        }}
      >
        Clear All
      </button>
    )}
  </div>

  {recentQrs.length === 0 ? (
    <p className="empty-recent">
      No recent QR codes yet.
    </p>
  ) : (
    <div className="recent-list">
      {recentQrs.map((qr) => (
        <div
          className="recent-item"
          key={qr.id}
          onClick={() => {
            if (!qr.formData) return;

            setType(qr.type);
            setFormData(qr.formData);
          }}
        >
          <div>
            <strong>{qr.type.toUpperCase()}</strong>
            <p>{qr.data}</p>
            <small>{qr.createdAt}</small>
          </div>

          <button
            className="delete-btn"
            onClick={() => {
              e.stopPropagation();
              const updated = recentQrs.filter(
                (item) => item.id !== qr.id
              );

              setRecentQrs(updated);
              localStorage.setItem(
                "recentQrs",
                JSON.stringify(updated)
              );
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  )}
  </section>

  
      </main>
    </div>
  );
}

export default App;