const STORAGE_KEY = "garden_todo_tasks";

function getTasks() {
  const rawTasks = localStorage.getItem(STORAGE_KEY);

  if (!rawTasks) {
    return [];
  }

  try {
    return JSON.parse(rawTasks);
  } catch (error) {
    console.error("Gagal membaca data task:", error);
    return [];
  }
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
