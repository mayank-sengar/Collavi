# Collavi

**Collavi** is a modern, full-stack communication platform that connects people based on shared skills and professional domains. Designed to foster collaboration, mentorship, and knowledge exchange, it enables real-time chat and video calls—making it easy to grow and connect within your community.

---

## Purpose

Collavi bridges the gap between professionals and learners by allowing users to:

- Connect with peers in the same skill areas or industries  
- Seek help and mentorship from experienced practitioners  
- Resolve doubts through real-time chat and video consultations  
- Collaborate on projects with like-minded individuals  
- Share resources and grow the knowledge ecosystem  

---

## Features

- **Domain-Based Matching:** Discover users with similar skills and interests  
- **Real-Time Chat:** Instant messaging with Socket.io and persistent history  
- **Video Consultations:** One-click video calls powered by GetStream Video SDK  
- **Friend Network:** Send requests and build professional connections  
- **Knowledge Sharing:** Exchange insights, documents, and useful links  
- **Personalized Profiles:** Showcase your expertise, skills, and availability  
- **Notifications:** Real-time alerts for messages, calls, and requests  

---

##  Tech Stack

**Frontend**  
- React  
- Tailwind CSS  
- Stream Chat React SDK  
- Stream Video React SDK  

**Backend**  
- Node.js  
- Express  
- Socket.io  
- MongoDB  

**Others**  
- React Query, Context API  
- Build Tools: Vite, npm  
- APIs: GetStream Chat & Video  

---

##  Getting Started

###  Prerequisites

- Node.js (v18+ recommended)  
- MongoDB (local or cloud)  
- GetStream account with API keys  

---

### 📦 Installation

1. **Clone the Repository**

```bash
git clone https://github.com/your-username/collavi.git
cd collavi
```

2. **Install Dependencies**

**Backend:**

```bash
cd backend
npm install
```

**Frontend:**

```bash
cd ../frontend
npm install
```

3. **Set Up Environment Variables**

Create `.env` files in both `backend` and `frontend` directories.

**Backend `.env`:**

```
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
```

**Frontend `.env`:**

```
VITE_BACKEND_URL=http://localhost:8000
VITE_STREAM_API_KEY=your_stream_api_key
```

4. **Start the Servers**

**Backend:**

```bash
cd backend
npm run dev
```

**Frontend:**

```bash
cd ../frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to start using Collavi.

---

##  How It Works

1. **Create Your Profile** – Sign up and add your skills, domains, and interests  
2. **Discover Connections** – Find people with shared skills and goals  
3. **Build Your Network** – Send friend requests and grow your professional circle  
4. **Chat Instantly** – Collaborate, resolve doubts, and share ideas  
5. **Start Video Calls** – Face-to-face discussions for deeper engagement  
6. **Share Resources** – Exchange links, documents, and tutorials  

---

##  Use Cases

- **Students:** Collaborate on coursework and exam prep  
- **Developers:** Debug code, share snippets, or build side projects  
- **Designers:** Exchange feedback and portfolio reviews  
- **Entrepreneurs:** Network for ideas and partnership opportunities  
- **Mentors:** Offer guidance to learners in your domain  
- **Job Seekers:** Connect with professionals in your target industry  

---

## 📁 Project Structure

```
collavi/
├── backend/             # Node.js backend with Express, MongoDB, and Socket.io
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── config/
│   └── ...
├── frontend/            # React frontend with Stream SDKs and Tailwind CSS
│   ├── components/
│   ├── pages/
│   ├── context/
│   └── ...
```

---

## 🤝 Contributing

Contributions are welcome! 

1. Fork the repository  
2. Create your feature branch: `git checkout -b feature-name`  
3. Commit your changes: `git commit -m 'Add feature'`  
4. Push to the branch: `git push origin feature-name`  
5. Open a Pull Request

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).

---

##  Collavi – Connect, Collaborate, and Grow Together!
