# CollectiveCore

## Overview

**CollectiveCore** is a full-stack application built with a .NET Core Web API backend and a modern React + TypeScript frontend. It provides 
a clean foundation for managing users and their book collections, with a focus on simplicity, maintainability, and real-world development practices.

## Features

- Manage Users/Books: Create, Read, Update, Delete (CRUD) operations
- User-specific (many to many) book relationships: mark books as favorites, track reading progress, etc.
- React frontend for browsing and managing book collections with clean API endpoint integration
- Book verification system: only verified books are trusted; unverified books remain editable by their creator (coming soon!)
- Flexible book search and filtering by genre, author, and more (coming soon!)

---

## Tech Stack

- **.NET Core**  
- **Entity Framework Core** (Code-First + Migrations)  
- **SQL Server / LocalDB** (configurable in `appsettings.json`)

- **React, TypeScript, Vite, Axios**

- **Git & GitHub** for version control and collaboration  

---

## Getting Started

### Backend

- Open the `.NET` project in Visual Studio  
- Press `Ctrl + F5` to run the Web API using Kestrel (`https://localhost:7091` by default)

### Frontend

- Navigate to the React project folder:  
  `cd CollectiveCore.Web/React/`  
- Install dependencies:  
  `npm install`  
- Start the dev server:  
  `npm run dev` 

The app is configured to run at `http://localhost:5173`. This is required to match the CORS settings in the backend API
