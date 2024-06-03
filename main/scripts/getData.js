const firebaseConfig = {
  apiKey: "AIzaSyDnG1Kr_vUrdoVcE2SAbzEiG-tBPSe6-kw",
  authDomain: "zimunda-sensor-data.firebaseapp.com",
  databaseURL: "https://zimunda-sensor-data-default-rtdb.firebaseio.com",
  projectId: "zimunda-sensor-data",
  storageBucket: "zimunda-sensor-data.appspot.com",
  messagingSenderId: "260289735455",
  appId: "1:260289735455:web:c70d169bc8b86945cb1e2a",
  measurementId: "G-WFH79MCPNP",
};

const TEMP_THRESHOLD_LOW = 18;
const TEMP_THRESHOLD_HIGH = 25;

async function getDataFromFirebase() {
  try {
    const response = await fetch(
      "https://zimunda-sensor-data-default-rtdb.firebaseio.com/temperature.json"
    );
    const temperatures = await response.json();
    const data = [];

    if (temperatures) {
      Object.keys(temperatures).forEach((key) => {
        const value = temperatures[key];
        if (value.timestamp) {
          data.push({
            timestamp: value.timestamp,
            celsius: value.celsius,
          });
        }
      });
      data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      return data;
    } else {
      console.log("No temperature data available.");
      return [];
    }
  } catch (error) {
    console.log("Failed to fetch data from Firebase!");
    throw error;
  }
}

async function displayData() {
  try {
    const data = await getDataFromFirebase();
    if (data.length > 0) {
      const latest = data[data.length - 1];
      const first = data[0];
      const latestTemp = latest.celsius;
      const latestTimestamp = latest.timestamp;
      const uptime =
        (new Date(latestTimestamp) - new Date(first.timestamp)) / 1000; // uptime in seconds
      const uptimeString = new Date(uptime * 1000).toISOString().substr(11, 8); // HH:MM:SS format

      const statusMessage = `
        Latest Temperature: ${latestTemp}°C
        Last Updated: ${latestTimestamp}
        Total Uptime: ${uptimeString}
        Temp Threshold: ${TEMP_THRESHOLD_LOW}°C - ${TEMP_THRESHOLD_HIGH}°C
      `;

      console.log(statusMessage);

      // Check if temperature is outside the threshold
      if (latestTemp < TEMP_THRESHOLD_LOW || latestTemp > TEMP_THRESHOLD_HIGH) {
        const alertMessage = `🚨 The temperature is ${latestTemp}°C, which is outside the threshold of ${TEMP_THRESHOLD_LOW}°C - ${TEMP_THRESHOLD_HIGH}°C. Please take action.`;
        addNotification(alertMessage);
      }

      // Updating HTML
      const lastUpdate = document.getElementById("lastUpdate");
      const upTime = document.getElementById("uptime");
      const thresholdDisplay = document.getElementById("thresholdDisplay");
      if (lastUpdate) lastUpdate.innerText = `${latestTimestamp}`;
      if (upTime) upTime.innerText = `${uptimeString}`;
      if (thresholdDisplay) thresholdDisplay.innerText = `Temp Threshold: ${TEMP_THRESHOLD_LOW}°C - ${TEMP_THRESHOLD_HIGH}°C`;
      
    } else {
      console.log("No data available.");
      const myDiv = document.getElementById("myDiv");
      if (myDiv) {
        myDiv.innerText = "No data available.";
      }
    }
  } catch (error) {
    console.log("Error fetching and displaying data!");
    const myDiv = document.getElementById("myDiv");
    if (myDiv) {
      myDiv.innerText = "Error fetching data.";
    }
  }
}

// Notification functions (assuming these are the same as in notifications.js)
async function sendWhatsAppNotification(message) {
  const accessToken =
    "EAALi0GGITnUBOwzce4OBI4oybx0EjNzPnUZApZCeDyJ9c5I0xDHSVPldmcgJAZCPcoSjd0ETsmHQZArFcqzmRsNZAQcjpx6Q7QACvNvcQiQZBO2chiGv79WPDGLc8fZB0QjOQzfTVxBPw53ZCo9DnPlQuIKmAZAt7wCceCEmluySkJHPEuJAnZBZAQHYZA5EjWsiUWjB4pfxrJovZClvfZBlpUZCOkZD";
  const phoneNumberId = "312573365276673";
  const recipientPhoneNumber = "263787209882";

  const url = `https://graph.facebook.com/v16.0/${phoneNumberId}/messages`;

  const body = {
    messaging_product: "whatsapp",
    to: recipientPhoneNumber,
    type: "text",
    text: {
      body: message,
    },
  };

  try {
    console.log("Sending WhatsApp message:", message);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log("WhatsApp Response:", data);
    if (data.error) {
      console.error("Error sending WhatsApp message:", data.error.message);
    } else {
      console.log("WhatsApp message sent successfully");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function addNotification(message) {
  const notificationMessages = document.getElementById("notification-messages");
  const notificationIcon = document.getElementById("notification-icon");

  // Checking if the message already exists
  for (let i = 0; i < notificationMessages.children.length; i++) {
    if (notificationMessages.children[i].textContent.includes(message)) {
      return; // If message exists, do not add another one
    }
  }

  // Creating new notification element
  const p = document.createElement("p");
  p.innerHTML = `${message} <button onclick="this.parentElement.remove(); checkNotifications();">Clear</button>`;
  notificationMessages.appendChild(p);

  // Change notification icon to indicate there are new notifications
  notificationIcon.classList.add("has-notifications");

  // Send WhatsApp notification
  sendWhatsAppNotification(message).catch((error) => {
    console.error("Error sending WhatsApp notification:", error);
  });
}

function checkNotifications() {
  const notificationMessages = document.getElementById("notification-messages");
  const notificationIcon = document.getElementById("notification-icon");

  if (notificationMessages.children.length === 0) {
    notificationIcon.classList.remove("has-notifications");
  }
}

function removeNotification(message) {
  const notificationMessages = document.getElementById("notification-messages");
  for (let i = 0; i < notificationMessages.children.length; i++) {
    if (notificationMessages.children[i].textContent.includes(message)) {
      notificationMessages.children[i].remove();
      checkNotifications();
      break;
    }
  }
}

// Display data initially
displayData();

// Set interval to show the system status every 5 seconds
setInterval(displayData, 2000);
