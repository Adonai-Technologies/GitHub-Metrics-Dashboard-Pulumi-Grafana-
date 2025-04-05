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


## 🛠️ Step-by-Step Guide for building your own Github Metrics Dashboard

### 1. 🌱 Setup Your Project Environment

```bash
# Create a new directory
mkdir github-metrics-dashboard && cd github-metrics-dashboard

# Initialize a new Pulumi project with TypeScript
pulumi new typescript

# Install dependencies
npm install @pulumi/pulumi @pulumi/github @pulumi/docker express body-parser


✅ Make sure you’ve authenticated Pulumi with your cloud and GitHub accounts

2. 🔐 Configure Pulumi Secrets (Optional but Recommended)
pulumi config set github:token <your_github_token> --secret
Use a GitHub personal access token with appropriate scopes (repo, admin:repo_hook).


3. ⚙️ Pulumi GitHub Provider Setup
Edit index.ts:

import * as github from "@pulumi/github";

// Create a webhook to capture GitHub events
const repoWebhook = new github.RepositoryWebhook("webhook", {
  repository: "your-repo-name",
  configuration: {
    url: "http://your-webhook-server.com/events",
    contentType: "json",
    insecureSsl: false,
    secret: "your-secret",
  },
  events: ["push", "issues", "pull_request"],
});

Replace "your-repo-name" and webhook URL with your actual values.

4. 🚀 Build the Webhook Receiver
Create webhook-server.ts:

import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

app.post("/events", (req, res) => {
  const event = req.headers["x-github-event"];
  console.log(`Received GitHub event: ${event}`, req.body);
  // Save or process the event for Grafana here
  res.sendStatus(200);
});

app.listen(3000, () => console.log("Webhook server running on http://localhost:3000"));

Run it with: npx ts-node webhook-server.ts

5. 📊 Set Up Grafana Dashboard
Run Grafana locally using Docker:
docker run -d -p 3001:3000 --name=grafana grafana/grafana

Access Grafana at: http://localhost:3001
Default login: admin / admin

In Grafana:

Add a JSON or file-based data source (or mock one for now)

Build panels for metrics like:

Pull requests over time

Issues opened/closed

Push frequency

Top contributors



6. 🤖 Automate Deployment with Pulumi Automation API
Create run.ts:

import * as pulumi from "@pulumi/pulumi/x/automation";
import * as path from "path";

(async () => {
  const projectName = "github-metrics-dashboard";
  const stackName = "dev";

  const args = {
    stackName,
    projectName,
    program: async () => require("./index"),
  };

  const stack = await pulumi.LocalWorkspace.createOrSelectStack(args);
  console.log("Running Pulumi up...");
  await stack.up();
})();

Run it with: npx ts-node run.ts

7. 🧪 Test It Out
Push to your GitHub repo

Watch your webhook server log the event

Confirm Grafana reflects incoming metrics


🧼 Clean Up

pulumi destroy
docker stop grafana && docker rm grafana
