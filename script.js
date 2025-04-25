// Initialize variables to store user data and expenses
let userName = '';
let currentMonth = '';
let expenses = {};
let chart = null;

// When the Start Tracking button is clicked
document.getElementById('start-btn').addEventListener('click', function () {
  const name = document.getElementById('name-input').value;
  const month = document.getElementById('month-input').value;

  if (name && month) {
    userName = name;
    currentMonth = month;

    // Display a personalized greeting
    document.getElementById('greeting').textContent = `Hi, ${userName}! It's ${currentMonth}. Let's start tracking your expenses!`;
    
    // Hide the welcome screen and show the main app
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';

    // Initialize empty expenses data
    expenses = JSON.parse(localStorage.getItem('expenses')) || {};
    updateChart();
  }
});

// Toggle the visibility of the chat history
document.getElementById('toggle-chat').addEventListener('click', function () {
  const chatBox = document.getElementById('messages');
  chatBox.style.display = chatBox.style.display === 'none' ? 'block' : 'none';
});

// Function to add messages to the chat
function addMessage(text, from = "user") {
  const div = document.createElement("div");
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  div.classList.add(from === "user" ? "user" : "bot");
  div.innerHTML = `${text}<div class="timestamp">${timestamp}</div>`;
  
  // Append the message to the chat
  document.getElementById("messages").appendChild(div);

  // Scroll to the bottom of the chat history
  document.getElementById("messages").scrollTop = document.getElementById("messages").scrollHeight;
}

// Function to update the pie chart
function updateChart() {
  const expenseLabels = Object.keys(expenses);
  const expenseData = Object.values(expenses);

  // If there's no chart yet, create it
  if (!chart) {
    const ctx = document.getElementById('pie-chart').getContext('2d');
    chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: expenseLabels,
        datasets: [{
          label: 'Expense Categories',
          data: expenseData,
          backgroundColor: ['#FF9999', '#66B2FF', '#99FF99', '#FFCC99', '#FFB3E6'],
        }],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                return `${tooltipItem.label}: $${tooltipItem.raw}`;
              },
            },
          },
        },
      }
    });
  } else {
    // Update the existing chart with new data
    chart.data.labels = expenseLabels;
    chart.data.datasets[0].data = expenseData;
    chart.update();
  }
}

// Function to process the user input
document.getElementById('chat-input').addEventListener('keyup', function (event) {
  if (event.key === 'Enter') {
    const userMessage = event.target.value;
    event.target.value = ''; // Clear the input field

    // Display the user message in the chat
    addMessage(userMessage, "user");

    // Process the user message (Expense entry or deletion)
    processUserMessage(userMessage);
  }
});

// Function to process user input for expenses and updates
function processUserMessage(message) {
  const parts = message.trim().split(" ");

  // If the message is a valid format (e.g., "500 food")
  if (parts.length === 2 && !message.startsWith("del")) {
    const amount = parseFloat(parts[0]);
    const category = parts[1].toLowerCase();

    if (isNaN(amount) || amount <= 0 || !category) {
      addMessage("Please enter a valid amount and category (e.g., '500 food').", "bot");
      return;
    }

    // Add or update the expense
    if (expenses[category]) {
      expenses[category] += amount;
    } else {
      expenses[category] = amount;
    }

    // Update localStorage
    localStorage.setItem('expenses', JSON.stringify(expenses));

    // Update the pie chart with new data
    updateChart();

    // Respond to the user
    addMessage(`Added $${amount} to ${category}. Your total ${category} expense is now $${expenses[category]}.`, "bot");
  }

  // If the message is a deletion request (e.g., "del food 200")
  else if (parts.length === 3 && parts[0] === "del") {
    const amount = parseFloat(parts[2]);
    const category = parts[1].toLowerCase();

    if (isNaN(amount) || amount <= 0 || !category || !expenses[category] || expenses[category] < amount) {
      addMessage("Please enter a valid deletion amount (e.g., 'del food 200').", "bot");
      return;
    }

    // Decrease the expense
    expenses[category] -= amount;
    if (expenses[category] <= 0) delete expenses[category];

    // Update localStorage
    localStorage.setItem('expenses', JSON.stringify(expenses));

    // Update the pie chart with new data
    updateChart();

    // Respond to the user
    addMessage(`Removed $${amount} from ${category}. Your total ${category} expense is now $${expenses[category] || 0}.`, "bot");
  } else {
    addMessage("Please use the correct format (e.g., '500 food' or 'del food 200').", "bot");
  }
}
