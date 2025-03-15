import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// Firebaseの設定
// 実際のプロジェクトでは、環境変数からこれらの値を取得することをお勧めします
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

// Firebaseを初期化
const app = initializeApp(firebaseConfig);

// Firebase Storageへの参照を取得
export const storage = getStorage(app);
