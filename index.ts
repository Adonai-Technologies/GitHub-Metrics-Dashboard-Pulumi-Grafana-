import * as pulumi from "@pulumi/pulumi";
import * as github from "@pulumi/github";

// Load GitHub token from Pulumi config
const config = new pulumi.Config();
const githubToken = config.requireSecret("githubToken");

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
// Define a custom domain for the webhook (optional)
;

// Create GitHub Webhook
const webhook = new github.RepositoryWebhook("metricsWebhook", {
    repository: repo.name,
    configuration: {
        url: webhookUrl,
        contentType: "json",
        secret: config.requireSecret("webhookSecret"),  // Secure webhook secret
        insecureSsl: false,  // Set to true if using self-signed certs
    },
    events: ["push", "pull_request", "issues"],
}, { provider: githubProvider });

// Export repository URL and webhook ID
export const repoUrl = repo.htmlUrl;
export const webhookId = webhook.id;
