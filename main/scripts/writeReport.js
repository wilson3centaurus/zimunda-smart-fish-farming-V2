import axios from "https://cdn.jsdelivr.net/npm/axios@1.6.8/+esm";
import {
  getDatabase,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
} from "https://cdn.jsdelivr.net/npm/docx@7.1.0/build/index.js";
import { saveAs } from "https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
  databaseURL: "YOUR_FIREBASE_DATABASE_URL",
  projectId: "YOUR_FIREBASE_PROJECT_ID",
  storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
  appId: "YOUR_FIREBASE_APP_ID",
};

// Initialize Firebase app
initializeApp(firebaseConfig);

// Get a reference to the database
const database = getDatabase();

function getDatabaseJSON(dataPath) {
  console.log(`Fetching data from path: ${dataPath}`);
  return new Promise((resolve, reject) => {
    get(ref(database, dataPath))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          console.log("Data fetched successfully:", data);
          resolve(data);
        } else {
          console.warn("No data found at the specified path:", dataPath);
          resolve({}); // Resolve with an empty object if no data exists
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        reject(error);
      });
  });
}

async function generateReport(data) {
  console.log("Generating report with data:", data);
  try {
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3",
      prompt: `Analyze the following data and generate a report: ${JSON.stringify(
        data
      )}`,
    });
    console.log("Report generated successfully:", response.data.report);
    return response.data.report;
  } catch (error) {
    console.error("Error generating report:", error);
    throw error;
  }
}

async function createWordDocument(report) {
  console.log("Creating Word document with report:", report);
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun("Report Summary"),
              new TextRun({
                text: "\n" + report,
                break: 1,
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
  saveAs(blob, "Report.docx");
  console.log("Word document created and downloaded successfully.");
}

document.querySelector(".getData").addEventListener("click", async () => {
  const dataPath = "/"; // Replace with the desired path in your database

  try {
    console.log("Button clicked. Starting data fetching process...");
    const data = await getDatabaseJSON(dataPath);
    const jsonData = JSON.stringify(data, null, 2);
    console.log("Data fetched and JSON stringified:", jsonData);

    // Download the JSON data as a file
    const blob = new Blob([jsonData], {
      type: "application/json;charset=utf-8",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "data.json";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    console.log("JSON data downloaded successfully.");

    // Generate the report using AI
    const report = await generateReport(data);
    console.log("Report generated:", report);

    // Create a Word document with the report
    await createWordDocument(report);

    // Display the report
    document.getElementById("myDiv").innerText = report;
    console.log("Report displayed in the HTML.");
  } catch (error) {
    console.error("Error downloading or processing data:", error);
  }
});
