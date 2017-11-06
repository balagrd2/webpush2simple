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

  const allOptionsNotification = function(registration) {
    const title = 'Web Push Book';
    const options = {
      body: 'This would be the body text of the notification.\n' +
        'It can hold two lines of text.',
      icon: 'images/icon-512x512.png',
      badge: '/images/demos/badge-128x128.png',
      image: '/images/demos/unsplash-farzad-nazifi-1600x1100.jpg',
      tag: 'example-notification',
      actions: [
        {
          action: 'download-book-action',
          title: 'Download Book',
          icon: '/images/demos/action-download-book-128x128.png'
        }
      ]
    };
    registration.showNotification(title, options);
  };

  const titleAndBodyNotification = function(registration) {
    /**** START titleAndBodySimple ****/
    const title = 'Simple Title';
    const options = {
      body: 'Simple piece of body text.\nSecond line of body text :)'
    };
    registration.showNotification(title, options);
    /**** END titleAndBodySimple ****/
  };

  const longTitleAndBodyNotification = function(registration) {
    /**** START longTitleAndBodySimple ****/
    const title = 'Ice cream dragée croissant gingerbread topping carrot cake ' +
      'cookie biscuit macaroon. Chocolate bonbon sweet roll pastry. ' +
      'Croissant cake jelly-o halvah. Tootsie roll muffin croissant bear claw.';
    const options = {
      body: 'Lollipop cheesecake sesame snaps marshmallow chocolate bar. ' +
        'Pie fruitcake soufflé toffee lemon drops bonbon candy. ' +
        'Pie cupcake icing candy marzipan chocolate. ' +
        'Soufflé candy canes wafer. Tiramisu sweet roll brownie gummies ' +
        'sweet roll icing donut cake. Gummies croissant caramels pastry ' +
        'gingerbread dessert brownie gingerbread. Tiramisu carrot cake ' +
        'jujubes pie brownie sesame snaps.'
    };
    registration.showNotification(title, options);
    /**** END longTitleAndBodySimple ****/
  };

  const iconNotification = function(registration) {
    /**** START iconNotification ****/
    const title = 'Icon Notification';
    const options = {
      icon: 'images/icon-512x512.png'
    };
    registration.showNotification(title, options);
    /**** END iconNotification ****/
  };

 
    /**** START manipulateNotification ****/
    .then((currentNotification) => {
      let notificationTitle;
      const options = {
        icon: userIcon,
      }

      if (currentNotification) {
        // We have an open notification, let's do something with it.
        const messageCount = currentNotification.data.newMessageCount + 1;

        options.body = `You have ${messageCount} new messages from ${userName}.`;
        options.data = {
          userName: userName,
          newMessageCount: messageCount
        };
        notificationTitle = `New Messages from ${userName}`;

        // Remember to close the old notification.
        currentNotification.close();
      } else {
        options.body = `"${userMessage}"`;
        options.data = {
          userName: userName,
          newMessageCount: 1
        };
        notificationTitle = `New Message from ${userName}`;
      }

      return registration.showNotification(
        notificationTitle,
        options
      );
    });
    /**** END manipulateNotification ****/

    return promiseChain;
  };

  const mustShowNotification = function(registration) {
    return promiseTimeout(() => {
      const serviceWorker = registration.install || registration.waiting ||
        registration.active;
      serviceWorker.postMessage('must-show-notification-demo');
    }, 4000);
  };

  const sendMessageToPage = function(registration) {
    return promiseTimeout(() => {
      const serviceWorker = registration.install || registration.waiting ||
        registration.active;
      serviceWorker.postMessage('send-message-to-page-demo');
    }, 4000);
  };

  const setUpSWMessageListener = function() {
    /**** START swMessageListener ****/
    navigator.serviceWorker.addEventListener('message', function(event) {
      console.log('Received a message from service worker: ', event.data);
    });
    /**** END swMessageListener ****/
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
      },
      {
        className: 'js-notification-long-title-body',
        cb: longTitleAndBodyNotification,
        enabled: () => {
          return ('title' in Notification.prototype) &&
            ('body' in Notification.prototype);
        }
      },
      {
        className: 'js-notification-icon',
        cb: iconNotification,
        enabled: () => {
          return ('icon' in Notification.prototype);
        }
      },
      {
        className: 'js-notification-badge',
        cb: badgeNotification,
        enabled: () => {
          return ('badge' in Notification.prototype);
        }
      },
      {
        className: 'js-notification-image',
        cb: imageNotification,
        enabled: () => {
          return ('image' in Notification.prototype);
        }
      },
      {
        className: 'js-notification-vibrate',
        cb: vibrateNotification,
        enabled: () => {
          return ('vibrate' in Notification.prototype);
        }
      },
      {
        className: 'js-notification-sound',
        cb: soundNotification,
        enabled: () => {
          return ('sound' in Notification.prototype);
        }
      },
      {
        className: 'js-notification-dir-ltr',
        cb: dirLTRNotification,
        enabled: () => {
          return ('dir' in Notification.prototype);
        }
      },
      {
        className: 'js-notification-actions',
        cb: actionsNotification,
        enabled: () => {
          return ('actions' in Notification.prototype);
        }
      },
      {
        className: 'js-notification-dir-rtl',
        cb: dirRTLNotification,
        enabled: () => {
          return ('dir' in Notification.prototype);
        }
      },
      {
        className: 'js-notification-timestamp',
        cb: timestampNotification,
        enabled: () => {
          return ('timestamp' in Notification.prototype);
        }
      },
      {
        className: 'js-notification-overview',
        cb: allOptionsNotification,
        enabled: () => {
          return true;
        },
      },
      {
        className: 'js-notification-tag',
        cb: notificationTag,
        enabled: () => {
          return ('tag' in Notification.prototype);
        }
      },
      {
        className: 'js-notification-renotify',
        cb: renotifyNotification,
        enabled: () => {
          return ('renotify' in Notification.prototype);
        }
      },
      {
        className: 'js-notification-silent',
        cb: silentNotification,
        enabled: () => {
          return ('silent' in Notification.prototype);
        }
      },
      {
        className: 'js-notification-require-interaction',
        cb: requiresInteractionNotification,
        enabled: () => {
          return ('requireInteraction' in Notification.prototype);
        }
      },
      {
        className: 'js-open-window',
        cb: openWindow,
        enabled: () => {
          return true;
        }
      },
      {
        className: 'js-focus-window',
        cb: focusWindow,
        enabled: () => {
          return true;
        }
      },
      {
        className: 'js-data-notification',
        cb: dataNotification,
        enabled: () => {
          return true;
        }
      },
      {
        className: 'js-merge-notification',
        cb: (reg) => {
          mergeNotification(reg)
          .then(() => {
            messageIndex++;

            if (messageIndex >= fakeMessages.length) {
              messageIndex = 0;
            }
          })
        },
        enabled: () => {
          return true;
        }
      },
      {
        className: 'js-must-show-notification',
        cb: mustShowNotification,
        enabled: () => {
          return true;
        }
      },
      {
        className: 'js-send-message-to-page',
        cb: sendMessageToPage,
        enabled: () => {
          return true;
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
