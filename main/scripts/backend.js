// getData.js
const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");

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


// Fetch data from Firebase
async function fetchData() {
  try {
    const dbRef = admin.database().ref("/sensor_data");
    const snapshot = await dbRef.once("value");
    return snapshot.val();
  } catch (error) {
    console.error("Error fetching data from Firebase:", error);
    throw error;
  }
}

// Serve data as JSON
app.get("/data", async (req, res) => {
  try {
    const data = await fetchData();
    const formattedData = Object.values(data).map((entry) => ({
      temperature: entry.temperature,
      timestamp: entry.timestamp,
    }));
    res.json({ sensor_data: formattedData });
  } catch (error) {
    console.error("Error serving data:", error);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
