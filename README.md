<h1 align="center">Habitify – Full-Stack Habit Tracker</h1>

<p align="center">
  A modern habit tracking application built with React, TypeScript, and Spring Boot microservices.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React-blue" alt="React">
  <img src="https://img.shields.io/badge/Backend-Spring%20Boot-green" alt="Spring Boot">
  <img src="https://img.shields.io/badge/Auth-JWT-orange" alt="JWT">
</p>

---

## Table of Contents

- [About the Project](#about-the-project)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Architecture](#architecture)
- [How It Works](#how-it-works)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [License](#license)

---

## About the Project

Habitify is a full-stack habit tracking platform designed to help users build consistent routines and maintain productivity through streak tracking.

The application allows users to create habits, mark them as completed daily, track streak progress, and celebrate milestone achievements.

The project demonstrates a **microservice-based backend architecture with JWT authentication**, paired with a modern **React + TypeScript frontend**.

It showcases real-world concepts including authentication, REST APIs, microservices, state management, and UI interaction.

---

## Tech Stack

### Frontend

- **React.js** – UI rendering and component architecture  
- **TypeScript** – Type safety and scalable frontend development  
- **Axios** – API communication  
- **Custom CSS** – Styling and animations  
- **Vite** – Fast frontend build tool  

### Backend

- **Spring Boot** – Backend framework  
- **Spring Security** – Authentication and authorization  
- **JWT (JSON Web Tokens)** – Secure authentication system  
- **Hibernate / JPA** – ORM for database interaction  

### Database

- **PostgreSQL** (production)  
- **H2** (development)

---

## Features

- 🔐 **JWT Authentication** – Secure login and registration  
- 📋 **Habit Creation** – Add and manage habits easily  
- 🔥 **Streak Tracking** – Track consecutive completion days  
- 🎉 **Milestone Celebrations** – Confetti animations for major streaks  
- 📊 **Progress Tracking** – Weekly completion progress bar  
- ⚡ **Instant UI Updates** – React state dynamically updates habits  
- ⌨️ **Keyboard Friendly** – Login/Register via Enter key  
- 🔄 **Persistent Login** – Session maintained using stored JWT  

---

## Architecture

Habitify follows a **microservice architecture**:

React Frontend
     │
     │ Axios + JWT
     ▼
Auth Service (Spring Boot)
Handles login, registration, and JWT generation
     │
     ▼
Habit Service (Spring Boot)
Handles habit CRUD operations and streak logic
     │
     ▼
Database

The frontend communicates with backend services via REST APIs using Axios.

---

## How It Works

### Authentication Flow

1. User registers or logs in  
2. Backend generates a **JWT token**  
3. Token is stored in **localStorage**  
4. Axios automatically attaches the token to protected requests  
5. Backend validates the token before processing requests

---

### Habit Flow

1. User creates a new habit  
2. Habit appears in the dashboard  
3. Clicking **Done** marks the habit completed for the day  
4. Streak count increases automatically  
5. Major streak milestones trigger celebration animations

---

## Usage

### Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/habitify.git
cd habitify
