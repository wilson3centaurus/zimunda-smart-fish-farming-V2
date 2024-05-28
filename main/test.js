document.addEventListener("DOMContentLoaded", () => {
  const waterLevelStatus = document.getElementById("water-level-status");
  const wavesContainer = document.querySelector(".waves-container");
  const containerHeight = document.querySelector(".container").offsetHeight;

  function setWaterLevel(percentage) {
    // Clamp percentage between 0 and 100
    percentage = Math.max(0, Math.min(percentage, 100));
    // Calculate the height in pixels
    const height = (containerHeight * percentage) / 100;

    // Set the height of the waves container
    wavesContainer.style.height = `${height}px`;

    // Update water level status
    if (percentage < 10) {
      waterLevelStatus.textContent = "Water level status: Low";
    } else if (percentage >= 95) {
      waterLevelStatus.textContent = "Water level status: Overflow";
    } else {
      waterLevelStatus.textContent = "Water level status: Normal";
    }
  }

  // Example usage:
  setWaterLevel(100); // Change this value to test different water levels
});
