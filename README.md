# 📚 E‑Library @ UH

Welcome to the official GitHub repository for **E‑Library**, a full-stack web application built by **Team 12** for the University of Houston’s COSC 3380: Database Systems course.

![Homepage](https://github.com/user-attachments/assets/6e0e8624-cd57-45c1-9d8d-f3c01f0dffec)

---

## 📖 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Folder Structure](#folder-structure)
6. [Installation & Setup](#installation--setup)
7. [Local Development](#local-development)
8. [Deployment](#deployment)
9. [Environment Variables](#environment-variables)
10. [Contributing](#contributing)
11. [License](#license)
12. [Contributors](#contributors)
13. [Contact](#contact)

---
<a name="overview"></a>
## 🔍 Overview

**E‑Library @ UH** is a dynamic digital library platform designed to simplify library management for both **users** (students, faculty) and **employees** (librarians, admins). It supports the borrowing, reserving, and tracking of library assets like books, movies, music, and technology.

**Live Website**: [https://e-libraryuh.vercel.app](https://e-libraryuh.vercel.app)

---
<a name="features"></a>
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
<a name="technology-stack"></a>
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
<a name="folder-structure"></a>
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

## Code File Explanation

Below is a detailed breakdown of every file and folder in the **Database-Project-CS3380-T12** repository, organized by project component.

---

### 🗂️ Root Directory  
- **`Database-Project-CS3380-T12.sln`**: Visual Studio solution file, orchestrates the backend (`LibraryWebAPI`) and frontend (`libraryApp`) projects.  
- **`.gitignore`**: Lists files/folders to exclude from Git version control.  
- **`README.md`**: This README, with project overview, setup, and documentation.  
- **`package.json`** / **`package-lock.json`**: Frontend dependency manifests (scripts, dependencies).  
- **`Database-Project-CS3380-T12.sln`**, **`.gitignore`**, **`README.md`**, **`package.json`**, **`package-lock.json`** citeturn1view0  

---

### 📦 `LibraryWebAPI/` – ASP.NET Core Backend

#### 1. **Controllers**
Handles HTTP endpoints for each entity and workflow:  
- **`AuthController.cs`** – Email-based authentication (login, registration, etc.)
- **`BookAuthorController.cs`**, **`BookGenreController.cs`** – Manage book‐related lookup tables.  
- **`BookController.cs`**, **`BookCheckoutController.cs`** – CRUD for books and the checkout process.  
- **`BorrowerTypeController.cs`** – Student vs. faculty borrowing limits.  
- **`CustomerController.cs`**, **`UserProfileController.cs`** – Customer registration, profile edits, deactivation/reactivation.  
- **`DeviceTypeController.cs`**, **`TechnologyController.cs`**, **`TechonologyManufacturerController.cs`** – Tech inventory and metadata.  
- **`DonationController.cs`** – Donation submissions.  
- **`EmployeeController.cs`** – Employee account management (Admins only).  
- **`EventController.cs`**, **`EventCategoryController.cs`** – Library event CRUD.  
- **`FineController.cs`** – Overdue fine calculation and payment.  
- **`ItemController.cs`** – Generic item-level endpoints.  
- **`MovieController.cs`**, **`MovieDirectorController.cs`**, **`MovieGenreController.cs`** – Movie entity and metadata.  
- **`MusicController.cs`**, **`MusicArtistController.cs`**, **`MusicGenreController.cs`** – Music entity and metadata.  
- **`PublisherController.cs`** – Publisher lookup.  
- **`TransactionHistoryController.cs`** – View and query historical transactions.  
- **`WaitlistController.cs`** – Waitlist joining and fulfillment logic.  
- **`UpdateAvailableCopiesDTO.cs`** – DTO for availability updates.  

#### 2. **Data** 
- **`LibraryContext.cs`** – EF Core `DbContext`, defines `DbSet<>`s and relationships for all entities.

#### 3. **Models** 
- **Entity classes** (`Book.cs`, `Movie.cs`, `Music.cs`, `Technology.cs`, `User.cs`, `Event.cs`, `Fine.cs`, `Donation.cs`, etc.) define the database schema.  
- **DTOs** (in `Models/DTO/`) — e.g., `BookDTO.cs`, `CustomerLoginDto.cs`, `SearchResultDTO.cs`, `MasterTransactionReportDto.cs`, etc., shape request/responses.  

#### 4. **Properties** 
- **`launchSettings.json`** – Local launch profiles (ports, environment).

#### 5. **Repositories**
- **`ISearchRepository.cs`** – Defines search abstraction.  
- **`SearchRepository.cs`** – Implements full-text and multi-entity search.

#### 6. **Services** 
- **`BlobStorageService.cs`** – Azure Blob Storage uploads/downloads for cover images.  
- **`EmailService.cs`** / **`IEmailService.cs`** – SMTP / EmailJS wrappers for notifications.  
- **`WaitlistNotificationService.cs`** – Coordinates waitlist emails & holds.

#### 7. **Views**
*(Razor pages used for testing or in API Explorer)*  
- **`Views/Book/`**, **`Views/BookCheckout/`** – Example HTML test pages.

#### 8. **Project & Config Files**  
- **`LibraryWebAPI.csproj`** – .NET project file with NuGet references.  
- **`appsettings.json`** & **`appsettings.Development.json`** – Connection strings, secrets placeholders.  
- **`Program.cs`** – Bootstraps the web host, middleware, and services.  
- **`LibraryWebAPI.http`** – VS Code REST client file for manual API testing.  

---

### 🎨 `libraryApp/` – React + Vite Frontend citeturn10view0

#### 1. **CI/CD Workflow**
- **`.github/workflows/azure_deploy.yml`** – GitHub Actions pipeline to build and deploy API & frontend to Azure.

#### 2. **Public Assets** 
- **`public/book_covers/`**, **`device_covers/`**, **`movie_covers/`**, **`music_covers/`** – Sample images.  
- **`vite.svg`** – Vite logo for default template.

#### 3. **Config & Tooling** 
- **`.gitignore`**, **`eslint.config.js`** – Lint rules.  
- **`index.html`** – Main HTML template.  
- **`package.json`**, **`package-lock.json`** – Dependencies & scripts.  
- **`tsconfig.json`**, **`tsconfig.app.json`**, **`tsconfig.node.json`** – TypeScript settings.  
- **`vite.config.ts`** – Vite build configuration.  
- **`vercel.json`** – Frontend deployment settings.

#### 4. **`src/`** 

- **`assets/`** – Static images imported by components.  
- **`components/`**
  - **`CheckoutPage/`**, **`Return.tsx`**, **`InventoryTable.tsx`**, **`SearchBar.tsx`**, **`ReportsOutlet.tsx`**, **`LibraryHistory.tsx`**, **`UserProfile.tsx`**, **`RegistrationPage.tsx`**, **`TermsAndConditionsPage.tsx`**, **`ContactPage.tsx`**, etc. — All UI components and pages for user flows.  
  - **Shared** utilities: `SharedCard.tsx`, `Loader.tsx`, `BackToTopButton.tsx`, `Layout.tsx`, `NavBar.tsx`, `PageTransition.tsx`, `AnimatedPage.tsx`.  

- **`contexts/CheckoutContext.tsx`**
  Manages global checkout cart and user session state via React Context.

- **`types/Book.ts`** 
  Defines TypeScript interfaces for API data shapes (e.g., `Book`, `Movie`, `User`).

- **`utils/transformBookData.ts`**
  Utility to normalize API payloads into UI-friendly formats.

- **Entry Points**  
  - **`App.tsx`**, **`App.css`** – Root component and global styles.  
  - **`main.tsx`** – Mounts React into the DOM (`#root`).  
  - **`vite-env.d.ts`** – Vite environment typing.  
  - **`types.ts`** – Shared TypeScript types.

---

<a name="installation--setup"></a>
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
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "..."
dotnet user-secrets set "AzureBlobStorage:ConnectionString" "..."
dotnet user-secrets set "Smtp:Password" "..."
dotnet build
dotnet run
```

By default, the API runs at: `http://localhost:5217`

### 3. API Explorer (Swagger UI)

When running the backend locally on `http://localhost:5217`, you can access the full Swagger UI for exploring and testing the API:

👉 [Swagger UI](http://localhost:5217/swagger/index.html)

This interface provides interactive documentation for all backend endpoints, including request/response formats and status codes.


### 3. Setup the Front End

```bash
cd ../libraryApp
npm install
```

Create a `.env` file:
```env
VITE_API_BASE_URL=http://localhost:5217
VITE_PUBLIC_ASSET_BASE_URL=http://localhost:5217
VITE_EMAILJS_USER_ID=your_id
VITE_EMAILJS_SERVICE_ID=your_service
VITE_EMAILJS_TEMPLATE_ID=your_template
```

Then run the app:
```bash
npm run dev
```

Local frontend URL: `http://localhost:5173`

---
<a name="deployment"></a>
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
<a name="environment-variables"></a>
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
<a name="contributing"></a>
## 🤝 Contributing

Pull requests are welcome! For major changes, open an issue first to discuss what you’d like to change.

1. Fork the repo
2. Create a new branch
3. Make changes and commit
4. Open a pull request with a detailed explanation

---
<a name="contributors"></a>
## 🏅 Contributors

| Name                | GitHub Username                     | Role        |
|---------------------|-------------------------------------|-------------|
| Liam Le             | [@liamlecs](https://github.com/liamlecs)         | Team Lead   |
| Trevor Drummond     | [@trevrd22](https://github.com/trevrd22)         | Developer   |
| Jacqueline Sanchez  | [@jupitersnow1](https://github.com/jupitersnow1) | Developer   |
| Nhi Truong          | [@nhitruong1](https://github.com/nhitruong1)     | Developer   |
| Fernando Mancilla   | [@FerMan2001](https://github.com/FerMan2001)     | Developer   |

---
<a name="license"></a>
## 📄 License

This project is licensed for academic use only under Team 12 (University of Houston, COSC 3380). Redistribution or commercial use is not permitted.

---
<a name="contact"></a>
## 📬 Contact

**Team 12 – University of Houston**  
📧 Email: [uhelibrary5@gmail.com](mailto:uhelibrary5@gmail.com)  
👤 Maintainer: [Liam Le](https://github.com/liamlecs)

---

> Thank you for exploring the E‑Library! We hope this project serves as a strong foundation for future library systems and student-led development.
