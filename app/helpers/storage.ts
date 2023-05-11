import * as SecureStore from 'expo-secure-store';

export const store = async (key: string, value: string) => {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (e) {
    console.log(e);
  }
};

export const get = async (key: string) => {
  try {
    return SecureStore.getItemAsync(key);
  } catch (e) {
    console.log(e);
  }
};

export const remove = async (key: string) => {
  await SecureStore.deleteItemAsync(key);
};
