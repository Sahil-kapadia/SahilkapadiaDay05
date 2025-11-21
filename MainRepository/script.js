let selectedZone = "local";

document
  .getElementById("timezone-select")
  .addEventListener("change", function () {
    selectedZone = this.value;
    updateClock();
  });

function updateThemeButtons(isDay) {
  const dayBtn = document.getElementById("btn-day");
  const nightBtn = document.getElementById("btn-night");

  if (isDay) {
    dayBtn.style.display = "none";
    nightBtn.style.display = "inline-flex";
  } else {
    dayBtn.style.display = "inline-flex";
    nightBtn.style.display = "none";
  }
}

function updateClock() {
  let now;
  if (selectedZone === "local") {
    now = new Date();
  } else {
    now = new Date(
      new Date().toLocaleString("en-US", { timeZone: selectedZone })
    );
  }

  let hrs = now.getHours();
  let mins = String(now.getMinutes()).padStart(2, "0");
  let secs = String(now.getSeconds()).padStart(2, "0");

  const ampm = hrs >= 12 ? "PM" : "AM";
  const displayHrs = ((hrs + 11) % 12) + 1;

  document.getElementById(
    "time"
  ).innerHTML = `${displayHrs}:${mins}:${secs} <small>${ampm}</small>`;

  const isDay = hrs >= 6 && hrs < 18;

  if (isDay) {
    document.documentElement.classList.remove("night");
  } else {
    document.documentElement.classList.add("night");
  }

  updateThemeButtons(isDay);
}

setInterval(updateClock, 1000);
updateClock();

document.getElementById("btn-day").onclick = () => {
  document.documentElement.classList.remove("night");
  updateThemeButtons(true);
};

document.getElementById("btn-night").onclick = () => {
  document.documentElement.classList.add("night");
  updateThemeButtons(false);
};
const quotes = [
  { text: "Make each day your masterpiece.", author: "Author" },
  {
    text: "Simplicity is the ultimate sophistication.",
    author: "Leonardo da Vinci",
  },
  { text: "Focus on being productive, not busy.", author: "Tim Ferriss" },
];

let qIndex = 0;
setInterval(() => {
  const q = quotes[qIndex % quotes.length];
  document.getElementById("quote-text").textContent = `“${q.text}”`;
  document.getElementById("quote-author").textContent = `— ${q.author}`;
  qIndex++;
}, 7000);

const todoList = document.getElementById("todo-list");
const todoInput = document.getElementById("todo-input");

function loadTodos() {
  return JSON.parse(localStorage.getItem("dashboard_todos") || "[]");
}
function saveTodos(todos) {
  localStorage.setItem("dashboard_todos", JSON.stringify(todos));
}

function renderTodos() {
  const todos = loadTodos();
  todoList.innerHTML = "";

  todos.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "todo-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.done;
    checkbox.onchange = () => {
      item.done = checkbox.checked;
      saveTodos(todos);
      renderTodos();
    };

    const label = document.createElement("label");
    label.textContent = item.text;
    if (item.done) label.style.textDecoration = "line-through";

    const del = document.createElement("button");
    del.className = "btn";
    del.textContent = "✕";
    del.onclick = () => {
      todos.splice(index, 1);
      saveTodos(todos);
      renderTodos();
    };

    div.append(checkbox, label, del);
    todoList.appendChild(div);
  });
}

document.getElementById("add-btn").onclick = () => {
  const text = todoInput.value.trim();
  if (text === "") return;

  const todos = loadTodos();
  todos.push({ text, done: false });
  saveTodos(todos);
  todoInput.value = "";
  renderTodos();
};

document.getElementById("clear-btn").onclick = () => {
  localStorage.removeItem("dashboard_todos");
  renderTodos();
};

renderTodos();
