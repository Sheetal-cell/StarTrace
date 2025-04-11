document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('dateInput');
    const spinner = document.getElementById('spinner');
    let milestones = [];
  
    // Load milestone JSON on start
    fetch('milestones.json')
      .then(res => res.json())
      .then(data => {
        milestones = data;
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
        fetchAPOD(today);
        displayMilestones(today);
      })
      .catch(err => {
        console.error('Error loading milestone data:', err);
      });
  
    // Event listener for date change
    dateInput.addEventListener('change', () => {
      const selectedDate = dateInput.value;
      if (selectedDate) {
        fetchAPOD(selectedDate);
        displayMilestones(selectedDate);
      }
    });
  
    function showSpinner() {
      spinner.classList.remove('hidden');
    }
  
    function hideSpinner() {
      spinner.classList.add('hidden');
    }
  
    function fetchAPOD(date) {
      const endpoint = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&date=${date}`;
      showSpinner();
  
      fetch(endpoint)
        .then(res => res.json())
        .then(data => {
          hideSpinner();
          document.getElementById('apodBox').classList.remove('hidden');
          document.getElementById('title').textContent = data.title;
          document.getElementById('dateText').textContent = `📅 Date: ${data.date}`;
          document.getElementById('explanation').textContent = data.explanation;
  
          const mediaDiv = document.getElementById('media');
          const safeUrl = data.url.replace("http://", "https://");
  
          if (data.media_type === 'image') {
            mediaDiv.innerHTML = `<img src="${safeUrl}" alt="APOD">`;
          } else if (data.media_type === 'video') {
            mediaDiv.innerHTML = `<iframe src="${safeUrl}" frameborder="0" allowfullscreen></iframe>`;
          } else {
            mediaDiv.innerHTML = 'Media type not supported.';
          }
          document.getElementById('apodBox').classList.add('fade-in');
        })
        .catch(err => {
          hideSpinner();
          console.error(err);
          document.getElementById('apodBox').classList.remove('hidden');
          document.getElementById('title').textContent = "Error loading data 😔";
          document.getElementById('explanation').textContent = "Try again later.";
          document.getElementById('media').innerHTML = "";
        });
    }
  
    function displayMilestones(dateStr) {
      const selectedDate = new Date(dateStr);
      const selectedMonth = selectedDate.getMonth() + 1;
      const selectedDay = selectedDate.getDate();
  
      const milestoneContent = document.getElementById('milestoneContent');
      milestoneContent.innerHTML = ''; // Clear previous
  
      const matches = milestones.filter(m =>
        m.month === selectedMonth && m.day === selectedDay
      );
  
      if (matches.length === 0) {
        milestoneContent.innerHTML = "<p>No milestones for this date.</p>";
        return;
      }
  
      matches.forEach(m => {
        const div = document.createElement('div');
        div.classList.add('fade-in');
        div.innerHTML = `
          <h4>${m.year} - ${m.title}</h4>
          <p>${m.description}</p>
        `;
        milestoneContent.appendChild(div);
      });
    }
  });
  