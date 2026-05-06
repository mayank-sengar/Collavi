# Collavi User Guide

This guide explains how to use Collavi as an end user. It is written for people who want to create an account, complete their profile, find other users, chat, make calls, and manage requests and notifications.

## Table of Contents

1. Overview
2. Getting Started
3. Account Creation and Login
4. Profile Onboarding
5. Main Areas of the App
6. Finding People and Sending Friend Requests
7. Chat and Messaging
8. Video Calls
9. Notifications
10. Common Workflows
11. Troubleshooting
12. FAQ

## Overview

Collavi is a communication platform built around skills, interests, and professional collaboration. You can use it to:

- Create a profile with your bio, skills, location, and avatar
- Discover people with similar interests
- Send and manage friend requests
- Chat in real time
- Start video calls for deeper conversations
- Track notifications for requests and activity

## Getting Started

To use the app locally, you need:

- A running backend server
- A running frontend app
- MongoDB configured in the backend
- The required API keys and environment variables

Typical local access points are:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`

If the backend is configured on another port or host, use the values in your environment files.

## Account Creation and Login

### Sign Up

Use the sign-up page to create a new account. You will usually provide basic account information and then be redirected into the app flow.

### Login

Use the login page if you already have an account. After successful login, Collavi checks whether your profile onboarding is complete.

### What happens after login

- If you are fully onboarded, you are taken to the home page.
- If your profile is not complete, Collavi opens the onboarding screen.
- If your session is not valid, you are redirected back to login.

## Profile Onboarding

Onboarding is the step where you complete your public profile. It helps other users understand who you are and what you can offer.

You can add or update:

- Profile photo
- Full name
- Bio
- Skills
- Location

### Adding skills

Skills are added as tags. You can type a skill and press Enter or use the Add button.

### Profile photo

Upload a profile photo to make your account easier to recognize. The image is previewed before submission.

### Why onboarding matters

Most main features of the app are available only after onboarding is complete.

## Main Areas of the App

### Home

The home page is the main landing page after login. It is typically where you start exploring the app.

### Friends

The Friends page is where you manage your network. You can view existing connections, incoming requests, and outgoing requests.

### Notifications

Notifications help you keep track of new friend requests, chat activity, and other important updates.

### Chat

The chat area lets you message connected users in real time.

### Video Call

The call page is used for live video conversations.

## Finding People and Sending Friend Requests

Collavi is built around connecting with people who match your interests or skills.

### Recommended users

The app can show recommended users after login. These are people you can potentially connect with based on the app's matching logic.

### Send a request

When you find a person you want to connect with, send them a friend request.

### Incoming requests

If someone sends you a request, you can review it and either accept or reject it.

### Outgoing requests

You can also check the requests you have already sent.

### Accepted requests

Once a request is accepted, the user becomes part of your network and you can chat with them.

## Chat and Messaging

Once you are connected with another user, you can open a chat thread and start messaging.

### What chat is used for

- Quick collaboration
- Asking questions
- Sharing updates
- Coordinating calls or projects

### How chat works

- Open a user conversation from your network or chat area
- Type your message
- Send it to the selected user
- View message history in the thread

### Best practices

- Keep messages clear and specific
- Use chat for fast coordination
- Switch to a video call if the discussion becomes detailed

## Video Calls

Collavi supports video consultations for direct face-to-face communication.

### When to use a call

- Reviewing work together
- Mentorship or tutoring
- Longer conversations
- Explaining something that is easier to show than to type

### Call flow

- Open a call link or start a call from the app
- Join the call session
- Use your microphone and camera as needed
- End the call when finished

### Tips for better calls

- Check camera and microphone permissions before joining
- Use a stable internet connection
- Mute when not speaking in group-style scenarios

## Notifications

Notifications keep you informed about activity that needs your attention.

You may see alerts for:

- Friend requests
- Request acceptance or rejection
- Message activity
- Call-related activity

Check notifications regularly so you do not miss important updates.

## Common Workflows

### First-time user flow

1. Sign up
2. Log in
3. Complete onboarding
4. Explore recommended users
5. Send friend requests
6. Start chatting
7. Move to a video call when needed

### Networking flow

1. Browse users
2. Review a profile
3. Send a request
4. Wait for acceptance
5. Chat after connection is accepted

### Collaboration flow

1. Find a user with the right skills
2. Connect via friend request
3. Share context in chat
4. Schedule or start a call
5. Follow up in chat after the call

## Troubleshooting

### I am stuck on login or onboarding

- Make sure your account is logged in correctly
- Check whether your profile onboarding is complete
- Refresh the page if the UI seems stuck

### Friend requests are not updating

- Reload the page
- Check your network connection
- Confirm the request was actually sent or accepted

### Chat does not open

- Verify that the other user is connected to you
- Make sure your session is still active
- Retry after refreshing the app

### Video call issues

- Confirm camera and microphone permissions
- Close other apps using the camera
- Use a better network connection if the call is unstable

### Avatar upload problems

- Use a supported image file
- Retry with a smaller image if upload fails
- Check whether file permissions or browser restrictions are blocking upload

## FAQ

### Do I need to complete onboarding?

Yes. The app expects you to complete your profile before using the main social and communication features.

### Can I change my profile later?

Yes. You can update your profile information, skills, and avatar when needed.

### Can I chat without being connected?

The normal flow is to connect first, then chat.

### What should I do if I do not see notifications?

Refresh the page and confirm that your session is still active.

### Is Collavi only for one type of user?

No. It is useful for students, developers, mentors, job seekers, and anyone looking to collaborate.

## Support Notes

If you are sharing this app with other users, point them to this guide first. It covers the standard path from sign-up to chat and calls.