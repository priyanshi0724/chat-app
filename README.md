# Real-Time Chat Application
-----------------------------------------------------------------------------------------------------------------------------

COMPANY : Codtech IT Solutions Private Limited

NAME : Priyanshi Tak

INTERN ID : CTIS3339

DOMAIN : Frontend Web Development

DURATION : 6 WEEKS

MENTOR : Neela Santhosh Kumar 

A real-time chat application built with React.js and Socket.io.

## Features

- Real-time messaging via WebSockets
- Message history (stored on server)
- Responsive design for mobile/desktop
- Auto-generated usernames (or custom)
- Timestamps on messages
- Visual distinction between sent/received messages
- User join/leave notifications
- Typing indicators
- Online user count

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```
bash
git clone <your-repo-url>
cd react
```

2. Install frontend dependencies:
```
bash
npm install
```

3. Install backend dependencies:
```
bash
cd server
npm install
cd ..
```

### Running the Application

1. Start the backend server:
```
bash
cd server
npm start
```
The server will run on http://localhost:3001

2. In a new terminal, start the React frontend:
```
bash
npm start
```
The app will open at http://localhost:3000

### Testing

Open http://localhost:3000 in multiple browser tabs to test real-time messaging between users.

## Tech Stack

- **Frontend:** React 19, Socket.io-client
- **Backend:** Node.js, Express, Socket.io
- **Styling:** CSS3 with responsive design

## Project Structure

```
react/
├── server/
│   ├── index.js        # Socket.io server
│   └── package.json
├── src/
│   ├── components/
│   │   ├── Chat.js     # Main chat component
│   │   ├── Chat.css
│   │   ├── Message.js  # Message component
│   │   ├── Message.css
│   │   ├── MessageList.js
│   │   └── MessageList.css
│   ├── App.js
│   ├── App.css
│   └── index.js
├── package.json
└── README.md
```

## License

MIT


#OUTPUT
