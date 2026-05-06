# Collavi Developer Guide

This guide is for contributors and maintainers who want to understand how Collavi is organized, how to run it locally, and where to extend it safely.

## Table of Contents

1. Project Overview
2. Repository Structure
3. Architecture Summary
4. Local Setup
5. Environment Variables
6. Backend Guide
7. Frontend Guide
8. Real-Time Features
9. Data Flow and API Routes
10. Common Development Tasks
11. Troubleshooting
12. Contribution Notes

## Project Overview

Collavi is a full-stack communication app built with a React frontend and a Node.js/Express backend. It supports:

- Authentication and onboarding
- User discovery and friend requests
- Real-time messaging
- Video call flows
- Notifications and profile management

The project is split into a frontend app and a backend API/server layer.

## Repository Structure

### Frontend

Located in [frontend](../frontend).

- [src/App.jsx](../frontend/src/App.jsx): Route definitions and app-level access control
- [src/pages](../frontend/src/pages): Feature pages such as login, onboarding, chats, friends, and calls
- [src/components](../frontend/src/components): Shared UI pieces
- [src/context](../frontend/src/context): App state providers
- [src/hooks](../frontend/src/hooks): Reusable hooks such as auth loading
- [src/utils](../frontend/src/utils): API helpers and axios configuration

### Backend

Located in [backend](../backend).

- [server.js](../backend/server.js): Entry point and Express app setup
- [routes](../backend/routes): Route declarations
- [controllers](../backend/controllers): Request handlers and business logic
- [models](../backend/models): MongoDB/Mongoose models
- [middlewares](../backend/middlewares): Authentication and upload middleware
- [config](../backend/config): Database and stream configuration
- [utils](../backend/utils): Shared helpers, response wrappers, Redis client, and cloud utilities
- [SocketIO/server.js](../backend/SocketIO/server.js): Real-time server integration
- [webrtc/wsServer.js](../backend/webrtc/wsServer.js): WebRTC signaling support

### Supporting Files

- [architecture-diagram.mmd](../architecture-diagram.mmd): Mermaid architecture diagram
- [docs/USER_GUIDE.md](USER_GUIDE.md): End-user guide

## Architecture Summary

The app uses a layered structure:

- The frontend handles routing, UI rendering, and user interaction.
- The backend exposes REST endpoints for auth, users, and chat.
- MongoDB stores users, messages, conversations, and friend requests.
- Socket.io is used for real-time communication.
- WebRTC is used for call signaling and live call flows.
- Cloudinary handles profile image uploads.
- Redis is used for caching and session-like backend support where enabled.

If you need a visual overview, start with [architecture-diagram.mmd](../architecture-diagram.mmd).

## Local Setup

### Prerequisites

- Node.js 18 or newer
- MongoDB instance or connection string
- Any required third-party API credentials

### Install Dependencies

From the project root:

```bash
cd backend
npm install
cd ../frontend
npm install
```

### Run the Backend

```bash
cd backend
npm run dev
```

### Run the Frontend

```bash
cd frontend
npm run dev
```

The frontend is served by Vite, usually on `http://localhost:5173`.

## Environment Variables

### Backend

Create a [backend/.env](../backend/.env) file with values similar to the following:

```env
PORT=8000
FRONTEND_URL=http://localhost:5173
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
```

### Frontend

Create a [frontend/.env](../frontend/.env) file with values similar to the following:

```env
VITE_BACKEND_URL=http://localhost:8000
VITE_STREAM_API_KEY=your_stream_api_key
```

The backend CORS configuration expects the frontend origin to match `FRONTEND_URL` when it is set.

## Backend Guide

### Entry Point

The backend starts in [backend/server.js](../backend/server.js). That file:

- Loads environment variables
- Sets up CORS and cookie parsing
- Ensures temporary upload storage exists
- Connects to MongoDB
- Initializes Redis
- Mounts route groups
- Starts the HTTP server

### Main Route Groups

- Auth routes: [backend/routes/auth.route.js](../backend/routes/auth.route.js)
- User routes: [backend/routes/user.route.js](../backend/routes/user.route.js)
- Chat routes: [backend/routes/chat.route.js](../backend/routes/chat.route.js)

### Auth Routes

Base path: `/api/auth`

- `POST /register`
- `POST /login`
- `POST /refresh-token`
- `POST /logout`
- `POST /onboard`
- `GET /me`

### User Routes

Base path: `/api/user`

Protected by JWT middleware.

