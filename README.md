# MoveNMuse
github: https://github.com/marinankato/MoveNMuse.git


## Repository Structure
 **Backend (server)**: Node.js and Express.js — handles API endpoints, authentication, and database interactions.
- **Frontend (client)**: React.js with Vite — user interface and client-side logic.
- **Database**: MongoDB — stores user data, bookings, courses, and related information.

The repo is divided into two main folders:
/server for backend code and /client for frontend code.
The project files are split into the frontend (client) and backend (server). 


## Feature Responsibilities
- **Marina Kato**: User, Login/Logout, Account, Booking History
- **Jiayu Dai**: Course Viewing, Course Management, Booking Course
- **Xinyi Cai**: Room Viewing, Room Management, Room Slot
- **Shirley Yi**: Cart, Payment, Payment Detail

## How to set up:
- Create a file named ".env" under the server folder 
- In the server/.env file add the following code:
    # Database
    MONGO_DB_URL="mongodb+srv://marina:L4AZ0KcESie31Uyq@movenmuse.3s5x6fi.mongodb.net/?retryWrites=true&w=majority&appName=MoveNMuse"
    PORT=5001

    CORS_ORIGIN1=http://localhost:5173
    CORS_ORIGIN2=
    CORS_ORIGIN3=

    JWT_SECRET=mQ3Vx6pQvLz3GgHUL1bOEWkRWzXyzRwIjsfHEErS+ZA=


## How to run locally:
- Open two terminals
- In one run server:
    run cd server
    npm install
    npm run dev
- In the other run client side: 
    run cd client
    npm install
    npm run dev