const low_1 = 240;
const low_2 = 244;
const normal_1 = 170;
const normal_2 = 174;
const high_1 = 150;
const high_2 = 154;

function setWaterHeight(beforeHeight, afterHeight) {
  // Create or update the style element for ::before pseudo-element
  let beforeStyle = document.getElementById("beforeStyle");
  if (!beforeStyle) {
    beforeStyle = document.createElement("style");
    beforeStyle.id = "beforeStyle";
    document.head.appendChild(beforeStyle);
  }
  beforeStyle.innerHTML = `.waterContainer::before { height: ${beforeHeight}%; }`;

  // Create or update the style element for ::after pseudo-element
  let afterStyle = document.getElementById("afterStyle");
  if (!afterStyle) {
    afterStyle = document.createElement("style");
    afterStyle.id = "afterStyle";
    document.head.appendChild(afterStyle);
  }
  afterStyle.innerHTML = `.waterContainer::after { height: ${afterHeight}%; }`;
}

// Example usage:
setWaterHeight(normal_1, normal_2);
