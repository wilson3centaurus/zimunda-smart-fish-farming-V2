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

  // Example usage: Animate water level change
  function animateWaterLevel(start, end, duration) {
    let startTime = null;

    function animationStep(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const currentLevel = start + (end - start) * progress;
      setWaterLevel(currentLevel);

      if (progress < 1) {
        requestAnimationFrame(animationStep);
      }
    }

    requestAnimationFrame(animationStep);
  }

  // Change this value to test different water levels (start, end, duration in ms)
  animateWaterLevel(0, 50, 1000); // Example: animate from 0% to 50% over 2 seconds
});



low = 240 | 244;
normal = 170 | 174;
high = 150 | 154;

