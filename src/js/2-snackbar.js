// Імпортуємо бібліотеку повідомлень
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// Знаходимо форму в DOM
const form = document.querySelector('.form');

// Вішаємо обробник події submit
form.addEventListener('submit', (event) => {
  event.preventDefault(); // Зупиняємо перезавантаження сторінки

  // Отримуємо значення затримки
  const delay = Number(form.elements.delay.value);

  // Отримуємо обране значення радіо-кнопки
  const state = form.elements.state.value;

  // Створюємо проміс
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });

  // Обробляємо результат
  promise
    .then((delay) => {
      iziToast.success({
        title: '✅ Ok',
        icon: '',
        message: `Fulfilled promise in ${delay}ms`,
        position: 'topCenter',
      });
    })
    .catch((delay) => {
      iziToast.error({
        title: '❌ Error',
        icon: '',
        message: `Rejected promise in ${delay}ms`,
        position: 'topCenter',
      });
    });

  // Очищаємо форму
  form.reset();
});
