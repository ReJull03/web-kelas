// Toggle class active hamburger menu
const navbarNav = document.querySelector(".navbar-nav");
// Toggle class active search form
const searchForm = document.querySelector(".search-form");
const searchBox = document.querySelector("#search-box");

// Ketika hamburger menu di klik
document.querySelector("#hamburger-menu").onclick = () => {
  navbarNav.classList.toggle("active");
};

// Ketika search button di klik
document.querySelector("#search-button").onclick = (e) => {
  searchForm.classList.toggle("active");
  searchBox.focus();
  e.preventDefault();
};

// Klik diluar elemen
const hm = document.querySelector("#hamburger-menu");
const sb = document.querySelector("#search-button");

document.addEventListener("click", function (e) {
  if (!hm.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove("active");
  }

  if (!sb.contains(e.target) && !searchForm.contains(e.target)) {
    searchForm.classList.remove("active");
  }
});

const schedules = [];
const RENDER_EVENT = "render-schedule";
const SAVED_EVENT = "saved-schedule";
const STORAGE_KEY = "SCHEDULE_APPS";

function isStorageExist() /* boolean */ {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const schedule of data) {
      schedules.push(schedule);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

// Fungsi untuk menggenerate Id
function generateId() {
  return +new Date();
}

// Fungsi menggenerate schedule object
function generateScheduleObject(id, date, day, time, title, lecture, method) {
  return {
    id,
    date,
    day,
    time,
    title,
    lecture,
    method,
  };
}

// Fungsi menambahkan jadwal
function addSchedule() {
  const scheduleDate = document.getElementById("inputScheduleDate").value;
  const scheduleDay = document.getElementById("inputScheduleDay").value;
  const scheduleTimeStart = document.getElementById("inputScheduleTimeStart").value;
  const scheduleTimeEnd = document.getElementById("inputScheduleTimeEnd").value;
  const scheduleTitle = document.getElementById("inputScheduleTitle").value;
  const scheduleLecture = document.getElementById("inputScheduleLecture").value;
  const scheduleMethod = document.getElementById("inputScheduleMethod").value;

  const generatedID = generateId();
  const scheduleObject = generateScheduleObject(generatedID, scheduleDate, scheduleDay, scheduleTimeStart + " - " + scheduleTimeEnd, scheduleTitle, scheduleLecture, scheduleMethod);
  schedules.push(scheduleObject);

  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
}

function findScheduleIndex(scheduleId) {
  for (const index in schedules) {
    if (schedules[index].id === scheduleId) {
      return index;
    }
  }
  return -1;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(schedules);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function removeSchedule(scheduleId) {
  const scheduleTarget = findScheduleIndex(scheduleId);

  if (scheduleTarget === -1) return;

  schedules.splice(scheduleTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputSchedule");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addSchedule();
  });

  // Menampilkan  hari otomatis sesuai dengan tanggal yang dipilih
  const scheduleDate = document.getElementById("inputScheduleDate");
  scheduleDate.addEventListener("change", function () {
    const inputDate = new Date(this.value);
    const options = { weekday: "long" };
    const day = new Intl.DateTimeFormat("id-ID", options).format(inputDate);
    document.getElementById("inputScheduleDay").value = day;
  });

  // Menampilkan jadwal
  document.addEventListener(RENDER_EVENT, function () {
    // console.log(schedules);
    const scheduleView = document.getElementById("scheduleView");
    scheduleView.innerHTML = "";

    for (const scheduleItem of schedules) {
      const scheduleElement = makeSchedule(scheduleItem);
      scheduleView.append(scheduleElement);
    }
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

// Fungsi membuat elemen jadwal untuk ditampilkan
function makeSchedule(scheduleObject) {
  const textTitle = document.createElement("h4");
  textTitle.innerText = scheduleObject.title;

  const textLecture = document.createElement("p");
  textLecture.innerText = scheduleObject.lecture;

  const scheduleName = document.createElement("div");
  scheduleName.classList.add("schedule_name");

  scheduleName.append(textTitle, textLecture);

  const textDay = document.createElement("h4");
  textDay.innerText = scheduleObject.day;

  const textDate = document.createElement("p");
  textDate.innerText = scheduleObject.date;

  const textHour = document.createElement("p");
  textHour.innerText = scheduleObject.time;

  const textMethod = document.createElement("p");
  textMethod.innerText = scheduleObject.method;

  const scheduleDetail = document.createElement("div");
  scheduleDetail.classList.add("schedule_detail");

  scheduleDetail.append(textDay, textDate, textHour, textMethod);

  const doneButton = document.createElement("button");
  doneButton.classList.add("done");
  doneButton.innerText = "Hapus jadwal";

  doneButton.addEventListener("click", function () {
    removeSchedule(scheduleObject.id);
  });

  const divAction = document.createElement("div");
  divAction.classList.add("action");

  divAction.append(doneButton);

  const article = document.createElement("article");
  article.classList.add("schedule_item");
  article.append(scheduleDetail, scheduleName, divAction);
  article.setAttribute("id", `schedule-${scheduleObject.id}`);

  return article;
}
