"""
LifeScan AI - Full-Stack Unified System Launcher

Launches all 3 services concurrently:
1. Python Flask ML Service (Port 5000)
2. Node.js & Express API Backend (Port 5001)
3. React Vite Frontend Web App (Port 5173)
"""

import subprocess
import sys
import os
import time
import signal

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ML_DIR = os.path.join(BASE_DIR, "ml-service")
BACKEND_DIR = os.path.join(BASE_DIR, "backend")
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")

processes = []

def cleanup(signum=None, frame=None):
    print("\n\nShutting down all LifeScan AI services...")
    for p in processes:
        try:
            p.terminate()
        except Exception:
            pass
    sys.exit(0)

signal.signal(signal.SIGINT, cleanup)
signal.signal(signal.SIGTERM, cleanup)

def main():
    print("=" * 65)
    print("  🏥 LifeScan AI — Heart Failure Detection Full-Stack System")
    print("=" * 65)

    # 1. Start Flask ML Service (Port 5000)
    print("\n[1/3] Starting Flask ML Microservice (Port 5000)...")
    ml_proc = subprocess.Popen(
        [sys.executable, "app.py"],
        cwd=ML_DIR
    )
    processes.append(ml_proc)
    time.sleep(2)

    # 2. Start Express Backend (Port 5001)
    print("[2/3] Starting Express Backend API (Port 5001)...")
    backend_cmd = "npm start" if os.name != 'nt' else "cmd /c npm start"
    backend_proc = subprocess.Popen(
        backend_cmd,
        cwd=BACKEND_DIR,
        shell=True
    )
    processes.append(backend_proc)
    time.sleep(2)

    # 3. Start React Frontend (Port 5173)
    print("[3/3] Starting React Vite Frontend (Port 5173)...")
    frontend_cmd = "npm run dev" if os.name != 'nt' else "cmd /c npm run dev"
    frontend_proc = subprocess.Popen(
        frontend_cmd,
        cwd=FRONTEND_DIR,
        shell=True
    )
    processes.append(frontend_proc)

    print("\n" + "=" * 65)
    print("  ✅ All LifeScan AI services are running!")
    print("  🌐 Frontend URL   : http://localhost:5173")
    print("  📡 Backend API    : http://localhost:5001/api")
    print("  🤖 ML Service     : http://localhost:5000")
    print("=" * 65)
    print("  Press Ctrl+C to stop all services.\n")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        cleanup()

if __name__ == "__main__":
    main()
