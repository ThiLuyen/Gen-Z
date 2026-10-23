// Global Application State
const state = {
  currentUser: null,
  moodChart: null,
  audioPlaying: false,
};

// Quote database
const quotes = [
  {
    quote:
      "Đừng so sánh chương 1 của bạn với chương 20 của người khác. Hãy tập trung vào hành trình sống tự do & độc lập của chính mình.",
    author: "— Triết lý tuổi 20",
  },
  {
    quote:
      "Thất bại lớn nhất là không dám bước ra khỏi vùng an toàn để thử nghiệm những lối sống khác biệt.",
    author: "— Tư duy tự do",
  },
  {
    quote:
      "Chăm sóc sức khỏe tinh thần không phải là sự ích kỷ, đó là trách nhiệm tối thượng với bản thân.",
    author: "— Mental Health Focus",
  },
];

// Init App on Window Load
window.onload = function () {
  checkAuthSession();
  initRandomQuote();
};

// Auth Tab Switching logic
function switchAuthTab(type) {
  const loginBtn = document.getElementById("tab-login-btn");
  const regBtn = document.getElementById("tab-register-btn");
  const loginForm = document.getElementById("login-form");
  const regForm = document.getElementById("register-form");

  if (type === "login") {
    loginBtn.className =
      "flex-1 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 text-white bg-indigo-600 shadow-sm";
    regBtn.className =
      "flex-1 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 text-slate-400 hover:text-white";
    loginForm.classList.remove("hidden");
    regForm.classList.add("hidden");
  } else {
    regBtn.className =
      "flex-1 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 text-white bg-indigo-600 shadow-sm";
    loginBtn.className =
      "flex-1 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 text-slate-400 hover:text-white";
    regForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
  }
}

// Fill Demo Account Credentials
function fillDemoAccount() {
  document.getElementById("login-email").value = "genz.demo@mindhub.vn";
  document.getElementById("login-password").value = "123456";
  showNotice("Đã điền thông tin tài khoản Demo thành công!");
}

// Handle Authentication Form Submission
function handleAuth(event, type) {
  event.preventDefault();

  let userObj = {};
  if (type === "login") {
    const email = document.getElementById("login-email").value;
    userObj = {
      name: email.split("@")[0] || "GenZ Member",
      email: email,
    };
  } else {
    const name = document.getElementById("reg-name").value;
    const email = document.getElementById("reg-email").value;
    userObj = { name, email };
  }

  // Save user info to LocalStorage
  localStorage.setItem("genz_hub_user", JSON.stringify(userObj));
  state.currentUser = userObj;

  showNotice("Đăng nhập thành công! Chào mừng bạn.");
  renderAppUi();
}

// Check LocalStorage Session
function checkAuthSession() {
  const stored = localStorage.getItem("genz_hub_user");
  if (stored) {
    try {
      state.currentUser = JSON.parse(stored);
      renderAppUi();
    } catch (e) {
      localStorage.removeItem("genz_hub_user");
    }
  }
}

// Render UI depending on Auth state
function renderAppUi() {
  const authSection = document.getElementById("auth-section");
  const mainApp = document.getElementById("main-app");

  if (state.currentUser) {
    authSection.classList.add("hidden");
    mainApp.classList.remove("hidden");

    // Update User Info Labels
    document.getElementById("user-display-name").textContent =
      state.currentUser.name;
    document.getElementById("dash-welcome-name").textContent =
      state.currentUser.name;
    document.getElementById("user-display-email").textContent =
      state.currentUser.email;
    document.getElementById("user-avatar").textContent = state.currentUser.name
      .substring(0, 2)
      .toUpperCase();

    // Initialize Mood Chart after render
    setTimeout(initMoodChart, 100);
  } else {
    authSection.classList.remove("hidden");
    mainApp.classList.add("hidden");
  }
}

// Handle User Logout
function handleLogout() {
  localStorage.removeItem("genz_hub_user");
  state.currentUser = null;
  showNotice("Đã đăng xuất khỏi tài khoản");
  renderAppUi();
}

// Navigation Tab Switching Logic
function switchTab(tabId) {
  // Update active nav button
  document
    .querySelectorAll(".nav-item")
    .forEach((btn) => btn.classList.remove("active-tab"));
  const activeNav = document.getElementById(`nav-${tabId}`);
  if (activeNav) activeNav.classList.add("active-tab");

  // Hide all tab content sections
  const tabSections = [
    "dashboard",
    "mental",
    "finance",
    "lifestyle",
    "travel",
    "entertainment",
  ];
  tabSections.forEach((id) => {
    const sec = document.getElementById(`tab-${id}-content`);
    if (sec) sec.classList.add("hidden");
  });

  // Show current tab section
  const currentSec = document.getElementById(`tab-${tabId}-content`);
  if (currentSec) currentSec.classList.remove("hidden");
}

