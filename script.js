let habits = JSON.parse(localStorage.getItem("habits")) || [];

// Add a new habit
function addHabit() {
    const input = document.getElementById("habitInput");
    const habitText = input.value.trim();
    if (habitText !== "") {
        habits.push({ text: habitText, done: false, category: "General" });
        input.value = "";
        saveHabits();
        renderHabits();
    }
}

// Toggle habit completion
function toggleHabit(index) {
    habits[index].done = !habits[index].done;
    saveHabits();
    renderHabits();
}

// Delete a habit
function deleteHabit(index) {
    habits.splice(index, 1);
    saveHabits();
    renderHabits();
}

// Save habits to localStorage
function saveHabits() {
    localStorage.setItem("habits", JSON.stringify(habits));
}

// Render habits list
function renderHabits() {
    const list = document.getElementById("habitList");
    list.innerHTML = "";
    habits.forEach((habit, index) => {
        const item = document.createElement("div");
        item.className = "habit";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = habit.done;
        checkbox.onchange = () => toggleHabit(index);

        const label = document.createElement("span");
        label.textContent = habit.text + (habit.category ? ` [${habit.category}]` : "");

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "X";
        deleteBtn.className = "delete-btn";
        deleteBtn.onclick = () => deleteHabit(index);

        // Reminder input + button
        const reminderInput = document.createElement("input");
        reminderInput.type = "number";
        reminderInput.placeholder = "Minutes";

        const reminderBtn = document.createElement("button");
        reminderBtn.textContent = "Set Reminder";
        reminderBtn.onclick = () => {
            const minutes = parseInt(reminderInput.value);
            if (!isNaN(minutes)) {
                setReminder(habit.text, minutes);
            }
        };

        item.appendChild(checkbox);
        item.appendChild(label);
        item.appendChild(deleteBtn);
        item.appendChild(reminderInput);
        item.appendChild(reminderBtn);
        list.appendChild(item);
    });
    updateProgress();
}

// Reminder with sound + notification
function setReminder(habitText, minutes) {
    setTimeout(() => {
        alert(`Reminder: ${habitText}`);
        let audio = new Audio("alarm.mp3"); // put alarm.mp3 in same folder
        audio.play();
        notifyHabit(habitText);
    }, minutes * 60 * 1000);
}

// Browser notification
function notifyHabit(habitText) {
    if (Notification.permission === "granted") {
        new Notification(`Reminder: ${habitText}`);
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification(`Reminder: ${habitText}`);
            }
        });
    }
}

// Progress counter
function updateProgress() {
    const doneCount = habits.filter(habit => habit.done).length;
    const totalCount = habits.length;
    const counter = document.getElementById("progressCounter");
    counter.textContent = `Progress: ${doneCount} of ${totalCount} habits completed`;
    saveHistory();
}

// Daily reset
function dailyReset() {
    const today = new Date().toDateString();
    const lastReset = localStorage.getItem("lastReset");

    if (lastReset !== today) {
        habits.forEach(habit => habit.done = false);
        localStorage.setItem("lastReset", today);
        saveHabits();
        renderHabits();
    }
}

// Save progress history
function saveHistory() {
    const today = new Date().toDateString();
    const doneCount = habits.filter(h => h.done).length;
    let history = JSON.parse(localStorage.getItem("history")) || {};
    history[today] = doneCount;
    localStorage.setItem("history", JSON.stringify(history));
}

dailyReset();
renderHabits();
