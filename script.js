let expenses = JSON.parse(localStorage.getItem("expenses")) || {};
let user = localStorage.getItem("user") || null;
const messages = document.getElementById("messages");
const input = document.getElementById("chat-input");
const greeting = document.getElementById("greeting");
const pieCanvas = document.getElementById("pie-chart");

const welcomeScreen = document.getElementById("welcome-screen");
const mainApp = document.getElementById("main-app");
const nameInput = document.getElementById("name-input");
const monthInput = document.getElementById("month-input");
const startBtn = document.getElementById("start-btn");

startBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const month = monthInput.value.trim();
  if (name && month) {
    user = `${name} (${month})`;
    localStorage.setItem("user", user);
    welcomeScreen.style.display = "none";
    mainApp.style.display = "block";
    initGreeting();
  }
});

function initGreeting() {
  if (user) {
    const [name, month] = user.split(" ");
    const total = Object.values(expenses).reduce((a, b) => a + b, 0);
    greeting.innerText = `Hi ${name}, here's your ${month} expenses (Total: $${total})`;
    updateChart();
  }
}

let chart;
function updateChart() {
  const ctx = pieCanvas.getContext("2d");
  const data = {
    labels: Object.keys(expenses),
    datasets: [{
      data: Object.values(expenses),
      backgroundColor: ["#f87171", "#34d399", "#60a5fa", "#fbbf24", "#a78bfa", "#f472b6"],
    }],
  };
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "pie",
    data: data,
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              const label = data.labels[tooltipItem.dataIndex];
              const value = data.datasets[0].data[tooltipItem.dataIndex];
              return `${label}: $${value.toLocaleString()}`;
            }
          }
        }
      }
    }
  });
}

function addMessage(text, from = "user") {
  const div = document.createElement("div");
  div.innerText = `${from === "user" ? "You: " : "Bot: "}${text}`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function processInput(text) {
  const words = text.toLowerCase().trim().split(" ");
  if (words[0] === "del" && words.length >= 3) {
    const amtStr = words[words.length - 1];
    const cat = words.slice(1, -1).join(" ");
    const amt = parseFloat(amtStr);
    if (expenses[cat]) {
      expenses[cat] = Math.max(0, expenses[cat] - amt);
      if (expenses[cat] === 0) delete expenses[cat];
      addMessage(`Deleted $${amt} from ${cat}`, "bot");
    } else {
      addMessage(`No such category: ${cat}`, "bot");
    }
  } else if (!isNaN(words[0]) && words.length >= 2) {
    const amt = parseFloat(words[0]);
    const cat = words.slice(1).join(" ");
    if (!expenses[cat]) expenses[cat] = 0;
    expenses[cat] += amt;
    addMessage(`Added $${amt} to ${cat}`, "bot");
  } else {
    addMessage("Invalid input. Try '500 food' or 'del food 100'", "bot");
  }
  localStorage.setItem("expenses", JSON.stringify(expenses));
  initGreeting();
  updateChart();
}

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && input.value.trim()) {
    const val = input.value.trim();
    addMessage(val, "user");
    processInput(val);
    input.value = "";
  }
});

if (user) {
  welcomeScreen.style.display = "none";
  mainApp.style.display = "block";
  initGreeting();
}
