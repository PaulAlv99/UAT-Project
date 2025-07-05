#UAT-Project

**Ubiquitous Applications Technologies Project**  
---

## Getting Started

### 1. Backend Setup

1. Open the terminal and navigate to the backend folder:
   ```bash
   cd Backend
   npm install
   npm start
   ```

2. Create a `.env` file in the **Backend** folder with the following environment variables:
   ```env
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=1d
   PORT=your_desired_port
   MONGO_URI=your_mongo_database_uri
   ```

---

### 2. Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd FrontEnd
   npm install
   ```

2. Create a `.env` file in the **FrontEnd** folder with the following keys:
   ```env
   EXPO_PUBLIC_API_URL=http://<your_ipv4>:<backend_port>
   EXPO_PUBLIC_SOCKET_URL=http://<your_ipv4>:<backend_port>
   EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

3. Open **Android Studio** and start an emulator from the **Device Manager**  
   - **OR** use a real device with the **Expo Go** app installed.

4. Start the Expo development server:
   ```bash
   npx expo start
   ```

---

## 📌 Notes

- Replace `<your_ipv4>` with your actual **local IP address**.
- Ensure both `.env` files exist and are correctly configured.
- You can run the app on an Android emulator or a physical device with **Expo Go**.
