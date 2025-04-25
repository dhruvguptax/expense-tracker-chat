# 🧾 Chat-Based Expense Tracker

A minimalist, frictionless web app for tracking expenses through simple chat commands — no logins, no clutter, just type and track.

---

## 🚀 Features

- 🔸 Start by entering your *name* and the *current month*
- 💬 Add expenses via simple chat input like `500 food`
- 📊 Automatically updates a *pie chart* showing category-wise expenses
- 🧠 Remembers your data using *localStorage* (persists across sessions)
- ✂️ Subtract expenses with `del food 200`
- 📤 *Export* your monthly data as JSON
- 🔄 *Reset* to start fresh (clears all stored data)

---

## 🖥️ How to Use

1. Open `index.html` in your browser
2. Enter your name and current month
3. Type your expenses like:
   ```
   1000 rent
   200 groceries
   del rent 500
   ```
4. Use the export button to download your data
5. Use reset to clear and start a new month

---

## 💾 Data Storage

- All data (name, month, expenses) is stored in your browser's *localStorage*
- No internet required, works 100% offline

---

## 📂 Project Structure

```
.
├── index.html
├── style.css
├── script.js
└── README.md
```

---

## 📈 Future Ideas (optional)
- Monthly switching
- Dark mode toggle
- Expense summaries per day/week
- Voice command input

---

Created with ❤️ by Dhruv — inspired by simplicity and the idea that good UX doesn't need buttons.