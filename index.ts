import * as pulumi from "@pulumi/pulumi";
import * as github from "@pulumi/github";
import * as k8s from "@pulumi/kubernetes";

// Load configuration values
const config = new pulumi.Config();
const githubToken = config.requireSecret("githubToken");
const webhookSecret = config.requireSecret("webhookSecret");

// GitHub provider
const githubProvider = new github.Provider("github", {
    token: githubToken,
});

// Create GitHub repository
const repo = new github.Repository("metrics-dashboard", {
    name: "metrics-dashboard",
    description: "GitHub Metrics Dashboard managed by Pulumi",
    visibility: "public",
    autoInit: true,
}, { provider: githubProvider });

// Define webhook endpoint (replace with your actual endpoint)
const webhookUrl = "https://occurrence-style-rj-owners.trycloudflare.com/github-webhook";

// Create GitHub Webhook
const webhook = new github.RepositoryWebhook("metricsWebhook", {
    repository: repo.name,
    configuration: {
        url: webhookUrl,
        contentType: "json",
        secret: webhookSecret,  // Secure webhook secret
        insecureSsl: false,  // Set to true if using self-signed certs
    },
    events: ["push", "pull_request", "issues"],
}, { provider: githubProvider });

// Kubernetes namespace
const namespace = new k8s.core.v1.Namespace("grafana-ns", {
    metadata: { name: "grafana" },
});

// Deploy Grafana to Kubernetes
const grafanaDeployment = new k8s.apps.v1.Deployment("grafana", {
    metadata: { namespace: namespace.metadata.name },
    spec: {
        replicas: 1,
        selector: { matchLabels: { app: "grafana" } },
        template: {
            metadata: { labels: { app: "grafana" } },
            spec: {
                containers: [{
                    name: "grafana",
                    image: "grafana/grafana:latest",
                    ports: [{ containerPort: 3000 }],
                    env: [
                        { name: "GF_SECURITY_ADMIN_USER", value: "admin" },
                        { name: "GF_SECURITY_ADMIN_PASSWORD", value: "admin" }, // Change in production!
                    ],
                }],
            },
        },
    },
});

// Create a Kubernetes Service for Grafana
const grafanaService = new k8s.core.v1.Service("grafana-service", {
    metadata: { namespace: namespace.metadata.name },
    spec: {
        selector: { app: "grafana" },
        ports: [{ port: 80, targetPort: 3000 }],
        type: "LoadBalancer",
    },
});

// Export repository URL, webhook ID, and Grafana service URL
export const repoUrl = repo.htmlUrl;
export const webhookId = webhook.id;
export const grafanaUrl = pulumi.interpolate`http://${grafanaService.metadata.name}.${namespace.metadata.name}.svc.cluster.local`;
