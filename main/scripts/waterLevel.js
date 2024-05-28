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
if (waterLevel1 === low_1 || waterLevel2 === low_2) {
    waterLevelStatus.innerHTML = "⚠️Low Water Level!";
    waterLevelStatus.style.color = "red";
}
if (waterLevel1 === normal_1 || waterLevel2 === normal_2) {
    waterLevelStatus.innerHTML = "😴Normal Water Level🏖️";
    waterLevelStatus.style.color = "green";
    waterLevelStatus.style.width = "190px";
}
if (waterLevel1 === high_1 || waterLevel2 === high_2) {
  waterLevelStatus.innerHTML = "⚠️High Water Level! 🌊Overflow Expected!";
  waterLevelStatus.style.color = "red";
}
