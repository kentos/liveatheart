import AsyncStorage from '@react-native-async-storage/async-storage';

export const store = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.log(e);
  }
};

export const get = async (key: string) => {
  try {
    return AsyncStorage.getItem(key);
  } catch (e) {
    console.log(e);
  }
};

export const remove = async (key: string) => {
  await AsyncStorage.removeItem(key);
};
