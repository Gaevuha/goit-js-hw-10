// Імпортуємо бібліотеку flatpickr для роботи з календарем
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

// Імпортуємо бібліотеку iziToast для повідомлень користувачу
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// Знаходимо елементи DOM
const startBtn = document.querySelector("[data-start]"); // Кнопка "Start"
const myInput = document.querySelector("#datetime-picker"); // Поле input з датою

// Елементи, де буде показано таймер
const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondsEl = document.querySelector("[data-seconds]");

// Змінні для обраної дати та ідентифікатора таймера
let userSelectedDate = null;
let timerId = null;

// Спочатку кнопка неактивна
startBtn.disabled = true;

// Опції для ініціалізації flatpickr
const options = {
  enableTime: true,          // Увімкнено вибір часу
  time_24hr: true,           // Формат часу 24 години
  defaultDate: new Date(),   // Поточна дата за замовчуванням
  minuteIncrement: 1,        // Крок часу — 1 хвилина

  // Функція викликається після закриття календаря
  onClose(selectedDates) {
    const selectedDate = selectedDates[0]; // Беремо першу вибрану дату
    const now = new Date(); // Поточна дата і час

    if (selectedDate <= now) {
      // Якщо обрано минулу дату — показуємо повідомлення
      iziToast.error({
        title: "Error",
        message: "Please choose a date in the future",
        position: "topCenter",
      });
      startBtn.disabled = true;     // Блокуємо кнопку
      userSelectedDate = null;      // Очищаємо збережену дату
    } else {
      startBtn.disabled = false;    // Активуємо кнопку
      userSelectedDate = selectedDate; // Зберігаємо обрану дату
    }
  },
};

// Ініціалізуємо flatpickr з інпутом і параметрами
flatpickr(myInput, options);

// Обробник кліку по кнопці "Start"
startBtn.addEventListener("click", () => {
  if (!userSelectedDate) return; // Якщо дата не обрана — нічого не робимо

  startBtn.disabled = true;    // Блокуємо кнопку
  myInput.disabled = true;     // Блокуємо інпут

  // Запускаємо інтервал, який спрацьовує кожну секунду
  timerId = setInterval(() => {
    const now = new Date();           // Поточний час
    const delta = userSelectedDate - now; // Різниця часу в мс

    if (delta <= 0) {
      // Якщо час вичерпано — зупиняємо таймер
      clearInterval(timerId);
      updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      myInput.disabled = false; // Розблоковуємо інпут
      return;
    }

    const time = convertMs(delta); // Конвертуємо мс у дні/год/хв/сек
    updateTimerDisplay(time);     // Оновлюємо інтерфейс
  }, 1000);
});

// Функція оновлення DOM елементів таймера
function updateTimerDisplay({ days, hours, minutes, seconds }) {
  daysEl.textContent = String(days).padStart(2, "0");
  hoursEl.textContent = String(hours).padStart(2, "0");
  minutesEl.textContent = String(minutes).padStart(2, "0");
  secondsEl.textContent = String(seconds).padStart(2, "0");
}

// Функція конвертації мілісекунд у дні, години, хвилини, секунди
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
