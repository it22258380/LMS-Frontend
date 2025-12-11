# LMS-Frontend
LMS-Frontend with next js ans tailwind CSS
# Next.js Frontend for Library Management System

This is the frontend application for the Library Management System built with **Next.js**, **React**, **Tailwind CSS**, and **Shadcn/MUI** component library. It supports role-based authentication (USER and LIBRARIAN) and integrates with a Spring Boot backend.

---

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Folder Structure](#folder-structure)
- [Authentication](#authentication)
- [Routing](#routing)
- [Styling](#styling)
- [Role-Based Access](#role-based-access)

---

## Requirements

- Node.js v18+
- npm or yarn
- Backend API running (Spring Boot)

---

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd frontend
Install dependencies:

bash
Copy code
npm install
# or
yarn install
Run development server:

bash
Copy code
npm run dev
# or
yarn dev
The app will be available at http://localhost:3000.

Environment Variables
Create a .env.local file at the root:

env
Copy code
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_API_URL – Base URL of your backend API.

Available Scripts
dev – Run development server

build – Build production app

start – Start production server

lint – Lint codebase

Folder Structure
bash
Copy code
frontend/
├─ app/
│  ├─ auth/
│  │  ├─ login/page.jsx
│  │  └─ signup/page.jsx
│  ├─ user/
│  │  └─ dashboard/page.jsx
│  ├─ librarian/
│  │  └─ dashboard/page.jsx
│  └─ layout.jsx
├─ components/
│  ├─ LoadingSpinner.jsx
│  ├─ ProtectedRoute.jsx
│  └─ ...
├─ contexts/
│  └─ AuthContext.jsx
├─ services/
│  └─ authService.js
├─ utils/
│  └─ constants.js
├─ public/
├─ styles/
│  └─ globals.css
├─ .env.local
├─ package.json
└─ README.md
app/ – Contains Next.js pages using the App Router.

components/ – Reusable UI components.

contexts/ – React Context for authentication.

services/ – API service functions.

utils/ – Constants, helper functions.

styles/ – Tailwind CSS and global styles.

Authentication
Managed via AuthContext.jsx.

Stores JWT and user info in localStorage.

Login, logout, and signup functions provided.

Role is detected from JWT or backend endpoint.

Routing
Public routes: /auth/login, /auth/signup

Protected routes:

/user/dashboard – For USER role

/librarian/dashboard – For LIBRARIAN role

ProtectedRoute.jsx handles authentication and role-based access.

Styling
Tailwind CSS is used for responsive styling.

Components can use Shadcn/UI or MUI.

Utility classes used throughout for spacing, typography, and colors.

Role-Based Access
User role stored in JWT and localStorage.

Backend endpoints determine access for LIBRARIAN-only routes.

Frontend checks role and redirects unauthorized users.

Notes
Make sure your backend API supports CORS for http://localhost:3000.

JWT token expiration is handled in authService.

Modify STORAGE_KEYS in utils/constants.js as needed.