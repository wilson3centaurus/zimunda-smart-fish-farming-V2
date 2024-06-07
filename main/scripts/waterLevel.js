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

let waterLevel1 = normal_1;
let waterLevel2 = normal_2;

setWaterHeight(waterLevel1, waterLevel2);

let waterLevelStatus = document.querySelector(".waterLevelStatus");

function updateWaterLevelStatus() {
  if (waterLevel1 === low_1 || waterLevel2 === low_2) {
    waterLevelStatus.innerHTML = "⚠️Low Water Level!";
    waterLevelStatus.style.color = "red";
    // Open inlet pump, close outlet pump
    document.getElementById("pump1-switch").checked = true;
    document.getElementById("pump2-switch").checked = false;
  } else if (waterLevel1 === normal_1 || waterLevel2 === normal_2) {
    waterLevelStatus.innerHTML = "😴Normal Water Level🏖️";
    waterLevelStatus.style.color = "green";
    waterLevelStatus.style.width = "190px";
    // Close both pumps
    document.getElementById("pump1-switch").checked = false;
    document.getElementById("pump2-switch").checked = false;
  } else if (waterLevel1 === high_1 || waterLevel2 === high_2) {
    waterLevelStatus.innerHTML = "⚠️High Water Level! 🌊Overflow Expected!";
    waterLevelStatus.style.color = "red";
    // Open outlet pump, close inlet pump
    document.getElementById("pump1-switch").checked = false;
    document.getElementById("pump2-switch").checked = true;
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

// Firebase configuration
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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Reference to Firebase database
const dbRef = firebase.database().ref("/sensor_data");

// Function to set water levels based on Firebase data
function setWaterLevels(waterLevel) {
  let waterLevel1, waterLevel2;

  if (waterLevel === 1) {
    waterLevel1 = normal_1;
    waterLevel2 = normal_2;
  } else {
    waterLevel1 = low_1;
    waterLevel2 = low_2;
  }

  setWaterHeight(waterLevel1, waterLevel2);
}

// Listen for changes in water level in Firebase
dbRef.child("water_level").on("value", (snapshot) => {
  const waterLevel = snapshot.val();
  setWaterLevels(waterLevel);
});
