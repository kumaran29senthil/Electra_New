/**
 * Firebase Cloud Messaging service for handling notifications
 * Used for the Electra Voting System
 */
import { messaging } from '@/lib/firebase';
import { getToken, onMessage } from 'firebase/messaging';

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  clickAction?: string;
  data?: Record<string, string>;
}

export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    if (!messaging) {
      console.error('Firebase messaging is not supported in this browser');
      return null;
    }
    
    // Request permission from the user
    const permission = await Notification.requestPermission();
    
    if (permission !== 'granted') {
      console.error('Notification permission not granted');
      return null;
    }
    
    // Get FCM token
    const currentToken = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });
    
    if (!currentToken) {
      console.error('No registration token available');
      return null;
    }
    
    return currentToken;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

export const saveTokenToDatabase = async (userId: string, token: string): Promise<boolean> => {
  try {
    // Call an API to save the token to the database
    // This would normally be implemented in your backend
    const response = await fetch('/api/users/fcm-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, token }),
    });
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error saving FCM token to database:', error);
    return false;
  }
};

export const setupMessagingListener = () => {
  if (!messaging) {
    return () => {}; // Return empty function if messaging is not available
  }
  
  // Set up message handler
  const unsubscribe = onMessage(messaging, (payload) => {
    console.log('Message received:', payload);
    
    // Display a notification if the app is in the foreground
    if (payload.notification) {
      const { title, body } = payload.notification;
      
      if (title && body) {
        new Notification(title, {
          body,
          icon: '/logo.png',
        });
      }
    }
  });
  
  return unsubscribe;
};

export const sendNotificationToUser = async (
  userId: string,
  notification: NotificationPayload
): Promise<boolean> => {
  try {
    // Call an API to send a notification to a specific user
    // This would normally be implemented in your backend, which would use Firebase Admin SDK
    const response = await fetch('/api/notifications/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        notification,
      }),
    });
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error sending notification:', error);
    return false;
  }
};

export const sendNotificationToTopic = async (
  topic: string,
  notification: NotificationPayload
): Promise<boolean> => {
  try {
    // Call an API to send a notification to all users subscribed to a topic
    // This would normally be implemented in your backend, which would use Firebase Admin SDK
    const response = await fetch('/api/notifications/send-to-topic', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic,
        notification,
      }),
    });
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error sending topic notification:', error);
    return false;
  }
};

export const subscribeToTopic = async (token: string, topic: string): Promise<boolean> => {
  try {
    // Call an API to subscribe a device to a topic
    // This would normally be implemented in your backend, which would use Firebase Admin SDK
    const response = await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        topic,
      }),
    });
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error subscribing to topic:', error);
    return false;
  }
};

export default {
  requestNotificationPermission,
  saveTokenToDatabase,
  setupMessagingListener,
  sendNotificationToUser,
  sendNotificationToTopic,
  subscribeToTopic,
};