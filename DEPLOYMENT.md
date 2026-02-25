# SkinSight AI Server Deployment Guide

This guide explains how to keep your SkinSight AI model server running continuously on Windows.

## 🚀 Quick Start Options

### Option 1: Simple Background Script (Easiest)

**Run the server in a separate window:**

```powershell
.\start_server_background.ps1
```

This will open a new window with the server running. Close the window to stop the server.

---

### Option 2: PowerShell Background Job

**Run as a background job:**

```powershell
.\run_as_service.ps1
```

**To manage the job:**
```powershell
# Check status
Get-Job

# View output
Receive-Job -Id <JobID>

# Stop server
Stop-Job -Id <JobID>
Remove-Job -Id <JobID>
```

---

### Option 3: Using PM2 (Recommended for Production)

PM2 is a process manager that works great on Windows and provides auto-restart, logging, and monitoring.

**Install PM2:**
```bash
npm install -g pm2
```

**Start the server:**
```bash
pm2 start app.py --name skinsight-api --interpreter python
```

**Useful PM2 commands:**
```bash
# View status
pm2 status

# View logs
pm2 logs skinsight-api

# Stop server
pm2 stop skinsight-api

# Restart server
pm2 restart skinsight-api

# Auto-start on system boot
pm2 startup
pm2 save

# Monitor
pm2 monit
```

---

### Option 4: Windows Task Scheduler (Auto-start on Boot)

1. Open **Task Scheduler** (search in Start menu)
2. Click **Create Basic Task**
3. Name it: `SkinSight AI Server`
4. Trigger: **When the computer starts**
5. Action: **Start a program**
6. Program: `python.exe` (or full path to venv python)
7. Arguments: `app.py`
8. Start in: `E:\Final YR project\skinsight\backend\New folder\SkinSight-AI`
9. Check **"Open the Properties dialog"** → Click Finish
10. In Properties:
    - Check **"Run whether user is logged on or not"**
    - Check **"Run with highest privileges"**
    - Set **"If the task fails, restart every"** → 1 minute

---

### Option 5: Using NSSM (Windows Service)

NSSM (Non-Sucking Service Manager) allows you to run any executable as a Windows service.

**Download NSSM:**
- Visit: https://nssm.cc/download
- Extract `nssm.exe` to a folder in your PATH

**Install as service:**
```powershell
# Navigate to your project directory
cd "E:\Final YR project\skinsight\backend\New folder\SkinSight-AI"

# Install service (use venv python if available)
nssm install SkinSightAI "venv_new\Scripts\python.exe" "app.py"

# Set working directory
nssm set SkinSightAI AppDirectory "E:\Final YR project\skinsight\backend\New folder\SkinSight-AI"

# Start service
nssm start SkinSightAI
```

**Manage service:**
```powershell
# Stop
nssm stop SkinSightAI

# Restart
nssm restart SkinSightAI

# Remove service
nssm remove SkinSightAI confirm
```

---

### Option 6: Docker (Advanced)

Create a `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["python", "app.py"]
```

**Build and run:**
```bash
docker build -t skinsight-ai .
docker run -d -p 8000:8000 --name skinsight-server --restart unless-stopped skinsight-ai
```

---

## 🔧 Configuration

### Change Host/Port

Edit `app.py` line 231:

```python
if __name__ == "__main__":
    # For local network access, use 0.0.0.0
    # For production, consider using environment variables
    import os
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host=host, port=port)
```

Or use environment variables:
```powershell
$env:HOST="0.0.0.0"
$env:PORT="8000"
python app.py
```

### Production Settings

For production, use multiple workers:

```python
if __name__ == "__main__":
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=8000,
        workers=2,  # Number of worker processes
        log_level="info"
    )
```

---

## 📊 Monitoring

### Health Check Endpoint

Your server already has a health check endpoint:

```bash
curl http://localhost:8000/ping
```

Response:
```json
{
  "status": "alive",
  "filter_loaded": true,
  "fusion_loaded": true,
  "device": "cuda"
}
```

### Logging

Add logging to `app.py`:

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('server.log'),
        logging.StreamHandler()
    ]
)
```

---

## 🛡️ Security Considerations

1. **Firewall**: Ensure port 8000 is open if accessing from other machines
2. **CORS**: Currently set to `allow_origins=["*"]` - restrict in production
3. **Rate Limiting**: Consider adding rate limiting for production
4. **Authentication**: Add API keys or authentication for production use

---

## 🐛 Troubleshooting

### Server won't start
- Check if port 8000 is already in use: `netstat -ano | findstr :8000`
- Verify Python and dependencies are installed
- Check model files exist in `models/` directory

### Server stops unexpectedly
- Check logs for errors
- Use PM2 or NSSM for auto-restart capability
- Verify sufficient system resources (RAM, GPU memory)

### Can't access from other machines
- Ensure host is set to `0.0.0.0` not `localhost`
- Check Windows Firewall settings
- Verify network connectivity

---

## 📝 Recommended Setup for Production

1. **Use PM2** for process management
2. **Set up logging** to files
3. **Configure auto-restart** on failure
4. **Use reverse proxy** (nginx) for HTTPS
5. **Set up monitoring** (health checks, uptime monitoring)
6. **Restrict CORS** to your frontend domain
7. **Add rate limiting** to prevent abuse

---

## 🔗 Quick Reference

| Method | Best For | Auto-Restart | Logging |
|--------|----------|--------------|---------|
| Background Script | Development | ❌ | Console |
| PowerShell Job | Testing | ❌ | Job Output |
| PM2 | Production | ✅ | ✅ |
| Task Scheduler | Auto-start | ✅ | Event Viewer |
| NSSM | Windows Service | ✅ | Windows Logs |
| Docker | Containerized | ✅ | Docker Logs |
