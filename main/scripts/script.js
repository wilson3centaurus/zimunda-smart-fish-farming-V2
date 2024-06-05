function toggleNav() {
  var navToggle = document.getElementById("nav-toggle");
  navToggle.checked = !navToggle.checked;
}

const currentDate = new Date();

// Array of month names
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Format date as "DD Month YYYY"
const day = currentDate.getDate();
const month = monthNames[currentDate.getMonth()];
const year = currentDate.getFullYear();

document.querySelector(".currentDate").innerText = `${day} ${month} ${year}`;



/* ================ CHANGE EMAIL ========================== */
async function changeEmail() {
  const { value: email } = await Swal.fire({
    title: "Messages Preferences",
    input: "email",
    inputLabel: "Change the Notifications Contact Point",
    inputPlaceholder: "Enter your email address",
  });
  if (email) {
    Swal.fire({
      title: "Success",
      text: "Successfully changed the messages contact point.",
      icon: "success",
    });
  }
}

/* ================ CHANGE PHONE NUMBER ========================== */
async function changePhoneNumber() {
  const { value: phoneNumber } = await Swal.fire({
    title: "Messages Preferences",
    input: "tel",
    inputLabel: "Change the Notifications Contact Point",
    inputPlaceholder: "Enter your phone number",
    inputAttributes: {
      pattern: "[0-9]{10,15}",
    },
  });
  if (phoneNumber) {
    recipientPhoneNumber = phoneNumber;
    Swal.fire({
      title: "Success",
      text: "Successfully changed the messages contact point.",
      icon: "success",
    });
  }
}

function toggleWeatherContainer() {
  const weatherContainer = document.getElementById('weatherContainer');
  weatherContainer.style.display = weatherContainer.style.display === 'none' ? 'block'
 : 'none';
}


function featureDev() {
  Swal.fire("⚠️Feature still in Development⚒️");
};

function showGenerating() {
  const generateReport = document.querySelector(".generateReport");
  const loader = document.querySelector(".loader-container");

  generateReport.addEventListener("click", function () {
    //loader.style.display = "block";
    alert('');
  });
}