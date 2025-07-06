# 🍽️ Food Management System

✨ **Food Management System** is a modern, full-stack web application built with the **MERN stack** and styled with **Tailwind CSS**, featuring admin-side food item management, categorized customer menus, and a responsive, mobile-friendly interface.

---

## 🚀 Features

### 🛠️ Admin Panel
- Add, edit, and delete food items
- Organize food by category (e.g., Breakfast, Lunch, Drinks)
- Manage prices and item descriptions

### 👥 Customer Interface
- Browse food menu by category
- View item names, prices, and details
- No login or authentication required
- Fully responsive layout

### 📸 Screenshots

<img width="953" alt="image" src="https://github.com/user-attachments/assets/65120ea5-c0e0-4e82-bd4a-2e77e57b645b" />
<img width="951" alt="image" src="https://github.com/user-attachments/assets/b7cd17eb-9d49-4a07-bb1e-12f0cdcba582" />
<img width="944" alt="image" src="https://github.com/user-attachments/assets/830849c9-d66c-42b8-9f90-79e1681bb497" />
<img width="955" alt="image" src="https://github.com/user-attachments/assets/76772d38-bdcd-4b9d-bec7-0f1303b53df7" />
<img width="959" alt="image" src="https://github.com/user-attachments/assets/06148258-0d01-46fb-8253-a58bf62eb40e" />
<img width="943" alt="image" src="https://github.com/user-attachments/assets/0c788a92-d17b-4919-b87a-3d3b4194a72c" />
<img width="956" alt="image" src="https://github.com/user-attachments/assets/dec4595c-b3de-4f0b-807b-7832dea4bd84" />
<img width="944" alt="image" src="https://github.com/user-attachments/assets/5956d90c-c68e-496f-820e-576776b0ff03" />
<img width="937" alt="image" src="https://github.com/user-attachments/assets/932aa391-aa34-4d08-876a-fe01432466a1" />

## 🛠️ Tech Stack

| Layer      | Technology             |
|------------|------------------------|
| Frontend   | React.js, Tailwind CSS |
| Backend    | Node.js, Express.js    |
| Database   | MongoDB with Mongoose  |
| API Style  | RESTful APIs           |

---

## 📁 Folder Structure

Food-Management-System/
├── client/ # React frontend with Tailwind
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ └── App.jsx
│ └── public/
├── server/ # Node.js + Express backend
│ ├── controllers/
│ ├── routes/
│ ├── models/
│ └── server.js
└── .env # Environment variables


---

## ⚙️ Getting Started

### 1. Clone the Repository


git clone https://github.com/SakithNizar/Food-Booking-System.git
cd Food-Booking-System

### 2. Backend Setup
cd server
npm install

Create a .env file inside the server/ directory with the following content:

env
PORT=5000
MONGO_URI=your_mongodb_connection_string


Start the backend server:
npm run dev

### 3. Frontend Setup
cd ../client
npm install
npm start

### 🌐 Local Development URLs
Service	URL
Frontend	http://localhost:3000
Backend API	http://localhost:5000/api

Ensure MongoDB is running locally or use a cloud provider like MongoDB Atlas.

### 🧰 Future Improvements
-Add order placement and tracking system

-Implement authentication and role-based access control

-Integrate payment gateway

-Build analytics and admin dashboard

👤 Author
Sakith Nizar
GitHub: @SakithNizar




