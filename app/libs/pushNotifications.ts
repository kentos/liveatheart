import OneSignal from 'react-native-onesignal';

OneSignal.setAppId('5b845d8d-c903-4338-8b4f-2ca684b6ea6c');

OneSignal.setNotificationWillShowInForegroundHandler((notificationReceivedEvent) => {
  console.log('OneSignal: notification will show in foreground:', notificationReceivedEvent);
  const notification = notificationReceivedEvent.getNotification();
  console.log('notification: ', notification);
  const data = notification.additionalData;
  console.log('additionalData: ', data);
  // Complete with null means don't show a notification.
  notificationReceivedEvent.complete(notification);
});

OneSignal.setNotificationOpenedHandler((notification) => {
  console.log('OneSignal: notification opened:', notification);
});
