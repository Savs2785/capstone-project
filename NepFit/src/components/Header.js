import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Image, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  Linking, 
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';

const Header = ({ userImage }) => {
  const [notificationPermission, setNotificationPermission] = useState(false);
  const [notificationId, setNotificationId] = useState(null);

  const checkAndRequestPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();

    if (status === 'granted') {
      setNotificationPermission(true);
    } else if (status === 'denied' || status === 'undetermined') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus === 'granted') {
        setNotificationPermission(true);
      } else {
        Alert.alert(
          'Notification Permission Denied',
          'You need to allow notifications to receive updates. Please enable it in app settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');
                } else {
                  Linking.openSettings();
                }
              },
            },
          ]
        );
        setNotificationPermission(false);
      }
    }
  };

  const scheduleNotification = useCallback(async () => {
    if (!notificationPermission) {
      Alert.alert('Permission Required', 'Please allow notifications to schedule alerts.');
      return;
    }

    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Discount Alert!",
          body: "Hurry! The discount offer is still going on. Don't miss out!",
        },
        trigger: {
          seconds: 60, // Triggers once after 1 minute
        },
      });
      setNotificationId(id);
      Alert.alert('Notification Scheduled', 'You will get notified in 1 minute.');
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      Alert.alert('Error', 'Failed to schedule notification');
    }
  }, [notificationPermission]);

  const handleBellPress = async () => {
    if (notificationId) {
      try {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
        Alert.alert('Notification Canceled', 'Previous notification was canceled.');
      } catch (error) {
        console.error('Failed to cancel notification:', error);
      }
    }

    await scheduleNotification();
  };

  useEffect(() => {
    checkAndRequestPermission();

    const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Foreground notification received:', notification);
    });

    const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response received:', response);
    });

    return () => {
      foregroundSubscription.remove();
      backgroundSubscription.remove();
    };
  }, []);

  return (
    <View style={styles.header}>
      <View style={styles.leftHeader}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
        <Text style={styles.label}>NepFit</Text>
      </View>

      <View style={styles.rightHeader}>
        <TouchableOpacity onPress={handleBellPress}>
          <Ionicons name="notifications-outline" size={24} color="black" />
        </TouchableOpacity>
        {userImage && (
          <Image
            source={{ uri: userImage }}
            style={styles.userImage}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  leftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  rightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
  },
});

export default Header;