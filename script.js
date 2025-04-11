const dateInput = document.getElementById("dateInput");
const spinner = document.getElementById("spinner");
const apodBox = document.getElementById("apodBox");
const milestoneBox = document.getElementById("milestone");
const milestoneContent = document.getElementById("milestoneContent");

const title = document.getElementById("title");
const dateText = document.getElementById("dateText");
const media = document.getElementById("media");
const explanation = document.getElementById("explanation");
// Restrict future dates
const today = new Date().toISOString().split("T")[0];
document.getElementById("dateInput").setAttribute("max", today);


let milestones = [];

async function loadMilestones() {
  try {
    const res = await fetch('milestones.json');
    milestones = await res.json();
  } catch (error) {
    console.error("Failed to load milestone.json:", error);
  }
}
window.addEventListener('DOMContentLoaded', async () => {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("dateInput").setAttribute("max", today);
  
  await loadMilestones();
  showTodayMilestone();
});


dateInput.addEventListener("change", async () => {
  const selectedDate = dateInput.value;
  if (!selectedDate) return;

  spinner.classList.remove("hidden");
  apodBox.classList.add("hidden");
  milestoneBox.classList.add("hidden");

  try {
    // Fetch NASA APOD
    const response = await fetch(`/api/apod?date=${selectedDate}`);
    const data = await response.json();

    title.textContent = data.title;
    dateText.textContent = data.date;
    explanation.textContent = data.explanation;

    media.innerHTML = data.media_type === "image"
      ? `<img src="${data.url}" alt="NASA APOD Image" />`
      : `<iframe src="${data.url}" frameborder="0" allowfullscreen></iframe>`;

    apodBox.classList.remove("hidden");

    // Display Milestones
    const [year, month, day] = selectedDate.split("-").map(Number);
    const todayMilestones = milestones.filter(m => m.month === month && m.day === day);

    if (todayMilestones.length > 0) {
      milestoneContent.innerHTML = todayMilestones.map(m => `
        <div class="milestone-entry">
          <strong>${m.year} — ${m.title}</strong><br />
          <em>${m.country}</em>: ${m.description}
        </div>
      `).join("");
      milestoneBox.classList.remove("hidden");
    }

  } catch (error) {
    console.error("Error fetching APOD:", error);
  } finally {
    spinner.classList.add("hidden");
  }
});

// Initial milestone load
loadMilestones();

document.getElementById("downloadBtn").addEventListener("click", async () => {
  const img = document.querySelector("#media img");
  if (!img) return alert("Only images can be downloaded.");

  const imageURL = img.src;
  const a = document.createElement("a");
  a.href = imageURL;
  a.download = "NASA_APOD.jpg";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});

document.getElementById("shareBtn").addEventListener("click", () => {
  const title = document.getElementById("title").textContent;
  const date = document.getElementById("dateText").textContent;
  const tweetText = `Check out NASA's Astronomy Picture of the Day for ${date}: "${title}" 🌌`;
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=https://apod.nasa.gov/`;

  window.open(tweetUrl, "_blank");
});

const shootingStarContainer = document.getElementById("shootingStarContainer");

for (let i = 0; i < 10; i++) {
  const star = document.createElement("div");
  star.classList.add("shooting-star");
  star.style.top = `${Math.random() * 80}vh`;
  star.style.left = `${Math.random() * 100}vw`;
  star.style.animationDelay = `${Math.random() * 15}s`;
  star.style.animationDuration = `${2 + Math.random() * 2}s`;
  shootingStarContainer.appendChild(star);
}
const starContainer = document.getElementById("starContainer");

for (let i = 0; i < 80; i++) {
  const glowStar = document.createElement("div");
  glowStar.classList.add("glowing-star");
  glowStar.style.top = `${Math.random() * 100}vh`;
  glowStar.style.left = `${Math.random() * 100}vw`;
  glowStar.style.animationDelay = `${Math.random() * 5}s`;
  starContainer.appendChild(glowStar);
}
