const dateInput = document.getElementById("dateInput");
const spinner = document.getElementById("spinner");
const apodBox = document.getElementById("apodBox");
const milestoneBox = document.getElementById("milestone");
const milestoneContent = document.getElementById("milestoneContent");

const title = document.getElementById("title");
const dateText = document.getElementById("dateText");
const media = document.getElementById("media");
const explanation = document.getElementById("explanation");

let milestones = [];

async function loadMilestones() {
  try {
    const res = await fetch('milestones.json');
    milestones = await res.json();
  } catch (error) {
    console.error("Failed to load milestone.json:", error);
  }
}

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

document.getElementById("downloadBtn").addEventListener("click", () => {
  const img = document.querySelector("#media img");
  if (!img) {
    alert("No image available to download.");
    return;
  }

  const imageUrl = img.src;
  const imageName = `NASA_APOD_${document.getElementById("dateText").textContent}.jpg`;

  const a = document.createElement("a");
  a.href = imageUrl;
  a.download = imageName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});

document.getElementById("shareBtn").addEventListener("click", () => {
  const img = document.querySelector("#media img");
  const title = document.getElementById("title").textContent;
  const date = document.getElementById("dateText").textContent;
  const url = img ? img.src : window.location.href;

  const tweetText = `NASA Picture of the Day for ${date}: "${title}" 🚀\n\nCheck it out: ${url}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

  window.open(twitterUrl, "_blank");
});
