# Buyer–Vendor Ticket Management System

A **full-stack ticket management platform** that enables structured communication between buyers and vendors through a centralized ticket lifecycle system.

The application replaces informal communication methods such as **emails, chats, or phone calls** with a **trackable, role-based ticket workflow** that improves transparency, accountability, and issue resolution efficiency.

---


Frontend:
[https://ticket-desk-frontend.onrender.com](https://ticket-desk-frontend.onrender.com)

Backend API:
[https://ticket-desk-backend-1.onrender.com](https://ticket-desk-backend-1.onrender.com)

---

# Tech Stack

### Backend

* Spring Boot (Java)
* Spring Security
* JWT Authentication
* Maven

### Frontend

* Next.js 14
* React
* Tailwind CSS


### Database

* MongoDB (NoSQL Document Database)

### Architecture

* RESTful API
* Three-tier architecture

Frontend (Next.js) → Backend (Spring Boot API) → MongoDB

---

# Features

### Authentication & Security

* JWT based authentication
* Role Based Access Control (RBAC)
* Secure password hashing using BCrypt
* Spring Security integration

### Ticket Management

* Create new tickets
* Assign tickets to vendors
* Update ticket status
* Resolve and close tickets
* Ticket lifecycle tracking

### Communication

* Comment system for discussions
* Resolution notes
* File attachments support

### Reporting & Tracking

* Ticket history audit trail
* Status filtering
* Priority analytics
* Search and pagination

---

# User Roles

### Buyer

* Create tickets
* View own tickets
* Add comments
* Track ticket progress
* Close resolved tickets

### Vendor

* View assigned tickets
* Update ticket status
* Add resolution notes
* Communicate with buyers

### Admin

* Assign tickets to vendors
* Manage users
* Monitor ticket progress
* View reports and analytics

---

# Ticket Lifecycle

```
OPEN
  ↓
ASSIGNED
  ↓
IN_PROGRESS
  ↓
RESOLVED
  ↓
CLOSED
```

Optional states:

```
ON_HOLD
REOPENED
```

---

# Project Structure

```
ticket-desk
│
├── backend
│   ├── controller
│   ├── service
│   ├── repository
│   ├── security
│   ├── model
│   └── dto
│
├── frontend
│   ├── pages
│   ├── components
│   ├── services
│   └── styles
```

---

# Backend Setup (Spring Boot)

### 1. Clone the repository

```
git clone https://github.com/your-username/ticket-desk-backend.git
cd ticket-desk-backend
```

### 2. Configure MongoDB

Update `application.properties`

```
spring.data.mongodb.uri=mongodb://localhost:27017/ticketdesk
```

### 3. Run the backend

```
mvn spring-boot:run
```

Backend runs on:

```
http://localhost:8080
```

---

# Frontend Setup (Next.js)

### 1. Clone the repository

```
git clone https://github.com/your-username/ticket-desk-frontend.git
cd ticket-desk-frontend
```

### 2. Install dependencies

```
npm install
```

### 3. Start development server

```
npm run dev
```

Frontend runs on:

```
http://localhost:3000
```

---

# REST API Overview

### Authentication

| Method | Endpoint       | Description           |
| ------ | -------------- | --------------------- |
| POST   | /auth/register | Register new user     |
| POST   | /auth/login    | Login and receive JWT |

### Tickets

| Method | Endpoint                        | Description      |
| ------ | ------------------------------- | ---------------- |
| POST   | /tickets                        | Create ticket    |
| GET    | /tickets                        | Get all tickets  |
| GET    | /tickets/{id}                   | Get ticket by id |
| PUT    | /tickets/{id}/assign/{vendorId} | Assign vendor    |
| PUT    | /tickets/{id}/status/{status}   | Update status    |

### Comments

| Method | Endpoint                     | Description  |
| ------ | ---------------------------- | ------------ |
| POST   | /tickets/{ticketId}/comments | Add comment  |
| GET    | /tickets/{ticketId}/comments | Get comments |

---

# Security

Security is implemented using **Spring Security + JWT**.

Features include:

* Stateless authentication
* Token validation filter
* Role based route protection
* BCrypt password encryption

JWT payload contains:

```
email
role
issuedAt
expiry
```

Token expiration: **24 hours**

---

# Database Collections

### users

```
id
name
email
password
role
```

### tickets

```
id
title
description
priority
status
buyerId
vendorId
attachments
createdAt
updatedAt
```

### comments

```
id
ticketId
userId
message
createdDate
```

### ticket_history

```
id
ticketId
status
changedBy
changedAt
```


# Author

Misba Shaikh

Project: Buyer–Vendor Ticket Management System
