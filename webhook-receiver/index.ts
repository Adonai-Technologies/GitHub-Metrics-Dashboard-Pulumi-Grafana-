// import express from "express";
// // Removed body-parser as it is no longer needed
// import fs from "fs";

// const app = express();
// const PORT = 4000;

// // Middleware to parse JSON requests
// app.use(express.json());

// // Function to store data in a JSON file
// const saveEvent = (eventData: any) => {
//     const filePath = "github-events.json";

//     // Read existing data or create a new array
//     let events = [];
//     if (fs.existsSync(filePath)) {
//         const fileContent = fs.readFileSync(filePath, "utf8");
//         events = JSON.parse(fileContent);
//     }

//     // Append new event
//     events.push(eventData);

//     // Save back to file
//     fs.writeFileSync(filePath, JSON.stringify(events, null, 2));
// };

// // Webhook receiver endpoint
// app.post("/github-webhook", (req, res) => {
//     const eventType = req.headers["x-github-event"];
//     const payload = req.body;

//     console.log(`Received GitHub event: ${eventType}`);

//     // Store event data
//     saveEvent({ eventType, payload });

//     res.status(200).send("Event received");
// });

// // Start server
// app.listen(PORT, () => {
//     console.log(`Webhook receiver running on port ${PORT}`);
// });
