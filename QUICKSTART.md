# Quick Start Guide

This guide will help you get the File System Management application running in just a few minutes.

## Prerequisites

Make sure you have the following installed:
- Node.js 20+ ([Download](https://nodejs.org/))
- pnpm 10+ (install via `npm install -g pnpm`)
- Docker Desktop ([Download](https://www.docker.com/products/docker-desktop/))

## Installation Steps

### 1. Clone or Navigate to Project

```bash
cd /Users/juancarlos/projects/files-project
```

### 2. Start the Backend

```bash
# Navigate to backend
cd backend

# Install dependencies (if not already done)
pnpm install

# Start PostgreSQL database
docker-compose up -d

# Wait a few seconds for the database to be ready, then start the backend
pnpm start:dev
```

The backend will start on **http://localhost:3001**

API Documentation: **http://localhost:3001/api/docs**

### 3. Start the Frontend (in a new terminal)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already done)
pnpm install

# Start the development server
pnpm dev
```

The frontend will start on **http://localhost:3000**

## Access the Application

1. Open your browser and go to: **http://localhost:3000**
2. You should see the File System Management interface
3. Try these actions:
   - Click the **+** icon next to "Folders" to create a new folder
   - Drag and drop files into the upload area
   - Click on folders in the sidebar to view their contents
   - Right-click on files to download, rename, or delete them

## Verify Everything is Working

### Check Backend

```bash
# Test folder API
curl http://localhost:3001/api/folders

# View Swagger documentation
# Open http://localhost:3001/api/docs in your browser
```

### Check Frontend

Open **http://localhost:3000** in your browser. You should see:
- A folder tree on the left sidebar
- A file upload area in the main content
- A file list below the upload area

### Check Database

Access pgAdmin:
1. Open **http://localhost:5050** in your browser
2. Login with:
   - Email: `admin@admin.com`
   - Password: `admin`
3. Connect to the PostgreSQL server:
   - Host: `postgres` (or `localhost` if accessing from host)
   - Port: `5440`
   - Username: `fileuser`
   - Password: `filepass`

## Troubleshooting

### Backend won't start

**Problem**: Port 3001 is already in use
```bash
# Find and kill the process
lsof -ti:3001 | xargs kill -9
```

**Problem**: Database connection error
```bash
# Restart the database
docker-compose restart postgres

# Check database logs
docker-compose logs postgres
```

### Frontend won't start

**Problem**: Port 3000 is already in use
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9
```

**Problem**: Module not found errors
```bash
# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Database Issues

**Problem**: Can't connect to PostgreSQL
```bash
# Check if container is running
docker-compose ps

# Restart containers
docker-compose down
docker-compose up -d

# View logs
docker-compose logs -f postgres
```

## Testing the Application

### Create a Folder

1. Click the **+** icon in the sidebar next to "Folders"
2. Type a folder name (e.g., "Documents")
3. Press Enter or click "Add"

### Upload a File

1. Select a folder from the sidebar (or use "All Files")
2. Drag a file onto the upload area, or click to browse
3. Wait for the upload to complete
4. The file should appear in the file list

### Download a File

1. Find a file in the file list
2. Click the three dots menu icon
3. Select "Download"
4. The file will download to your browser's download folder

### Rename a File

1. Click the three dots menu on a file
2. Select "Rename"
3. Type the new name
4. Click "Save"

### Delete a File

1. Click the three dots menu on a file
2. Select "Delete"
3. Confirm the deletion

## Next Steps

- Explore the API documentation at http://localhost:3001/api/docs
- Check out the [Development Plan](docs/development_plan.md) for architecture details
- Review the [Backend README](README.md) for more configuration options
- Review the [Frontend README](frontend/README.md) for component details

## Stopping the Application

### Stop Backend
Press `Ctrl+C` in the terminal running the backend

### Stop Frontend
Press `Ctrl+C` in the terminal running the frontend

### Stop Database
```bash
cd backend
docker-compose down
```

## Environment Variables

### Backend (.env)
Already configured in your project at `backend/.env`

### Frontend (.env.local)
Already configured in your project at `frontend/.env.local`

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the terminal output for error messages
3. Check the browser console for frontend errors (F12)
4. Ensure all prerequisites are properly installed

Happy coding! 🚀
