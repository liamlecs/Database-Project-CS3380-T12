# 📚 E‑Library @ UH

Welcome to the official GitHub repository for **E‑Library**, a full-stack web application built by **Team 12** for the University of Houston’s COSC 3380: Database Systems course.

![Homepage](https://github.com/user-attachments/assets/6e0e8624-cd57-45c1-9d8d-f3c01f0dffec)

---

## 📖 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Folder Structure](#folder-structure)
5. [Installation & Setup](#installation--setup)
6. [Local Development](#local-development)
7. [Deployment](#deployment)
8. [Environment Variables](#environment-variables)
9. [Contributing](#contributing)
10. [License](#license)
11. [Contact](#contact)

---

## 🔍 Overview

**E‑Library @ UH** is a dynamic digital library platform designed to simplify library management for both **users** (students, faculty) and **employees** (librarians, admins). It supports the borrowing, reserving, and tracking of library assets like books, movies, music, and technology.

**Live Website**: [https://e-libraryuh.vercel.app](https://e-libraryuh.vercel.app)

---

## 🚀 Features

- **Inventory Management**  
  Add, update, deactivate, and manage cover images for items like books, movies, music, and technology using Azure Blob Storage.

- **Role-Based Access Control**  
  Different interfaces and privileges for Customers, Employees, and Admins, with automatic classification based on UH email type (`@uh.edu` vs `@cougarnet.uh.edu`).

- **Search & Waitlists**  
  Users can search across categories and join waitlists for unavailable items. Waitlist fulfillment is automated with email alerts and timed holds.

- **Email Notifications**  
  EmailJS and SMTP integration for waitlist alerts, confirmations, and other key user interactions.

- **Fines System**  
  Automatic fine generation for overdue items, tracked in a centralized report. Users are restricted from borrowing with unpaid fines.

- **Donations**  
  Customers can contribute to the library directly through the platform. Donations are tracked and visible to employees.

- **Analytics & Reports**  
  Real-time data visualizations and filtering for inventory status, transaction history, fines, waitlists, and user activity.

---

## 🛠️ Technology Stack

| Layer       | Tech Used                          |
|-------------|------------------------------------|
| Frontend    | React (Vite + TypeScript)          |
| Backend     | ASP.NET Core 6 + Entity Framework  |
| Database    | Microsoft SQL Server (Azure-hosted)|
| Auth/Email  | EmailJS, SMTP                      |
| Storage     | Azure Blob Storage                 |
| Hosting     | Vercel (frontend), Azure App Service (API) |

---

## 🗂️ Folder Structure

```
Database-Project-CS3380-T12/
├─ libraryWebAPI/          # .NET Core backend
│  ├─ Controllers/         # API endpoints
│  ├─ Models/              # Entities & DTOs
│  ├─ Data/                # EF Core context
├─ libraryApp/             # React frontend
│  ├─ src/                 # Main source code
│  ├─ public/              # Static assets
└─ ...
```

---

## 💻 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/liamlecs/Database-Project-CS3380-T12.git
cd Database-Project-CS3380-T12
```

### 2. Setup the Back End

```bash
cd libraryWebAPI
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "<your_connection_string>"
dotnet user-secrets set "AzureBlobStorage:ConnectionString" "<azure_blob_storage_string>"
dotnet run
```

By default, the API runs at: `http://localhost:5217`

### 3. Setup the Front End

```bash
cd ../libraryApp
npm install
```

Create a `.env` file:
```env
VITE_API_BASE_URL=http://localhost:5217
VITE_PUBLIC_ASSET_BASE_URL=http://localhost:5217
VITE_EMAILJS_USER_ID=...
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_TEMPLATE_ID=...
```

Then run the app:
```bash
npm run dev
```

Local frontend URL: `http://localhost:5173`

---

## 🌐 Deployment

### API (Azure App Service)
- Publish using Visual Studio or GitHub Actions
- Set your environment variables in **Azure Portal > Configuration**

### Frontend (Vercel)
- Link your GitHub repo to a new Vercel project
- Set:
  - `VITE_API_BASE_URL` → Azure App URL
- Build command: `npm run build`
- Output directory: `dist`

---

## 🔐 Environment Variables

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5217
VITE_PUBLIC_ASSET_BASE_URL=http://localhost:5217
VITE_EMAILJS_USER_ID=your_id
VITE_EMAILJS_SERVICE_ID=your_service
VITE_EMAILJS_TEMPLATE_ID=your_template
```

### Backend (dotnet user-secrets)
```bash
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "..."
dotnet user-secrets set "AzureBlobStorage:ConnectionString" "..."
dotnet user-secrets set "Smtp:Password" "..."
```

---

## 🤝 Contributing

Pull requests are welcome! For major changes, open an issue first to discuss what you’d like to change.

1. Fork the repo
2. Create a new branch
3. Make changes and commit
4. Open a pull request with a detailed explanation

---

## 📄 License

This project is licensed for academic use only under Team 12 (University of Houston, COSC 3380). Redistribution or commercial use is not permitted.

---

## 📬 Contact

**Team 12 – University of Houston**  
📧 Email: [uhelibrary5@gmail.com](mailto:uhelibrary5@gmail.com)  
👤 Maintainer: [Liam Le](https://github.com/liamlecs)

---

> Thank you for exploring E‑Library! We hope this project serves as a strong foundation for future library systems and student-led development.
