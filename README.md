# SysMon AI Dashboard - Real-Time System Telemetry

A futuristic, sci-fi themed system monitoring dashboard built with **React** and **Node.js**. 
It visualizes CPU, GPU, Memory, and Process statistics in real-time.

![SysMon Dashboard Preview](https://via.placeholder.com/800x400?text=SysMon+Dashboard+Preview)

## 🚀 Features

*   **Real-time Charts**: Live CPU/GPU usage, memory frequency, and temperature graphs.
*   **Process Explorer**: View top resource-consuming processes with memory usage in MB.
*   **AI Advisor**: (Optional) Integrated Gemini AI to analyze system health.
*   **Dual Mode**: 
    *   **Simulation Mode**: Works instantly without a backend for demos.
    *   **Live Mode**: Connects to a local Node.js server for real hardware stats.
*   **Cross-Device**: View your desktop's stats from your phone/tablet on the same Wi-Fi.

---

## 🐧 Installation & Setup (Ubuntu / Linux)

Follow these steps to run SysMon on your Ubuntu machine to see real hardware insights.

### 1. Prerequisites
Ensure you have **Node.js** (v18 or higher) and **Git** installed.

```bash
# Update system
sudo apt update

# Install Node.js (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node -v
npm -v
```

### 2. Clone the Repository
Download the code to your machine.

```bash
git clone https://github.com/your-username/sysmon-ai-dashboard.git
cd sysmon-ai-dashboard
```

### 3. Install Dependencies
Install the required libraries for both the frontend and backend.

```bash
npm install
```

---

## ⚡ Running the Dashboard

You need **two terminal windows** open: one for the **Backend** (data collector) and one for the **Frontend** (UI).

### Terminal 1: Start the Backend Server
The backend uses `systeminformation` to read hardware stats. 
**Note:** `sudo` is highly recommended to allow reading **CPU temperatures** and **Fan speeds** from Linux sensors.

```bash
sudo npm run server
```
*You should see: `🚀 SysMon Node Backend is running! Local: http://localhost:3001/stats`*

### Terminal 2: Start the Frontend UI
Open a new terminal tab/window inside the project folder.

```bash
npm start
```

*The browser should automatically open `http://localhost:3000`.*

---

## 📱 Accessing from Other Devices (LAN)

To view your Ubuntu machine's stats from your phone or laptop:

1.  Find your Ubuntu machine's IP address:
    ```bash
    hostname -I
    ```
2.  Open your browser on the other device and type:
    `http://<YOUR_UBUNTU_IP>:3000`
    *(Example: `http://192.168.1.50:3000`)*

**Firewall Note:** If it doesn't load, ensure ports 3000 and 3001 are allowed:
```bash
sudo ufw allow 3000
sudo ufw allow 3001
```

---

## 🔧 Troubleshooting

*   **"Backend Offline" / "Simulation Mode Active"**: 
    *   Ensure Terminal 1 is running `sudo npm run server`.
    *   Click the **"Simulation" toggle button** in the top right of the UI header to switch to **"Real-Time"**.
*   **No Temperatures showing**:
    *   Restart the backend using `sudo`. Linux requires root privileges to read thermal sensors (`/sys/class/thermal`).
    *   Ensure `lm-sensors` is installed: `sudo apt install lm-sensors && sudo sensors-detect`.

---

## 🤖 (Optional) AI Advisor Setup
To use the Gemini AI features:
1.  Get an API Key from [Google AI Studio](https://aistudio.google.com/).
2.  Create a `.env` file in the root directory:
    ```env
    API_KEY=your_actual_api_key_here
    ```
3.  Restart the frontend.