- `GET /`
- `GET /friends`
- `POST /friend-request/:id`
- `PUT /friend-request/:id/accept`
- `PUT /friend-request/:id/reject`
- `GET /friend-requests`
- `GET /outgoing-friend-requests`

### Chat Routes

Base path: `/api/chat`

- `POST /send/:id`
- `GET /get/:id`
- `GET /friend-details/:id`

### Middleware

- `verifyJWT` protects authenticated routes
- `upload.single('avatar')` handles onboarding image upload

### Backend Conventions

- Controllers should contain business logic, not route wiring.
- Route files should stay thin and readable.
- Use the shared async/error helpers where possible.
- Return consistent API responses through the project’s response wrappers.

## Frontend Guide

### App Routing

The main route control lives in [frontend/src/App.jsx](../frontend/src/App.jsx).

Important routes:

- `/` home page for onboarded users
- `/login`
- `/signup`
- `/onboarding`
- `/chat/:id`
- `/call/:callId`
- `/notifications`
- `/friends`

### App Behavior

- Auth state is loaded through the `useAuthUser` hook.
- A loading screen is shown while auth state is resolving.
- Non-authenticated users are redirected to login.
- Users who have not completed onboarding are sent to onboarding.

### Frontend Structure Notes

- Pages hold route-level UI and feature entry points.
- Components are shared building blocks used across pages.
- Hooks encapsulate reusable client logic.
- Utils hold API clients and endpoint helpers.

## Real-Time Features

### Socket.io

Socket.io supports low-latency messaging and live app updates. It is the right place to extend features such as:

- Typing indicators
- Live message delivery
- Presence updates
- Notification events

### WebRTC

The WebRTC layer supports direct call flows. It is the right place to work on:

- Call signaling
- Room/session joining
- Caller and receiver role handling
- Future media negotiation changes

### Cloudinary Uploads

Avatar uploads during onboarding use the upload middleware and Cloudinary integration.

## Data Flow and API Routes

### Typical Auth Flow

1. User submits login or registration form.
2. Backend verifies the credentials.
3. Session/auth token is established.
4. Frontend fetches the current user state.
5. If the profile is incomplete, onboarding is required.

### Typical Onboarding Flow

1. User fills profile fields.
2. Avatar is uploaded through multipart form data.
3. Backend stores the completed profile data.
4. Frontend refreshes auth user state.

### Typical Chat Flow

1. User opens a connection or friend profile.
2. Frontend loads the conversation view.
3. Messages are fetched from the chat endpoint.
4. New messages are sent through the chat API and propagated in real time.

### Typical Friend Request Flow

1. User views recommended users or friend list.
2. A request is sent to the user route.
3. The target user can accept or reject the request.
4. Friend lists and requests refresh in the UI.

## Common Development Tasks

### Add a New Route

1. Add the handler in the relevant controller.
2. Register the route in the matching route file.
3. Protect it with `verifyJWT` if it requires authentication.
4. Update the frontend API helper if needed.

### Add a New Page

1. Create the page under [frontend/src/pages](../frontend/src/pages).
2. Add the route in [frontend/src/App.jsx](../frontend/src/App.jsx).
3. Wrap it in the shared layout if it belongs inside the authenticated shell.

### Add a Shared Component

1. Create the component in [frontend/src/components](../frontend/src/components).
2. Keep it presentational when possible.
3. Pass data in through props instead of hard-coding state.

### Work on Chat or Call Features

1. Check the backend route/controller pair.
2. Review the Socket.io or WebRTC server layer.
3. Confirm the frontend page that consumes the data.
4. Test the flow with two browser sessions when possible.

## Troubleshooting

### Backend does not start

- Confirm `npm install` completed in [backend](../backend).
- Check that the `.env` values are present.
- Verify MongoDB is reachable.

### Frontend cannot reach the API

- Confirm the backend is running on the expected port.
- Check `VITE_BACKEND_URL` in the frontend environment file.
- Make sure the backend CORS origin matches the frontend origin.

### Auth redirect loops

- Confirm the user token is still valid.
- Check whether onboarding is required.
- Inspect the auth hook and route guards.

### Uploads fail during onboarding

- Verify the upload middleware is active.
- Confirm Cloudinary credentials are configured.
- Check that the temporary upload directory exists.

### Real-time features do not behave correctly

- Verify the Socket.io/WebRTC server is running.
- Test with two browser windows or different accounts.
- Check the browser console and backend logs.

## API Reference

This section documents all API endpoints and their request/response formats.

### Auth Endpoints

#### POST /api/auth/register

Register a new user account.

