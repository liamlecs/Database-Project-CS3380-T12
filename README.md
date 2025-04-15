# E‑Library @ UH

Welcome to the **E‑Library Database Project** for **Team 12 COSC 3380**!

![image](https://github.com/user-attachments/assets/f9a43e32-c835-4a28-85c1-5c105420aa29)


## Table of Contents
1. [Project Overview](#project-overview)
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

## Project Overview

**E‑Library @ UH** is a web-based library management system that allows librarians and customers to manage books, movies, music, and technology inventories. It provides searching, borrowing, waitlists, and more, all through a convenient web interface. This project was created as part of our **COSC 3380** class at the University of Houston, Team 12.

**Key highlights**:
- Manage library items (Books, Movies, Music, Technology) with an intuitive interface
- Tracks availability, waitlists, and borrowing
- Integrates with Azure Blob Storage for cover image uploads
- Offers email-based authentication and role-based authorization
- Deployed on **Azure App Service** (API) and **Vercel** (front end): https://e-libraryuh.vercel.app

---

## Features

- **Inventory Management**: 
  - Add, edit, and delete items (books, movies, music, technology)
    ![image](https://github.com/user-attachments/assets/ba75a211-85f3-4894-a31a-cfd46918bf7a)

  - Upload cover images to Azure Blob Storage
    <p align="center">
    <img src="https://github.com/user-attachments/assets/8dc4e63f-6faa-4f50-87f5-ee562d206871">
    </p>  
- **User Roles**:
  - Email Authentication for Faculty versus Student Customer Account
    ![image](https://github.com/user-attachments/assets/a69fb783-d6d2-4dae-bf6d-2f8805f8c972)
  - Employee vs. Customer roles
    ![image](https://github.com/user-attachments/assets/5b0852b1-a7f0-4c28-a9eb-62640d0b3be6)
    ![image](https://github.com/user-attachments/assets/35eb8e99-437b-4d9f-983a-74cb9eb158c5)

- **Search & Waitlists**:
  - Full-text search on titles
    <p align="center">
    <img src="https://github.com/user-attachments/assets/7c54918d-f60e-45d2-a47d-79179b89e69d">
    </p>  

  - Waitlist system for items that are out of stock
    <p align="center">
    <img src="https://github.com/user-attachments/assets/44d99526-1e2e-4b74-8e47-346b34161fe9">
    </p>  
    ![image](https://github.com/user-attachments/assets/10e9a800-df89-49cd-92e1-73bbbdae4722)

- **Email Notifications**:
  - SMTP integration for certain events (e.g., waitlist availability)
    ![image](https://github.com/user-attachments/assets/b7ad60ef-cfa2-4611-9344-5722bf4710b3)
    
- **Security**:
  - HTTPS, HSTS (in production)
  - Environment variable–based secrets
  - Role-based authorization (`Employee` policy) for restricted endpoints

---

## Technology Stack

1. **Back End**: ASP.NET Core 6 (C#), Entity Framework Core, SQL Server (Azure SQL Database)
2. **Front End**: React (TypeScript)  
3. **Hosting**:
   - **API**: Azure App Service  
   - **Front End**: Vercel  
   - **Database**: Azure SQL  
   - **Blob Storage**: Azure Blob Storage
4. **Authentication**: Email Authentication for Faculty versus Student Customer Account
5. **Email**: SMTP (Gmail)

---

## Folder Structure

Here’s an overview of the main folders in the repository:

```
Database-Project-CS3380-T12/
├─ libraryWebAPI/          # ASP.NET Core backend (API)
│  ├─ Controllers/         # API controllers (Book, Movie, Music, Technology, etc.)
│  ├─ Models/              # Entity and DTO classes
│  ├─ Data/                # EF Core DbContext and data seeds
│  ├─ Program.cs           # Main entry point for the API
│  └─ ...
├─ libraryApp/             # React front-end (BookForm, MovieForm, etc.)
│  ├─ src/                 # React source code
│  ├─ public/              # Static files
│  └─ ...
├─ .gitignore
├─ README.md               # Project documentation (you are here!)
└─ ...
```

- **libraryWebAPI**: The .NET 6 Web API with EF Core, controllers, models, data context, etc.  
- **libraryApp**: The React front end with TypeScript components, pages, forms, etc.

---

## Installation & Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/liamlecs/Database-Project-CS3380-T12.git
   cd Database-Project-CS3380-T12
   ```

2. **.NET Dependencies**:
   - .NET 6 SDK or later installed
   - (Optional) Visual Studio 2022 or VS Code for development

3. **Node.js Dependencies** (for the front end):
   - Node.js (16+ recommended)
   - npm or yarn

---

## Local Development

### Back End (ASP.NET Core)

1. **Navigate to** `libraryWebAPI/`
2. **Set environment variables or use dotnet-user-secrets**:
   ```bash
   dotnet user-secrets init
   dotnet user-secrets set "ConnectionStrings:DefaultConnection" "<local_connection_string>"
   dotnet user-secrets set "AzureBlobStorage:ConnectionString" "<blob_storage_connection>"
   # etc...
   ```
3. **Run the API**:
   ```bash
   dotnet run
   ```
   By default, it listens on `https://localhost:5217` (or a similar port).

### Front End (React)

1. **Navigate to** `libraryApp/`
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure environment** (e.g., `.env.local`):
   ```env
   VITE_API_BASE_URL=https://localhost:5217
   ```
4. **Start the dev server**:
   ```bash
   npm run dev
   ```
   By default, it listens on `http://localhost:5173`.

---

## Deployment

### Deploying the Back End to Azure App Service

1. **Build & Publish**: 
   ```bash
   dotnet publish -c Release
   ```
2. **Deploy** to Azure using either:
   - Visual Studio’s “Publish” wizard
   - Azure CLI
   - GitHub Actions (CI/CD pipeline)
3. **Set Environment Variables** in Azure Portal under *Settings > Environment variables*:
   - `ConnectionStrings:DefaultConnection`
   - `AzureBlobStorage:ConnectionString`
   - etc.

### Deploying the Front End to Vercel

1. **Create a Project** in Vercel & link to this repo (or a subfolder).
2. **Set Environment Variables** in the Vercel dashboard:
   - `VITE_API_BASE_URL` pointing to your Azure App Service URL
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Trigger Deployment**: 
   - Vercel automatically runs your build on each push to the main branch (unless configured otherwise).

---

## Environment Variables

**Common Variables**:
- **`ConnectionStrings:DefaultConnection`** – Database connection string  
- **`AzureBlobStorage:ConnectionString`** – Blob storage connection  
- **`Smtp:Password`** – Password for SMTP

**Front End**:
- **`VITE_API_BASE_URL`** – The base URL for API calls
- **`VITE_PUBLIC_ASSET_BASE_URL`** – The public base URL for serving static assets
- **`VITE_EMAILJS_USER_ID`** – EmailJS User ID
- **`VITE_EMAILJS_SERVICE_ID`** – EmailJS Sevice ID
- **`VITE_EMAILJS_TEMPLATE_ID`** – EmailJS Template ID

Use environment variables instead of hardcoding secrets for security.

---

## Contributing

1. **Fork** the repo and create a feature branch for each set of changes.
2. **Follow** best practices for commits and pull requests.
3. **Open** a pull request and wait for code reviews or approvals.
4. **Ensure** that code merges are done into the main branch upon approval.

We welcome bug reports, feature requests, and pull requests that align with the project goals.

---

## License

This project is proprietary and is owned by Team 12, COSC 3380 @ UH. No part of this project may be reproduced or distributed without explicit written permission.

---

## Contact

**Team 12 – E-Library @ UH**  
**Email:** [uhelibrary5@gmail.com](mailto:uhelibrary5@gmail.com)  
**Slack/Team Chat:** Internal UH Slack or Teams channel.

For any questions, issues, or suggestions, feel free to open an issue on GitHub or contact us via the email above.

---

**Thank You for Checking Out Our Project!**  
We hope you find **E-Library @ UH** helpful for managing library resources. If you’d like to contribute or have any ideas, please feel free to open an issue or PR.
