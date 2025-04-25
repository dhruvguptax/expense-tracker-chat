let expenses = JSON.parse(localStorage.getItem("expenses")) || {};
let user = localStorage.getItem("user") || null;
const messages = document.getElementById("messages");
const input = document.getElementById("chat-input");
const greeting = document.getElementById("greeting");

if (!user) {
  const name = prompt("What's your name?");
  const month = prompt("Which month is this for?");
  user = `${name} (${month})`;
  localStorage.setItem("user", user);
}
greeting.innerText = `Hi ${user.split(" ")[0]}, your ${user.split(" ")[1]} expenses:`;

// Pie chart init
let chart;
function updateChart() {
  const ctx = document.getElementById("pie-chart").getContext("2d");
  const data = {
    labels: Object.keys(expenses),
    datasets: [{
      data: Object.values(expenses),
      backgroundColor: [
        "#f87171", "#34d399", "#60a5fa", "#fbbf24", "#a78bfa", "#f472b6"
      ],
    }],
  };
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "pie",
    data: data,
  });
}
updateChart();

function addMessage(text, from = "user") {
  const div = document.createElement("div");
  div.innerText = `${from === "user" ? "You: " : "Bot: "}${text}`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function processInput(text) {
  const words = text.toLowerCase().trim().split(" ");
  if (words[0] === "del" && words.length === 3) {
    const [_, cat, amtStr] = words;
    const amt = parseFloat(amtStr);
    if (expenses[cat]) {
      expenses[cat] = Math.max(0, expenses[cat] - amt);
      if (expenses[cat] === 0) delete expenses[cat];
      addMessage(`Deleted $${amt} from ${cat}`, "bot");
    } else {
      addMessage(`No such category: ${cat}`, "bot");
    }
  } else if (!isNaN(words[0]) && words.length === 2) {
    const amt = parseFloat(words[0]);
    const cat = words[1];
    if (!expenses[cat]) expenses[cat] = 0;
    expenses[cat] += amt;
    addMessage(`Added $${amt} to ${cat}`, "bot");
  } else {
    addMessage("Invalid input. Try '500 food' or 'del food 100'", "bot");
  }
  localStorage.setItem("expenses", JSON.stringify(expenses));
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