**Request Body:**
```json
{
  "fullName": "string",
  "email": "string",
  "password": "string"
}
```

**Response (201):**
```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "user": {
      "_id": "string",
      "fullName": "string",
      "email": "string",
      "avatar": "string",
      "isOnboarded": false
    }
  },
  "message": "User registered Successfully"
}
```

**Cookies Set:** `accessToken`, `refreshToken`

**Errors:**
- 400: Missing required fields
- 409: User with email already exists

---

#### POST /api/auth/login

Authenticate a user and establish a session.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "user": {
      "_id": "string",
      "fullName": "string",
      "email": "string",
      "avatar": "string",
      "isOnboarded": true
    }
  },
  "message": "User logged in successfully"
}
```

**Cookies Set:** `accessToken`, `refreshToken`

**Errors:**
- 404: Email not registered
- 400: Incorrect password

---

#### POST /api/auth/onboard

Complete user profile onboarding with skills, bio, location, and avatar.

**Headers:** Authorization (Bearer token required)

**Request Body (multipart/form-data):**
```
fullName: string
bio: string
skills[]: array of strings (can be sent multiple times)
location: string
avatar: file (image)
```

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "user": {
      "_id": "string",
      "fullName": "string",
      "bio": "string",
      "skills": ["string"],
      "location": "string",
      "avatar": "string (Cloudinary URL)",
      "isOnboarded": true,
      "embeddings": [number]
    }
  },
  "message": "User onboarded successfully"
}
```

**Errors:**
- 400: Missing required fields or avatar upload fails
- 401: Unauthorized (token required)

---

#### POST /api/auth/refresh-token

Get a new access token using a valid refresh token.

**Request Body:**
```json
{
  "refreshToken": "string (optional, can use cookie)"
}
```

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "accessToken": "string",
    "refreshToken": "string"
  },
  "message": "Access token refreshed"
}
```

**Errors:**
- 401: Invalid or missing refresh token

---

#### POST /api/auth/logout

Log out the current user and clear session.

**Headers:** Authorization (Bearer token required)

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {},
  "message": "User logged Out"
}
```

---

#### GET /api/auth/me

Get the current authenticated user's details.

**Headers:** Authorization (Bearer token required)

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "_id": "string",
    "fullName": "string",
    "email": "string",
    "bio": "string",
    "avatar": "string",
    "location": "string",
    "skills": ["string"],
    "friend": ["string (User IDs)"],
    "isOnboarded": true
  },
  "message": "Current user details"
}
```

---

### User Endpoints

All user endpoints require authorization (Bearer token).

#### GET /api/user/

Get recommended users based on skill similarity.

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": [
    {
      "_id": "string",
      "fullName": "string",
      "avatar": "string",
      "location": "string",
      "skills": ["string"],
      "bio": "string"
    }
  ],
  "message": "Recommended users fetched successfully"
}
```

**Note:** Results are cached for 24 hours per user.

---

#### GET /api/user/friends

Get the current user's friends list.

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "_id": "string",
    "friend": [
      {
        "_id": "string",
        "fullName": "string",
        "avatar": "string",
        "location": "string",
        "skills": ["string"],
        "bio": "string"
      }
    ]
  },
  "message": "Friends fetched successfully"
}
```

---

#### POST /api/user/friend-request/:id

Send a friend request to another user.

**URL Parameters:** `id` - recipient user ID

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "_id": "string",
    "sender": "string",
    "recipient": "string",
    "status": "pending",
    "createdAt": "ISO date"
  },
  "message": "Friend Request sent"
}
```

**Errors:**
- 400: Cannot send request to self, or request already exists
- 404: Recipient not found

---

#### PUT /api/user/friend-request/:id/accept

Accept an incoming friend request.

**URL Parameters:** `id` - friend request ID

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "sender": { /* user object */ },
    "recipient": { /* user object */ }
  },
  "message": "Friend request accepted"
}
```

---

#### PUT /api/user/friend-request/:id/reject

Reject an incoming friend request.

**URL Parameters:** `id` - friend request ID

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Friend request rejected"
}
```

---

#### GET /api/user/friend-requests

Get incoming and accepted friend requests.

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "incommingRequest": [
      {
        "_id": "string",
        "sender": { "fullName": "string", "avatar": "string", "skills": ["string"], "location": "string" },
        "status": "pending"
      }
    ],
    "acceptedRequest": [
      {
        "_id": "string",
        "sender": { /* user object */ },
        "status": "accepted"
      }
    ]
  },
  "message": "Incoming and accepted requests fetched successfully"
}
```

---

#### GET /api/user/outgoing-friend-requests

Get outgoing (pending) friend requests sent by the current user.

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": [
    {
      "_id": "string",
      "recipient": { "fullName": "string", "avatar": "string", "skills": ["string"], "location": "string" },
      "status": "pending",
      "createdAt": "ISO date"
    }
  ],
  "message": "Outgoing requests fetched successfully"
}
```

