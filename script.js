let userName = '';
let currentMonth = '';
let expenses = {};
let chart = null;

// Initialize app on load
function initializeApp() {
  userName = localStorage.getItem('userName') || '';
  currentMonth = localStorage.getItem('currentMonth') || '';

  if (userName && currentMonth) {
    document.getElementById('greeting').textContent = `Hi, ${userName}! It's ${currentMonth}. Let's start tracking your expenses!`;
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
  }

  expenses = JSON.parse(localStorage.getItem('expenses')) || {};
  updateChart();

  const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
  chatHistory.forEach(msg => addMessage(msg.text, msg.from));
}

// Handle start button
document.getElementById('start-btn').addEventListener('click', function () {
  const name = document.getElementById('name-input').value;
  const month = document.getElementById('month-input').value;

  if (name && month) {
    userName = name;
    currentMonth = month;

    localStorage.setItem('userName', userName);
    localStorage.setItem('currentMonth', currentMonth);

    initializeApp();
  }
});

// Toggle chat visibility
document.getElementById('toggle-chat').addEventListener('click', function () {
  const chatBox = document.getElementById('messages');
  chatBox.style.display = chatBox.style.display === 'none' ? 'block' : 'none';
});

// Add message to chat and save it
function addMessage(text, from = "user") {
  const div = document.createElement("div");
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  div.classList.add(from === "user" ? "user" : "bot");
  div.innerHTML = `${text}<div class="timestamp">${timestamp}</div>`;
  document.getElementById("messages").appendChild(div);
  document.getElementById("messages").scrollTop = document.getElementById("messages").scrollHeight;

  const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
  chatHistory.push({ text, from });
  localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

// Update chart
function updateChart() {
  const labels = Object.keys(expenses);
  const data = Object.values(expenses);

  if (!chart) {
    const ctx = document.getElementById('pie-chart').getContext('2d');
    chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: 'Expenses',
          data: data,
          backgroundColor: ['#FF9999', '#66B2FF', '#99FF99', '#FFCC99', '#FFB3E6']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                return `${tooltipItem.label}: $${tooltipItem.raw}`;
              }
            }
          }
        }
      }
    });
  } else {
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.update();
  }
}

// Handle chat input
document.getElementById('chat-input').addEventListener('keyup', function (e) {
  if (e.key === 'Enter') {
    const input = e.target.value.trim();
    e.target.value = '';
    if (input === '') return;

    addMessage(input, 'user');
    processUserMessage(input);
  }
});

// Process user commands
function processUserMessage(message) {
  const parts = message.trim().split(" ");

  if (parts.length === 2 && !message.startsWith("del")) {
    const amount = parseFloat(parts[0]);
    const category = parts[1].toLowerCase();

    if (isNaN(amount) || amount <= 0 || !category) {
      addMessage("Invalid input. Try: 500 food", "bot");
      return;
    }

    expenses[category] = (expenses[category] || 0) + amount;
    localStorage.setItem('expenses', JSON.stringify(expenses));
    updateChart();

    addMessage(`Added $${amount} to ${category}. Total: $${expenses[category]}`, "bot");

  } else if (parts.length === 3 && parts[0] === "del") {
    const category = parts[1].toLowerCase();
    const amount = parseFloat(parts[2]);

    if (!expenses[category] || isNaN(amount) || amount <= 0) {
      addMessage("Invalid delete format. Try: del food 200", "bot");
      return;
    }

    expenses[category] -= amount;
    if (expenses[category] <= 0) delete expenses[category];

    localStorage.setItem('expenses', JSON.stringify(expenses));
    updateChart();

    addMessage(`Removed $${amount} from ${category}. Total: $${expenses[category] || 0}`, "bot");
  } else {
    addMessage("Try: '500 food' or 'del food 200'", "bot");
  }
}

// Start the app
initializeApp();
