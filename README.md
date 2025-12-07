# SysMon AI Dashboard

This dashboard supports both **Simulated Mode** (default) and **Real Data Mode**.

## How to use Real Data

You can run the backend using either **Node.js** or **Python**.

### Option A: Node.js Backend
1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Start Server** (Admin/Sudo recommended for temps):
    ```bash
    npm run server
    ```

### Option B: Python Backend (Alternative)
If you prefer Python or want better NVIDIA GPU support via `gputil`.

1.  **Install Python Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```
2.  **Start Server**:
    ```bash
    python server.py
    ```

### Start Frontend
In a new terminal window:
```bash
npm start
```

The dashboard will automatically detect the server at `http://localhost:3001`.