---

### Chat Endpoints

All chat endpoints require authorization (Bearer token).

#### POST /api/chat/send/:id

Send a message to another user.

**URL Parameters:** `id` - recipient user ID

**Request Body:**
```json
{
  "message": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "_id": "string",
    "sender": "string (user ID)",
    "recipient": "string (user ID)",
    "message": "string",
    "createdAt": "ISO date"
  },
  "message": "Message Sent Successfully"
}
```

**Errors:**
- 400: Empty message or recipient not found

---

#### GET /api/chat/get/:id

Get message history with another user.

**URL Parameters:** `id` - other user ID

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": [
    {
      "_id": "string",
      "sender": "string",
      "recipient": "string",
      "message": "string",
      "createdAt": "ISO date"
    }
  ],
  "message": "Conversation successfully loaded"
}
```

---

#### GET /api/chat/friend-details/:id

Get a friend's profile details.

**URL Parameters:** `id` - friend user ID

**Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "_id": "string",
    "fullName": "string",
    "email": "string",
    "bio": "string",
    "avatar": "string",
    "location": "string",
    "skills": ["string"],
    "isOnboarded": true,
    "friend": ["string (connected user IDs)"]
  },
  "message": "User details fetched successfully"
}
```

---

## Database Schema

This section documents the MongoDB models and their fields.

### User

Stores user account and profile information.

**Collection:** `users`

**Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Unique user identifier |
| `fullName` | String | User's full name (required) |
| `email` | String | Unique email address (required) |
| `password` | String | Hashed password (required) |
| `bio` | String | User bio / profile description |
| `avatar` | String | URL to profile image (from Cloudinary) |
| `location` | String | User's location / country |
| `skills` | [String] | Array of skills/expertise areas |
| `embeddings` | [Number] | 768-dimensional vector for similarity matching |
| `isOnboarded` | Boolean | Whether profile setup is complete |
| `friend` | [ObjectId] | Array of friend user IDs (refs to User) |
| `refreshToken` | String | JWT refresh token for session |
| `createdAt` | Date | Account creation timestamp |
| `updatedAt` | Date | Last profile update timestamp |

**Indexes:**
- `email` (unique)
- `createdAt`
- `skills`

**Hooks:**
- Password hashing on save
- Token generation methods

---

### Message

Stores individual messages between users.

**Collection:** `messages`

**Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Unique message identifier |
| `sender` | ObjectId | User ID of sender (ref to User) |
| `recipient` | ObjectId | User ID of recipient (ref to User) |
| `message` | String | Message content (required) |
| `createdAt` | Date | Message timestamp |
| `updatedAt` | Date | Last edit timestamp |

---

### Conversation

Groups messages between two users into a thread.

**Collection:** `conversations`

**Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Unique conversation identifier |
| `members` | [ObjectId] | Two user IDs (refs to User) |
| `messages` | [ObjectId] | Array of message IDs (refs to Message) |

**Note:** Members array is order-independent; MongoDB queries use `$all` operator.

---

### FriendRequest

Tracks pending, accepted, and rejected friend requests.

**Collection:** `friendrequests`

**Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Unique request identifier |
| `sender` | ObjectId | User ID who sent the request (ref to User) |
| `recipient` | ObjectId | User ID who received the request (ref to User) |
| `status` | String | Enum: `pending`, `accepted`, `rejected` |
| `createdAt` | Date | Request creation timestamp |
| `updatedAt` | Date | Last status update timestamp |

**Validation:**
- Status must be one of the enum values
- Default status is `pending`

---

## Contribution Notes

- Keep changes focused and minimal.
- Prefer updating the existing route/controller structure rather than introducing duplicate patterns.
- Match the current code style in the file you are editing.
- Add documentation updates when behavior changes.
- Avoid changing unrelated logic when you are working on a specific feature.

## Recommended Next Steps

If you are continuing development, the best next improvements are usually:

1. Add validation middleware for input sanitization.
2. Implement rate limiting on auth endpoints.
3. Add comprehensive error logging and monitoring.
4. Expand chat features with typing indicators and read receipts.
5. Integrate advanced recommendation algorithms.


