const RASPBERRY_PI_IP = "http://<RASPBERRY_PI_IP>:5000";

document.getElementById("inlet-on").addEventListener("click", function () {
  fetch(`${RASPBERRY_PI_IP}/control-pump`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pump: "inlet", action: "on" }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

document.getElementById("inlet-off").addEventListener("click", function () {
  fetch(`${RASPBERRY_PI_IP}/control-pump`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pump: "inlet", action: "off" }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

document.getElementById("outlet-on").addEventListener("click", function () {
  fetch(`${RASPBERRY_PI_IP}/control-pump`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pump: "outlet", action: "on" }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

document.getElementById("outlet-off").addEventListener("click", function () {
  fetch(`${RASPBERRY_PI_IP}/control-pump`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pump: "outlet", action: "off" }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
