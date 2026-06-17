const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const dueDateInput = document.getElementById("dueDateInput");
const filterDateInput = document.getElementById("filterDateInput");
const resetFilterBtn = document.getElementById("resetFilterBtn");

const todoList = document.getElementById("todoList");
const doneList = document.getElementById("doneList");
const lateList = document.getElementById("lateList");

const todoCount = document.getElementById("todoCount");
const doneCount = document.getElementById("doneCount");
const lateCount = document.getElementById("lateCount");

const deleteAllBtn = document.getElementById("deleteAllBtn");

let tasks = getTasks();

dueDateInput.value = getTodayValue();
filterDateInput.value = getTodayValue();

function createTaskId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function isLateTask(task) {
  const today = getTodayValue();
  return !task.isDone && task.dueDate < today;
}

function getTaskCompletedDate(task) {
  return task.completedAt || (task.isDone ? task.dueDate : null);
}

function showAlert(title, text, icon = "warning") {
  if (!window.Swal) {
    alert(text);
    return;
  }

  window.Swal.fire({
    icon,
    title,
    text,
    background: "#0c1d12",
    color: "#f5ffe8",
    confirmButtonColor: "#5d9f19",
  });
}

async function showConfirm(title, text, confirmButtonText) {
  if (!window.Swal) {
    return confirm(text);
  }

  const result = await window.Swal.fire({
    icon: "warning",
    title,
    text,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText: "Batal",
    background: "#0c1d12",
    color: "#f5ffe8",
    confirmButtonColor: "#ff6b6b",
    cancelButtonColor: "#5d9f19",
  });

  return result.isConfirmed;
}

function getPriorityClass(priority) {
  if (priority === "High") return "priority-high";
  if (priority === "Medium") return "priority-medium";
  return "priority-low";
}

function createEmptyState(text) {
  const li = document.createElement("li");
  li.className = "empty-state";
  li.textContent = text;
  return li;
}

function createTaskElement(task) {
  const li = document.createElement("li");
  li.className = task.isDone ? "task-item done" : "task-item";

  if (isLateTask(task)) {
    li.classList.add("late");
  }

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "task-checkbox";
  checkbox.checked = task.isDone;

  checkbox.addEventListener("change", () => {
    toggleTaskStatus(task.id);
  });

  const content = document.createElement("div");

  const title = document.createElement("p");
  title.className = "task-title";
  title.textContent = task.title;

  const meta = document.createElement("div");
  meta.className = "task-meta";

  const priorityBadge = document.createElement("span");
  priorityBadge.className = `badge ${getPriorityClass(task.priority)}`;
  priorityBadge.textContent = task.priority;

  const dateBadge = document.createElement("span");
  dateBadge.className = "badge badge-date";
  dateBadge.textContent = `Deadline: ${formatDateIndonesia(task.dueDate)}`;

  meta.append(priorityBadge, dateBadge);

  if (task.isDone) {
    const completedDate = getTaskCompletedDate(task);

    if (completedDate) {
      const completedBadge = document.createElement("span");
      completedBadge.className = "badge badge-date";
      completedBadge.textContent = `Selesai: ${formatDateIndonesia(completedDate)}`;
      meta.appendChild(completedBadge);
    }
  }

  if (isLateTask(task)) {
    const lateBadge = document.createElement("span");
    lateBadge.className = "badge badge-late";
    lateBadge.textContent = "Late";
    meta.appendChild(lateBadge);
  }

  content.append(title, meta);

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "task-delete";
  deleteBtn.type = "button";
  deleteBtn.textContent = "×";

  deleteBtn.addEventListener("click", () => {
    deleteTask(task.id);
  });

  li.append(checkbox, content, deleteBtn);

  return li;
}

function renderTasks() {
  todoList.innerHTML = "";
  doneList.innerHTML = "";
  lateList.innerHTML = "";

  const selectedDate = filterDateInput.value;

  const todoTasks = tasks.filter(
    (task) =>
      task.dueDate === selectedDate && !task.isDone && !isLateTask(task),
  );
  const doneTasks = tasks.filter(
    (task) => task.isDone && getTaskCompletedDate(task) === selectedDate,
  );
  const lateTasks = tasks.filter((task) => isLateTask(task));

  if (todoTasks.length === 0) {
    todoList.appendChild(
      createEmptyState("Belum ada task yang tumbuh hari ini."),
    );
  } else {
    todoTasks.forEach((task) => {
      todoList.appendChild(createTaskElement(task));
    });
  }

  if (doneTasks.length === 0) {
    doneList.appendChild(createEmptyState("Belum ada task yang dipanen."));
  } else {
    doneTasks.forEach((task) => {
      doneList.appendChild(createTaskElement(task));
    });
  }

  if (lateTasks.length === 0) {
    lateList.appendChild(createEmptyState("Tidak ada task yang terlambat."));
  } else {
    lateTasks.forEach((task) => {
      lateList.appendChild(createTaskElement(task));
    });
  }

  updateStats();
}

function updateStats() {
  const selectedDate = filterDateInput.value;

  const totalTodo = tasks.filter(
    (task) =>
      task.dueDate === selectedDate && !task.isDone && !isLateTask(task),
  ).length;
  const totalDone = tasks.filter(
    (task) => task.isDone && getTaskCompletedDate(task) === selectedDate,
  ).length;
  const totalLate = tasks.filter((task) => isLateTask(task)).length;

  todoCount.textContent = totalTodo;
  doneCount.textContent = totalDone;
  lateCount.textContent = totalLate;
}

function addTask(title, priority, dueDate) {
  const newTask = {
    id: createTaskId(),
    title,
    priority,
    dueDate,
    isDone: false,
    completedAt: null,
    createdAt: new Date().toISOString(),
  };

  tasks.unshift(newTask);
  saveTasks(tasks);
  renderTasks();
}

function toggleTaskStatus(taskId) {
  tasks = tasks.map((task) => {
    if (task.id === taskId) {
      const isDone = !task.isDone;

      return {
        ...task,
        isDone,
        completedAt: isDone ? getTodayValue() : null,
      };
    }

    return task;
  });

  saveTasks(tasks);
  renderTasks();
}

function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);
  saveTasks(tasks);
  renderTasks();
}

async function deleteAllTasks() {
  const confirmDelete = await showConfirm(
    "Hapus semua task?",
    "Semua to-do list yang tersimpan akan dihapus.",
    "Ya, hapus",
  );

  if (!confirmDelete) {
    return;
  }

  tasks = [];
  saveTasks(tasks);
  renderTasks();
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = taskInput.value.trim();
  const priority = priorityInput.value;
  const dueDate = dueDateInput.value;

  if (!title || !dueDate) {
    showAlert("Data belum lengkap", "Task dan tanggal wajib diisi.");
    return;
  }

  addTask(title, priority, dueDate);

  taskInput.value = "";
  priorityInput.value = "Low";
  dueDateInput.value = getTodayValue();
});

filterDateInput.addEventListener("change", renderTasks);

resetFilterBtn.addEventListener("click", () => {
  filterDateInput.value = getTodayValue();
  renderTasks();
});

deleteAllBtn.addEventListener("click", deleteAllTasks);

renderTasks();
