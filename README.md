# Database & SFTP API Server

A Node.js server that provides APIs for:
- Database queries (MySQL, PostgreSQL, MongoDB)
- SFTP operations

## Setup
1. Clone the repository
2. Run `npm install`
3. Start server: `npm start`

## API Endpoints
- POST `/api/database/query` - Execute database queries
- POST `/api/sftp/list` - List SFTP directory contents 