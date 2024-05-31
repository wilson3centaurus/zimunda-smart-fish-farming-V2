const contactPoint = "whatsapp"; // Default contact point is SMS. Set to "whatsapp" for WhatsApp notifications.

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

  // Send notification based on the contact point
  /*
  if (contactPoint === "whatsapp") {
    sendWhatsAppMessage(message);
  } else {
    sendSMSMessage(message);
  }*/
}

function checkNotifications() {
  const notificationMessages = document.getElementById("notification-messages");
  const notificationIcon = document.getElementById("notification-icon");

  if (notificationMessages.children.length === 0) {
    notificationIcon.classList.remove("has-notifications");
  }
}

function checkServerState() {
  const url = "http://localhost:5000/data";
  const systemState = document.getElementById("systemState");

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Server is not running");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Server is running");
      systemState.innerText = "🟢Running";
      removeNotification("🚨 System is down");
      addNotification("✅ System is Up");
      console.log("✅ System is Up");
    })
    .catch((error) => {
      //console.error("Error checking server state:", error.message);
      systemState.innerText = "🔴Down";
      addNotification("🚨 System is down");
      removeNotification("✅ System is Up");
      console.log("🚨 System is down");
    });
}

function checkNetworkStatus() {
  if (!navigator.onLine) {
    addNotification("📡 Network is down");
    addNotification("⛔ Weather information unavailable");
    console.log("📡 Network is down");
    console.log("⛔ Weather information unavailable");
  } else {
    removeNotification("📡 Network is down");
    removeNotification("⛔ Real-time Weather information unavailable");
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

function checkSystem() {
  if (contactPoint === "whatsapp") {
    sendWhatsAppMessage(message);
    checkServerState();
    checkNetworkStatus();
  } else {
    sendSMSMessage(message);
    checkServerState();
    checkNetworkStatus();
  }
}

checkSystem();
setInterval(checkSystem, 2000);

function sendSMSMessage(message) {
  console.log("Attempting to send SMS message:", message);
  const myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    "App 47582a78c971fce00a3be1d16baa1a1d-c9c128c1-7e4a-499e-a7d2-8c1a4f908bc3"
  );
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Accept", "application/json");

  const raw = JSON.stringify({
    messages: [
      {
        destinations: [{ to: "263787209882" }],
        from: "ServiceSMS",
        text: message,
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("https://43px9n.api.infobip.com/sms/2/text/advanced", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log("SMS message sent:", result);
    })
    .catch((error) => {
      console.error("Error sending SMS message:", error);
    });
}

function sendWhatsAppMessage(message) {
  console.log("Attempting to send WhatsApp message:", message);
  const myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    "App 47582a78c971fce00a3be1d16baa1a1d-c9c128c1-7e4a-499e-a7d2-8c1a4f908bc3"
  );
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Accept", "application/json");

  const raw = JSON.stringify({
    messages: [
      {
        from: "447860099299",
        to: "263787209882",
        content: {
          templateName: "message_test",
          templateData: {
            body: {
              placeholders: [message],
            },
          },
          language: "en",
        },
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(
    "https://43px9n.api.infobip.com/whatsapp/1/message/template",
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      console.log("WhatsApp message sent:", result);
    })
    .catch((error) => {
      console.error("Error sending WhatsApp message:", error);
    });
}

// When the user clicks anywhere outside of the modal, close it
let modal = document.getElementById("id01");
let logoutModal = document.querySelector(".user-dropdown-modal");

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
  if (event.target == logoutModal) {
    logoutModal.style.display = "none";
  }
};
