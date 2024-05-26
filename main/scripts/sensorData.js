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
      })
      .catch((error) => {
        //console.log("Error: " + error);
        systemState.innerText = "🔴Down";
        addNotification("🚨 System is down");
        removeNotification("✅ System is Up");
      });
  }
  
  function checkNetworkStatus() {
    if (!navigator.onLine) {
      addNotification("📡 Network is down");
      addNotification("⛔ Weather information unavailable");
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
    checkServerState();
    checkNetworkStatus();
  }
  
  checkSystem();
  setInterval(checkSystem, 2000);