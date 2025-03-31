# GitHub Metrics Dashboard (Pulumi & Grafana)

## Overview
This project is a **GitHub Metrics Dashboard**, built for the **Get Creative with Pulumi and GitHub Challenge**. It automates GitHub analytics visualization using **Pulumi**, **GitHub Webhooks**, and **Grafana**. The system collects GitHub repository events, processes them, and displays them in a Grafana dashboard for real-time insights.

## Features
- **Automated GitHub Metrics Collection** – Uses webhooks to track repository activity.
- **Pulumi Infrastructure as Code (IaC)** – Deploys and configures cloud resources.
- **Grafana Visualization** – Presents GitHub analytics with rich dashboards.
- **Scalable and Flexible** – Supports multiple repositories and event types.

## Tech Stack
- **Pulumi** (Infrastructure as Code)
- **GitHub Webhooks** (Event Processing)
- **Node.js & TypeScript** (Webhook Receiver)
- **Grafana** (Metrics Visualization)
- **Cloudflare Tunnel** (Webhook Exposure)

## Setup Guide

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/yourusername/github-metrics-dashboard.git
cd github-metrics-dashboard
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Set Up Webhook Receiver
```sh
cd webhook-receiver
npm install
node index.js
```
If successful, you should see:
```
Webhook receiver running on port 4000
```

### 4️⃣ Expose Webhook Receiver
```sh
cloudflared tunnel --url http://localhost:4000
```
This generates a public URL, e.g.:
```
https://your-tunnel.trycloudflare.com
```

### 5️⃣ Configure GitHub Webhook
1. Go to your GitHub repository.
2. Navigate to **Settings** > **Webhooks**.
3. Click **Add Webhook**.
4. Set the **Payload URL** to `https://your-tunnel.trycloudflare.com/github-webhook`.
5. Choose **application/json** as the content type.
6. Select the events (push, pull request, issues, etc.).
7. Click **Add Webhook**.

### 6️⃣ Deploy to Cloud with Pulumi
Ensure you have Pulumi installed and configured.
```sh
pulumi up
```

### 7️⃣ Access Grafana Dashboard
Once Pulumi provisions Grafana, access it via the provided URL and configure data sources.

## Contribution
Contributions are welcome! Feel free to submit issues and pull requests.

## License
MIT License. See `LICENSE` for details.

---
🚀 **Built for the Get Creative with Pulumi and GitHub Challenge!**

