(function() {
  const NOTIFICATION_DELAY = 2500;

  let messageIndex = 0;
  const fakeMessages = [
    'Heyo',
    'Hows it goin?',
    'What you been up to?',
    'These aren\'t real messages.',
  ];
  const userIcon = '/images/demos/matt-512x512.png';
  const userName = 'Matt';

  const promiseTimeout = function(cb, timeout) {
    return new Promise((resolve) => {
      setTimeout(() => {
        cb();
        resolve();
      }, timeout);
    });
  };

  function registerServiceWorker() {
    return navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
      console.log('Service worker successfully registered.');
      return registration;
    })
    .catch(function(err) {
      console.error('Unable to register service worker.', err);
    });
  }
  const titleAndBodyNotification = function(registration) {
    /**** START titleAndBodySimple ****/
    const title = 'Simple Title';
    const options = {
      body: 'Simple piece of body text.\nSecond line of body text :)'
    };
    registration.showNotification(title, options);
    /**** END titleAndBodySimple ****/
  };

 
 
  

  const setUpNotificationButtons = function() {
    setUpSWMessageListener();

    const configs = [
      {
        className: 'js-notification-title-body',
        cb: titleAndBodyNotification,
        enabled: () => {
          return ('title' in Notification.prototype) &&
            ('body' in Notification.prototype);
        }
      }
    ];

    return registerServiceWorker()
    .then(function(registration) {
      configs.forEach(function(config) {
        const button = document.querySelector(`.${config.className}`);
        if (!button) {
          console.error('No button found with classname: ', config.className);
          return;
        }
        button.addEventListener('click', function() {
          const promiseResult = config.cb(registration);
          if (promiseResult) {
            button.disabled = true;
            promiseResult.then(() => {
              button.disabled = false;
            })
          }
        });
        button.disabled = !config.enabled();
      });
    });
  };

  window.addEventListener('load', function() {
    if (!('serviceWorker' in navigator)) {
      // Service Worker isn't supported on this browser, disable or hide UI.
      return;
    }

    if (!('PushManager' in window)) {
      // Push isn't supported on this browser, disable or hide UI.
      return;
    }

    let promiseChain = new Promise((resolve, reject) => {
      const permissionPromise = Notification.requestPermission((result) => {
        resolve(result);
      });
      if (permissionPromise) {
        permissionPromise.then(resolve);
      }
    })
    .then((result) => {
      if (result === 'granted') {
        setUpNotificationButtons();
      } else {
        displayNoPermissionError();
      }
    });
  });
})();
