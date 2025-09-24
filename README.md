# Human or AI Clone 

A clone of the popular game **Human or AI**, where a user is paired into a chat room with another user. After 2 minutes, each participant votes on whether their partner is a human or an AI.

---

## Table of Contents
- [Description](#description)  
- [Tech Stack](#tech-stack)  
- [Dependencies](#dependencies)  
- [Setup Instructions](#setup-instructions)  
- [Environment Variables](#environment-variables)  
- [Example .env File](#example-env-file)  
- [Future Additions](#future-additions)  

---

## Description
This project recreates the game mechanics of **Human or AI**.  
- Users are randomly matched in a chat room.  
- Each session lasts for **2 minutes**.  
- At the end, users vote whether the partner was a **human** or an **AI**.  

---

## Tech Stack
- Node.js  
- DeepSeek API for AI responses  
- Socket.IO for WebSockets and real-time communication  

---

## Dependencies
Make sure you have the following installed:  
1. [Node.js](https://nodejs.org/)  
2. [npm](https://www.npmjs.com/)  

---

## Setup Instructions

1. **Clone the project**
   ```bash
   git clone https://github.com/Moustafa-FD/HumanOrAiBackend.git
   ```

2. **Setup environment variables**  
   (see [Example .env File](#example-env-file))  

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Run the project**
   ```bash
   npm start
   ```

---

## Environment Variables
The following environment variables are required to run the project:

```env
PORT= Rest Api port
PORT2= sockets
AI_API_KEY=
FRONTEND_ADDRESS=
```

---

## Example .env File
```env
PORT=3000
PORT2=3001
AI_API_KEY=your-deepseek-api-key
FRONTEND_ADDRESS=http://localhost:5173
```

---

## Future Additions
- 2v5 game mode  
- Improved AI personalities  
- PostgreSQL support  
