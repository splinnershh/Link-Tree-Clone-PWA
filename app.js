if('serviceWorker' in navigator){
  navigator.serviceWorker.register('https://www.aflawlesscut.com/tree/shawnthebarber/service-worker.js')
    .then(reg => console.log('service worker registered'))
    .catch(err => console.log('service worker not registered', err));
}