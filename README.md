# SysMon AI Dashboard

A real-time system monitoring dashboard that visualizes CPU, GPU, Memory, and Process statistics. It features a sci-fi interface and supports both **Simulation Mode** (for web demos) and **Real-Time Mode** (reading local hardware stats).

![SysMon Preview](https://via.placeholder.com/800x400?text=SysMon+Dashboard)

---

## 🛠️ VS Code Quick Start

Follow these steps **exactly** to run the project locally.

### 1. Prerequisites
*   Install [Node.js](https://nodejs.org/) (LTS version recommended).
*   Install [VS Code](https://code.visualstudio.com/).

### 2. 📂 Critical: Folder Structure Setup
When you download the code, the files might be in a single flat folder. **You must organize them** for the build tools to work:

1.  **Create a folder** named `public`.
2.  **Move** `index.html` into the `public` folder.
3.  **Create a folder** named `src`.
4.  **Move** the following files/folders into `src`:
    *   `App.tsx`
    *   `index.tsx`
    *   `types.ts`
    *   `constants.ts`
    *   `components/` (the entire folder)
    *   `hooks/` (the entire folder)
    *   `services/` (the entire folder)

**Your root folder should now look like this:**
```
/my-app
  ├── /node_modules (created after install)
  ├── /public
  │     └── index.html
  ├── /src
  │     ├── /components
  │     ├── /hooks
  │     ├── /services
  │     ├── App.tsx
  │     ├── index.tsx
  │     └── ...
  ├── package.json
  ├── server.js
  ├── .gitignore
  └── README.md
```

### 3. Installation & Running
1.  Open the **root folder** in VS Code.
2.  Open the **Integrated Terminal** (`Ctrl` + `~`).
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Start the App (Frontend + Backend):
    ```bash
    npm run dev
    ```

*   The browser should open automatically at `http://localhost:3000`.

---

## 📡 Modes Explained

*   **Simulation Mode** (Default):
    *   Uses generated fake data.
    *   Useful if you just want to see the UI.
    
*   **Real-Time Mode**:
    *   Connects to your actual machine's hardware via `server.js`.
    *   **Requires** the backend to be running (`npm run dev` handles this).
    *   Click the **Toggle Button** in the top right of the dashboard to switch modes.

---

## ⚠️ Troubleshooting

### Hardware Permissions (Temperatures/Fan Speeds)
To read accurate **CPU Temperatures** and **Fan Speeds**, the system often requires administrative privileges.

*   **Windows**: Close VS Code, right-click the icon, and select **"Run as Administrator"**, then run `npm run dev`.
*   **Mac/Linux**: You may need to run the server with sudo permissions:
    ```bash
    # Terminal 1
    sudo npm run server
    # Terminal 2
    npm start
    ```

### "API Key Missing" Error
The **AI Advisor** features require a Google Gemini API Key.
1.  Create a file named `.env` in the root folder.
2.  Add this line: `REACT_APP_API_KEY=your_gemini_api_key_here`.
3.  *Note: You may need to update `services/geminiService.ts` to read `process.env.REACT_APP_API_KEY` depending on your build setup.*

