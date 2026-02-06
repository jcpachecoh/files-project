# File System Management Application

A full-stack file system management application built with **NestJS** using **Hexagonal Architecture** (Ports and Adapters pattern).

## 🏗️ Architecture

This project implements Clean Architecture with the following layers:

- **Domain Layer**: Business entities (Folder, File) with pure business logic
- **Application Layer**: Use cases and port interfaces
- **Infrastructure Layer**: Adapters for database (TypeORM) and filesystem
- **Presentation Layer**: REST Controllers and DTOs with validation

## 🚀 Features

### Backend
- ✅ Hierarchical folder structure
- ✅ File upload/download
- ✅ Move files and folders
- ✅ Search functionality
- ✅ Validation with class-validator
- ✅ PostgreSQL database
- ✅ TypeORM with auto-synchronization
- ✅ Local file system browsing
- ✅ Swagger API documentation

### Frontend
- ✅ Modern Next.js 14 with App Router
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for styling
- ✅ React Query for data fetching and caching
- ✅ Folder tree navigation with expand/collapse
- ✅ Drag & drop file upload
- ✅ File grid display with download/delete actions
- ✅ Local file system browser
- ✅ View mode toggle (Cloud Storage / Local Files)
- ✅ Responsive design

## 📋 Prerequisites

- Node.js 20+
- Docker & Docker Compose
- pnpm

## 🛠️ Setup Instructions

### Backend Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start Database

```bash
docker-compose up -d
```

This starts:
- PostgreSQL on `localhost:5440`
- pgAdmin on `http://localhost:5050`
  - Email: `admin@admin.com`
  - Password: `admin`

### 3. Configure Environment

The `.env` file is already configured with default values:

```env
PORT=3001
DATABASE_HOST=localhost
DATABASE_PORT=5440
DATABASE_USER=fileuser
DATABASE_PASSWORD=filepass
DATABASE_NAME=filesystem
```

### 4. Start Backend Application

```bash
# Development mode with hot-reload
pnpm run start:dev

# Production mode
pnpm run build
pnpm run start:prod
```

The API will be available at: `http://localhost:3001`
Swagger documentation: `http://localhost:3001/api/docs`

### Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Frontend Dependencies

```bash
pnpm install
```

### 3. Start Frontend Development Server

```bash
pnpm run dev
```

The frontend will be available at: `http://localhost:3000`

### 4. Build for Production

```bash
pnpm run build
pnpm run start
```

## 🖥️ Running the Full Stack

To run both backend and frontend together:

1. **Terminal 1 - Backend:**
   ```bash
   docker-compose up -d  # Start database
   pnpm run start:dev    # Start backend on port 3001
   ```

2. **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   pnpm run dev          # Start frontend on port 3000
   ```

3. **Access the application:**
   - Frontend UI: `http://localhost:3000`
   - Backend API: `http://localhost:3001`
   - API Docs: `http://localhost:3001/api/docs`
   - pgAdmin: `http://localhost:5050`

## 📚 API Endpoints

### Folder Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/folders` | Create a new folder |
| `GET` | `/api/folders` | List folders (with query params) |
| `PUT` | `/api/folders/:id` | Update folder name |
| `PUT` | `/api/folders/:id/move` | Move folder to another parent |
| `DELETE` | `/api/folders/:id` | Delete folder |

### File Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/files/upload` | Upload a file (multipart/form-data) |
| `GET` | `/api/files` | List files (with query params) |
| `GET` | `/api/files/:id/download` | Download a file |
| `PUT` | `/api/files/:id` | Update file name |
| `PUT` | `/api/files/:id/move` | Move file to another folder |
| `DELETE` | `/api/files/:id` | Delete file |

### Local File System Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/local/files?path=<path>` | List files and folders at specified path |
| `GET` | `/api/local/download?path=<path>` | Download a file from local filesystem |

Full API documentation available at: `http://localhost:3001/api/docs`

## 🧪 Testing API Examples

### Create a Folder

```bash
curl -X POST http://localhost:3001/api/folders \
  -H "Content-Type: application/json" \
  -d '{"name": "My Documents"}'
```

