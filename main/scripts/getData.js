const TEMP_THRESHOLD_LOW = 18;
const TEMP_THRESHOLD_HIGH = 30;

async function getDataFromFirebase() {
  try {
    const response = await fetch(
      "https://zimunda-sensor-data-default-rtdb.firebaseio.com/sensor_data.json"
    );
    const temperatures = await response.json();
    const data = [];

    if (temperatures) {
      Object.keys(temperatures).forEach((key) => {
        const value = temperatures[key];
        if (value.timestamp) {
          data.push({
            timestamp: value.timestamp,
            temperature: value.temperature,
            waterLevel: value.water_level,
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

    const latestLevel = data[data.length - 1];
    waterLevel = latestLevel.waterLevel;
    console.log("Water level: ", waterLevel);

    if (data.length > 0) {
      const latest = data[data.length - 1];
      const first = data[0];
      const latestTemp = latest.temperature;
      const latestTimestamp = latest.timestamp;
      const uptime =
        (new Date(latestTimestamp) - new Date(first.timestamp)) / 1000; // uptime in seconds
      const uptimeString = new Date(uptime * 1000).toISOString().substr(11, 8); // HH:MM:SS format

      const statusMessage = `
        Latest Temperature: ${latestTemp}°C
        Last Updated: ${latestTimestamp}
        Total Uptime: ${uptimeString}
        Temp Threshold: ${TEMP_THRESHOLD_LOW}°C - ${TEMP_THRESHOLD_HIGH}°C
        Water Level: ${waterLevel === 0 ? "Low" : "Normal"}
      `;

      console.log(statusMessage);

      /* ================================================================================= */
      const low_1 = 240;
      const low_2 = 244;
      const normal_1 = 170;
      const normal_2 = 174;
      const high_1 = 150;
      const high_2 = 154;

      function setWaterHeight(beforeHeight, afterHeight) {
        let beforeStyle = document.getElementById("beforeStyle");
        if (!beforeStyle) {
          beforeStyle = document.createElement("style");
          beforeStyle.id = "beforeStyle";
          document.head.appendChild(beforeStyle);
        }
        beforeStyle.innerHTML = `.waterContainer::before { height: ${beforeHeight}%; }`;

        let afterStyle = document.getElementById("afterStyle");
        if (!afterStyle) {
          afterStyle = document.createElement("style");
          afterStyle.id = "afterStyle";
          document.head.appendChild(afterStyle);
        }
        afterStyle.innerHTML = `.waterContainer::after { height: ${afterHeight}%; }`;
      }

      if (waterLevel === 1) {
        waterLevel1 = normal_1;
        waterLevel2 = normal_2;
      } else {
        waterLevel1 = low_1;
        waterLevel2 = low_2;
      }

      setWaterHeight(waterLevel1, waterLevel2);

      let waterLevelStatus = document.querySelector(".waterLevelStatus");

      function updateWaterLevelStatus() {
        const pump1Switch = document.getElementById("pump1-switch");
        const pump2Switch = document.getElementById("pump2-switch");

        if (waterLevel1 === low_1 || waterLevel2 === low_2) {
          waterLevelStatus.innerHTML = "⚠️Low Water Level!";
          waterLevelStatus.style.color = "red";
          // Open inlet pump, close outlet pump
          //document.getElementById("pump1-switch").checked = true;
          //document.getElementById("pump2-switch").checked = false;
          if (pump1ManualState === null) {
            document.getElementById("pump1-switch").checked = true;
          }
          if (pump2ManualState === null) {
            document.getElementById("pump2-switch").checked = false;
          }
        } else if (waterLevel1 === normal_1 || waterLevel2 === normal_2) {
          waterLevelStatus.innerHTML = "😴Normal Water Level🏖️";
          waterLevelStatus.style.color = "green";
          waterLevelStatus.style.width = "190px";
          // Close both pumps
          document.getElementById("pump1-switch").checked = false;
          document.getElementById("pump2-switch").checked = false;
        } else if (waterLevel1 === high_1 || waterLevel2 === high_2) {
          waterLevelStatus.innerHTML =
            "⚠️High Water Level! 🌊Overflow Expected!";
          waterLevelStatus.style.color = "red";
          // Open outlet pump, close inlet pump
          document.getElementById("pump1-switch").checked = false;
          document.getElementById("pump2-switch").checked = true;
          //document.getElementById("pump1-switch").disabled = true;
          //document.getElementById("pump2-switch").disabled = true;
        }
      }

      updateWaterLevelStatus();

      document.addEventListener("DOMContentLoaded", function () {
        // Get references to the checkboxes and status elements
        const pump1Switch = document.getElementById("pump1-switch");
        const pump2Switch = document.getElementById("pump2-switch");
        const pump1Status = document.getElementById("pump1-status");
        const pump2Status = document.getElementById("pump2-status");

        // Function to update the pump status based on the checkbox state
        function updatePumpStatus(pumpSwitch, pumpStatus) {
          if (pumpSwitch.checked) {
            pumpStatus.textContent = "🟢running";
          } else {
            pumpStatus.textContent = "🔴stopped";
          }
        }

        // Initial status update
        updatePumpStatus(pump1Switch, pump1Status);
        updatePumpStatus(pump2Switch, pump2Status);

        // Event listeners for the checkboxes
        pump1Switch.addEventListener("change", function () {
          updatePumpStatus(pump1Switch, pump1Status);
        });

        pump2Switch.addEventListener("change", function () {
          updatePumpStatus(pump2Switch, pump2Status);
        });
      });

      /* ================================================================================= */

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
      if (thresholdDisplay)
        thresholdDisplay.innerText = `Temp Threshold: ${TEMP_THRESHOLD_LOW}°C - ${TEMP_THRESHOLD_HIGH}°C`;
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
    "EAALi0GGITnUBO2mEd3SCAQzL0jyVwihD0LkAhC2GT6JE8hDXIRXpX6wlQ8mOvqzgumoWa444G9rqSA1aU4IBZAkerkFMfhcrFiiEUZAj6E36mxlDhRjnd1ZA7sGR6SSXI7CtYjTkTFdpgjRpRv1gYm9dYrPSY9IgbIy4QzZCzsOoPK7ILZBXCZApuPXFR7l3YbTZAfZBe53gZCuu8fAFoBnLr";
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
