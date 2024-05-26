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