# E‑Library @ UH

Welcome to the **E‑Library Database Project** for **Team 12 COSC 3380**!

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
- Offers JWT-based authentication and role-based authorization
- Deployed on **Azure App Service** (API) and **Vercel** (front end)

---

## Features

- **Inventory Management**: 
  - Add, edit, and delete items (books, movies, music, technology)
  - Upload cover images to Azure Blob Storage
- **User Roles**:
  - JWT authentication
  - Employee vs. Customer roles
- **Search & Waitlists**:
  - Full-text search on titles
  - Waitlist system for items that are out of stock
- **Email Notifications**:
  - SMTP integration for certain events (e.g., waitlist availability)
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
4. **Authentication**: JWT Bearer tokens  
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
├─ LICENSE (optional)
└─ ...
```

- **libraryWebAPI**: The .NET 6 Web API with EF Core, controllers, models, data context, etc.  
- **libraryApp**: The React front end with TypeScript components, pages, forms, etc.

---

## Installation & Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/<your-org>/Database-Project-CS3380-T12.git
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
   dotnet user-secrets set "Jwt:Key" "<your_jwt_secret>"
   dotnet user-secrets set "ConnectionStrings:DefaultConnection" "<local_connection_string>"
   dotnet user-secrets set "AzureBlobStorage:ConnectionString" "<blob_storage_connection>"
   # etc...
   ```
3. **Run the API**:
   ```bash
   dotnet run
   ```
   By default, it listens on `https://localhost:7217` (or a similar port).

### Front End (React)

1. **Navigate to** `libraryApp/`
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure environment** (e.g., `.env.local`):
   ```env
   VITE_API_BASE_URL=https://localhost:7217
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
3. **Set Environment Variables** in Azure Portal under *Configuration > Application Settings*:
   - `ConnectionStrings:DefaultConnection`
   - `Jwt:Key`
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
- **`Jwt:Key`** – Secret key for JWT tokens  
- **`AzureBlobStorage:ConnectionString`** – Blob storage connection  
- **`Smtp:Password`** – Password for SMTP

**Front End**:
- **`VITE_API_BASE_URL`** – The base URL for API calls (e.g. your Azure App Service URL)

Use environment variables instead of hardcoding secrets.

---

## Contributing

1. **Fork** the repo and create a feature branch for each set of changes.
2. **Follow** best practices for commits and pull requests.
3. **Open** a pull request and wait for code reviews or approvals.
4. **Ensure** that code merges are done into the main branch upon approval.

We welcome bug reports, feature requests, and pull requests that align with the project goals.

---

## License

*(Optional)* If you have a license, specify which one here (e.g., MIT, Apache, etc.). Otherwise, note that it is proprietary or belongs to the team.

---

## Contact

**Team 12 – E-Library @ UH**  
**Email:** [uhelibrary5@gmail.com](mailto:uhelibrary5@gmail.com)  
**Slack/Team Chat:** Internal UH Slack or Teams channel.

For any questions, issues, or suggestions, feel free to open an issue on GitHub or contact us via the email above.

---

**Thank You for Checking Out Our Project!**  
We hope you find **E-Library @ UH** helpful for managing library resources. If you’d like to contribute or have any ideas, please feel free to open an issue or PR.
