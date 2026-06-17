function getTodayValue() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const date = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${date}`;
}

function formatDateIndonesia(dateValue) {
  const date = new Date(dateValue + "T00:00:00");

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function renderCurrentDate() {
  const today = new Date();

  const dayText = document.getElementById("dayText");
  const dateText = document.getElementById("dateText");

  dayText.textContent = today.toLocaleDateString("id-ID", {
    weekday: "long",
  });

  dateText.textContent = today.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

renderCurrentDate();
