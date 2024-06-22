// backend.js
const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");

// Initialize Firebase Admin SDK
const serviceAccount = require("./zimunda-sensor-data-firebase-adminsdk-nqbrf-ad611c1e7e.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://zimunda-sensor-data-default-rtdb.firebaseio.com",
});

const app = express();
const port = 5000;

app.use(
  cors({
    origin: "http://127.0.0.1:5501/",
  })
);

// Create HTTP server and WebSocket server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Fetch initial data from Firebase and set up a real-time listener
const dbRef = admin.database().ref("/temperature");

dbRef.on("value", (snapshot) => {
  const data = snapshot.val();
  const formattedData = Object.values(data).map((entry) => ({
    temperature: entry.celsius,
    timestamp: entry.timestamp,
  }));

  // Send data to all connected WebSocket clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ sensor_data: formattedData }));
    }
  });
});

// Serve initial data as JSON for Grafana setup
app.get("/data", async (req, res) => {
  try {
    const snapshot = await dbRef.once("value");
    const data = snapshot.val();
    const formattedData = Object.values(data).map((entry) => ({
      temperature: entry.celsius,
      timestamp: entry.timestamp,
    }));
    res.json({ sensor_data: formattedData });
  } catch (error) {
    console.error("Error serving data:", error);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
