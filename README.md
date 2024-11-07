# File Sharing Platform Backend
This is the backend server for a File Sharing Platform, providing secure file upload, sharing, and access management. This server handles API requests for file uploads, metadata storage, access control, logging, and file downloads. The backend is built with Nest.js and uses MongoDB to store metadata, with file storage.

## Features
- **User Authentication**: Secure signup, login, and JWT-based authorization.
- **File Upload & Management**: Handles file uploads and stores file metadata.
- **Access Control**: Allows users to set file access permissions and expiration dates for secure sharing.
- **Download Logs**: Tracks download activity for each file and stores logs for analytics.
- **Shareable Links**: Generates secure, password-protected links with optional expiration dates for sharing files.
- **Search and Filtering**: Enables file searching by name, type, tags, or metadata.
  
## Tech Stack
- **Backend Framework**: Nest.js
- **Database**: MongoDB (MongoDB Atlas for cloud hosting)
- **File Storage**: Microsoft azure blob storage
- **Authentication**: JWT (JSON Web Tokens)

## Getting Started
Prerequisites
Node.js (>=14.x)
Npm (>=10.x)

### Installation
- Clone the Repository
```bash
git clone https://github.com/aifia105/file-sharing-backend.git
cd file-sharing-backend
```
- Install Dependencies
```bash
npm install
```
### Configure Environment Variables

Create a .env file in the root directory and add the following variables:


```dotenv
PORT
MONGODB_URI
JWT_SECRET
FRONTEND_URL
SESSION_SECRET
```
### Run the Server
For development:

```bash
npm run start:dev
```
For production:
```bash
npm run start
```