### Upload a File

```bash
curl -X POST http://localhost:3001/api/files/upload \
  -F "file=@/path/to/your/file.pdf" \
  -F "name=document.pdf"
```

### List Folders

```bash
curl http://localhost:3001/api/folders
```

### List Files

```bash
curl http://localhost:3001/api/files
```

## 🗂️ Project Structure

### Backend Structure

```
src/
├── domain/                      # Business logic layer
│   ├── entities/               # Domain entities
│   │   ├── folder.entity.ts
│   │   └── file.entity.ts
│   └── exceptions/             # Domain exceptions
│
├── application/                # Application logic layer
│   ├── ports/                  # Port interfaces
│   │   ├── filesystem-repository.port.ts
│   │   └── filesystem.port.ts
│   └── use-cases/              # Business use cases
│       ├── folder/
│       └── file/
│
├── infrastructure/             # Infrastructure layer
│   ├── adapters/
│   │   ├── persistence/        # Database adapter
│   │   └── filesystem/         # File system adapter
│   └── config/                 # Configuration
│
├── presentation/               # Presentation layer
│   ├── controllers/            # REST controllers
│   │   ├── folder.controller.ts
│   │   ├── file.controller.ts
│   │   └── local-files.controller.ts
│   └── dtos/                   # Data transfer objects
│       ├── folder/
│       └── file/
│
├── app.module.ts              # Main application module
└── main.ts                    # Application entry point
```

### Frontend Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout with providers
│   │   ├── page.tsx           # Main page with view mode toggle
│   │   └── globals.css        # Global styles
│   │
│   ├── components/            # React components
│   │   ├── folder-tree/       # Folder navigation tree
│   │   │   └── FolderTree.tsx
│   │   ├── file-upload/       # File upload with drag & drop
│   │   │   └── FileUpload.tsx
│   │   ├── file-list/         # File grid display
│   │   │   └── FileList.tsx
│   │   └── local-browser/     # Local filesystem browser
│   │       └── LocalBrowser.tsx
│   │
│   └── lib/                   # Utilities and API clients
│       └── api/               # API integration layer
│           ├── client.ts      # Axios client configuration
│           ├── folders.ts     # Folders API
│           ├── files.ts       # Files API
│           └── local-files.ts # Local filesystem API
│
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

## 🎨 Frontend Features

### Cloud Storage Mode
- **Folder Tree Navigation**: Browse and manage hierarchical folder structure
- **File Upload**: Drag & drop or click to upload files to selected folder
- **File Management**: View, download, and delete files in grid layout
- **Folder Operations**: Create, rename, and delete folders

### Local Files Mode
- **Path Navigation**: Enter any local filesystem path to browse
- **Home Directory**: Quick access to user's home directory
- **Parent Directory**: Navigate up the directory tree
- **Folder Navigation**: Click folders to navigate into them
- **File Download**: Download files from local filesystem

### UI/UX Features
- **Responsive Design**: Works on desktop and mobile devices
- **Loading States**: Visual feedback during data fetching
- **Error Handling**: User-friendly error messages
- **Type Safety**: Full TypeScript integration
- **Optimistic Updates**: React Query for efficient data management

## Run tests

### Backend Tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

### Frontend Tests

```bash
cd frontend

# Run tests (when implemented)
$ pnpm run test
```

## 🛠️ Technology Stack

### Backend
- **Framework**: NestJS 11.0.1
- **Language**: TypeScript 5.7.2
- **Database**: PostgreSQL 15
- **ORM**: TypeORM 0.3.28
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Architecture**: Hexagonal (Ports and Adapters)

### Frontend
- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **State Management**: React Query 5.90.20
- **HTTP Client**: Axios 1.13.4
- **File Upload**: react-dropzone 14.4.0
- **Icons**: lucide-react 0.563.0
- **UI Library**: React 19.2.3

### Infrastructure
- **Database**: PostgreSQL 15 (Docker)
- **Database Admin**: pgAdmin 4 (Docker)
- **Package Manager**: pnpm
- **Container**: Docker Compose

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
