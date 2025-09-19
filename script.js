const apiKey = "84c01506fac02ee35e422d9c41681a1c"; // API pou tès sèlman

function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const resultDiv = document.getElementById("result");

  if (!city) {
    resultDiv.innerHTML = "<p>Please enter the city name.</p>";
    return;
  }

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=ht`)
    .then(response => {
      if (!response.ok) {
        throw new Error("The city is not found!");
      }
      return response.json();
    })
    .then(data => {
      const temp = data.main.temp;
      const humidity = data.main.humidity;
      const desc = data.weather[0].description;
      const icon = data.weather[0].icon;
      const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;

      resultDiv.innerHTML = `
        <h2>${data.name}</h2>
        <img src="${iconUrl}" alt="icon meteo">
        <p><strong>Temperature:</strong> ${temp} °C</p>
        <p><strong>Humidity:</strong> ${humidity}%</p>
        <p><strong>Description:</strong> ${desc}</p>
      `;

      saveHistory(city);
      showHistory();
    })
    .catch(error => {
      resultDiv.innerHTML = `<p>${error.message}</p>`;
    });
}

function toggleMode() {
  document.body.classList.toggle("light-mode");
}

function saveHistory(city) {
  let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
  if (!history.includes(city)) {
    history.push(city);
    localStorage.setItem("weatherHistory", JSON.stringify(history));
  }
}

function showHistory() {
  let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
  const historyList = document.getElementById("historyList");
  historyList.innerHTML = "";

  history.slice(-5).reverse().forEach(city => {
    const li = document.createElement("li");
    li.textContent = city;
    li.onclick = () => {
      document.getElementById("cityInput").value = city;
      getWeather();
    };
    historyList.appendChild(li);
  });
}

// Geolokalizasyon otomatik
window.onload = function () {
  showHistory();

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&lang=ht`)
        .then(res => res.json())
        .then(data => {
          document.getElementById("cityInput").value = data.name;
          getWeather();
        });
    });
  }
}