// Display Random Motivational Quote
function initRandomQuote() {
  const item = quotes[Math.floor(Math.random() * quotes.length)];
  document.getElementById("daily-quote").textContent = `"${item.quote}"`;
  document.getElementById("daily-author").textContent = item.author;
}

// Set Daily Mood Check-in
function setMood(moodName, emoji) {
  document.getElementById("dash-mood-status").textContent =
    `${emoji} ${moodName}`;
  showNotice(`Đã ghi nhận cảm xúc hôm nay của bạn: ${moodName}`);
}

// Audio Player Simulation
function toggleAudio() {
  state.audioPlaying = !state.audioPlaying;
  const btn = document.getElementById("audio-play-btn");
  if (state.audioPlaying) {
    btn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    btn.classList.replace("bg-indigo-600", "bg-amber-600");
    showNotice("Đang phát âm thanh thư giãn chữa lành...");
  } else {
    btn.innerHTML = '<i class="fa-solid fa-play ml-0.5"></i>';
    btn.classList.replace("bg-amber-600", "bg-indigo-600");
    showNotice("Đã tạm dừng âm thanh");
  }
}

// Save Stress Release Journal Entry
function saveJournal() {
  const input = document.getElementById("journal-input");
  const text = input.value.trim();

  if (!text) {
    showNotice("Vui lòng nhập nội dung trước khi lưu");
    return;
  }

  const journalList = document.getElementById("journal-list");
  const now = new Date();
  const dateStr = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} - ${now.getHours()}:${now.getMinutes() < 10 ? "0" : ""}${now.getMinutes()}`;

  const entry = document.createElement("div");
  entry.className =
    "p-3 bg-slate-800/40 border border-slate-800 rounded-xl text-xs text-slate-300";
  entry.innerHTML = `<p class="text-[10px] text-indigo-400 font-semibold mb-1">${dateStr}</p><p class="italic">"${text}"</p>`;

  journalList.prepend(entry);
  input.value = "";
  showNotice("Đã lưu nhật ký giải tỏa thành công");
}

// FIRE Investment Calculator
function calculateFIRE() {
  const expense =
    parseFloat(document.getElementById("fire-expense").value) || 0;
  const current =
    parseFloat(document.getElementById("fire-current").value) || 0;
  const monthlySave =
    parseFloat(document.getElementById("fire-monthly-save").value) || 0;

  if (expense <= 0 || monthlySave <= 0) {
    showNotice("Vui lòng nhập đầy đủ các con số hợp lệ");
    return;
  }

  // Rule of 25: FIRE Target = Annual Expenses * 25
  const fireTarget = expense * 12 * 25;
  const remaining = fireTarget - current;
  const years = remaining > 0 ? (remaining / (monthlySave * 12)).toFixed(1) : 0;

  document.getElementById("fire-target-result").textContent =
    fireTarget.toLocaleString("vi-VN") + " ₫";
  document.getElementById("fire-years-result").textContent = `~ ${years} Năm`;

  showNotice("Đã cập nhật tính toán lộ trình Tự do tài chính FIRE");
}

// Habit Tracker Check Counter
function updateHabitCount() {
  const checkboxes = document.querySelectorAll(
    '#habit-container input[type="checkbox"]',
  );
  let checkedCount = 0;
  checkboxes.forEach((cb) => {
    if (cb.checked) checkedCount++;
  });

  document.getElementById("dash-habit-status").textContent =
    `${checkedCount}/${checkboxes.length} Thói quen`;
}

// Chart.js - Mental Health Energy Trend Initialization
function initMoodChart() {
  const ctx = document.getElementById("moodChart");
  if (!ctx) return;

  if (state.moodChart) {
    state.moodChart.destroy();
  }

  state.moodChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [
        "Thứ 2",
        "Thứ 3",
        "Thứ 4",
        "Thứ 5",
        "Thứ 6",
        "Thứ 7",
        "Chủ Nhật",
      ],
      datasets: [
        {
          label: "Mức độ Năng lượng Tinh thần",
          data: [70, 65, 80, 60, 85, 90, 95],
          borderColor: "#818cf8",
          backgroundColor: "rgba(99, 102, 241, 0.15)",
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointBackgroundColor: "#a855f7",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          grid: { color: "rgba(255, 255, 255, 0.05)" },
          ticks: { color: "#94a3b8", font: { size: 10 } },
        },
        x: {
          grid: { display: false },
          ticks: { color: "#94a3b8", font: { size: 10 } },
        },
      },
    },
  });
}

// Custom Notification Toast Message Handler
function showNotice(msg) {
  const toast = document.getElementById("toast-notification");
  const toastMsg = document.getElementById("toast-message");

  toastMsg.textContent = msg;
  toast.classList.remove("translate-y-20", "opacity-0");

  setTimeout(() => {
    toast.classList.add("translate-y-20", "opacity-0");
  }, 3000);
}
