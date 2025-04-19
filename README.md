# 📚 E‑Library @ UH

Welcome to the official GitHub repository for **E‑Library**, a full-stack web application built by **Team 12** for the University of Houston’s COSC 3380: Database Systems course.

![image](https://github.com/user-attachments/assets/4be6ffcc-3e73-4888-a579-91963320fb09)

---

## 📖 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Folder Structure](#folder-structure)
5. [Installation & Setup](#installation--setup)
6. [Deployment](#deployment)
7. [Environment Variables](#environment-variables)
8. [Contributing](#contributing)
9. [Contributors](#contributors)
10. [License](#license)
11. [Contact](#contact)

---
<a name="overview"></a>
## 🔍 Overview

**E‑Library @ UH** is a dynamic digital library platform designed to simplify library management for both **users** (students, faculty) and **employees** (librarians, admins). It supports the borrowing, reserving, and tracking of library assets like books, movies, music, and technology.

**Live Website**: [https://e-libraryuh.vercel.app](https://e-libraryuh.vercel.app)

![image](https://github.com/user-attachments/assets/04a458b0-b2ec-4008-9cc9-93ec261ab5b5)

---
<a name="features"></a>
## 🚀 Features

- **Inventory Management**  
  Add, update, deactivate, and manage cover images for items like books, movies, music, and technology using Azure Blob Storage.

  ![image](https://github.com/user-attachments/assets/a52adfd6-302c-4d05-a365-d8e14a3be8db)
  ![image](https://github.com/user-attachments/assets/86b4eade-fec6-4ebc-a502-81d0d27527a2)
  ![image](https://github.com/user-attachments/assets/071d2dfd-e3ae-425a-918f-667948d0354d)
  ![image](https://github.com/user-attachments/assets/6b0fb2d1-1ff9-4cad-9524-bec577143fdd)


- **Role-Based Access Control**  
  Different interfaces and privileges for Customers, Employees, and Admins, with automatic classification based on UH email type (`@uh.edu` vs `@cougarnet.uh.edu`).
  ![image](https://github.com/user-attachments/assets/73899cce-7f04-4d3a-8994-eaac4ac013fe)
  ![image](https://github.com/user-attachments/assets/d36e20b7-6333-41ed-8e98-e8ed374e472b)
  ![image](https://github.com/user-attachments/assets/5ca7f736-b7b2-4b98-8416-f30b68d0839f)
  ![image](https://github.com/user-attachments/assets/e6133c60-1cf1-405c-a912-1f31fcf5f2cf)
  ![image](https://github.com/user-attachments/assets/bbfbe8d1-dfc8-4dda-9c3c-3ac988b763ac)
  ![image](https://github.com/user-attachments/assets/88e8b02d-44a4-4b95-b57e-9b2831927a98)
  ![image](https://github.com/user-attachments/assets/660a5b92-980e-4a41-bf79-e1a3a60f34dc)


- **Search & Waitlists**  
  Users can search across categories and join waitlists for unavailable items. Waitlist fulfillment is automated with email alerts and timed holds.
  ![image](https://github.com/user-attachments/assets/7008abcc-0dd6-4682-a8e1-92d4872ff73e)
  ![image](https://github.com/user-attachments/assets/fe56f1ad-1531-4995-83c1-bfba89f015ac)
  ![image](https://github.com/user-attachments/assets/6d231591-e398-45ae-bd56-c8332b304b0f)


- **Email Notifications**  
  EmailJS and SMTP integration for waitlist alerts, confirmations, and other key user interactions.
  ![image](https://github.com/user-attachments/assets/a523780a-4fbd-48cc-9850-d18fa5beb5fd)


- **Fines System**  
  Automatic fine generation for overdue items, tracked in a centralized report. Users are restricted from borrowing with unpaid fines.
  ![image](https://github.com/user-attachments/assets/794c94af-fd43-403f-a334-e56fce544f77)
  ![image](https://github.com/user-attachments/assets/22027434-8116-4ed1-b700-db1ecf0b2e8f)
  ![image](https://github.com/user-attachments/assets/67931c55-e3a3-4661-b10d-f0bf9029c3ea)


- **Donations**  
  Customers can contribute to the library directly through the platform. Donations are tracked and visible to employees.
  ![image](https://github.com/user-attachments/assets/16452514-b368-4266-9adc-6eda03dd6c31)

- **Analytics & Reports**  
  Real-time data reports and filtering for inventory status, transaction history, fines, waitlists, and user activity.
  ![image](https://github.com/user-attachments/assets/fd63c9da-3076-4495-aa7a-9b7986c11423)
  ![image](https://github.com/user-attachments/assets/190db85a-44b0-48bb-8b16-d00d8ba2ee34)
  ![image](https://github.com/user-attachments/assets/38a30270-19f3-429d-81c7-67ec94a28b29)
  ![image](https://github.com/user-attachments/assets/3ee1778d-8def-417a-a48c-b039f34896d6)
  ![image](https://github.com/user-attachments/assets/2916b3eb-8947-42f5-9acc-1c78d92ff51c)

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
- **`Database-Project-CS3380-T12.sln`**, **`.gitignore`**, **`README.md`**, **`package.json`**, **`package-lock.json`** 

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

### 🎨 `libraryApp/` – React + Vite Frontend 

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

![image](https://github.com/user-attachments/assets/e0e23d0a-7c78-4b65-8b3a-32753bf067bd)


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
