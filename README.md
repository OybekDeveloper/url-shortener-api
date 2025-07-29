# Secure URL Shortener API

This is a secure URL shortener API built with Node.js, Express, TypeScript, and MongoDB.  
It allows users to register, log in, and generate short URLs with optional expiration.

## Features

- User authentication with JWT
- Create short URLs with or without custom expiration time
- URL expiration handling
- Track number of visits
- Token refreshing and logout support
- Basic HTML form for testing

## Technologies

- Node.js
- Express
- MongoDB & Mongoose
- TypeScript
- JWT (jsonwebtoken)
- bcrypt
- nanoid

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/url-shortener-api.git
cd url-shortener-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory with the following:

```
PORT=8080
MONGODB_URI=mongodb://localhost:27017/url_shortener
JWT_SECRET=your_secure_jwt_secret
```

You can generate a secret with:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Run the development server

```bash
npm run dev
```

Server will start on http://localhost:8080

## API Endpoints

### Auth

- POST /api/auth/register

```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

- POST /api/auth/login

```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

Returns accessToken and refreshToken.

- POST /api/auth/refresh-token

```json
{
  "refreshToken": "<your-refresh-token>"
}
```

- POST /api/auth/logout

```json
{
  "refreshToken": "<your-refresh-token>"
}
```

### URL Shortening

All routes below require Authorization: Bearer <accessToken> header.

- POST /api/url

```json
{
  "originalUrl": "https://example.com",
  "expiresAt": "2025-08-01T12:00:00.000Z" // optional
}
```

- GET /:shortCode  
Redirects to the original URL if valid and not expired.

- GET /stats/:shortCode  
Returns stats like number of visits, creation date, expiration time.

## HTML Form (optional)

You can access the test form at:

```
http://localhost:8080/form
```

There you can submit originalUrl and optional expiresAt using a basic interface.

Note: You must manually add your access token in the form's JavaScript for authenticated requests.

## Folder Structure

```
src/
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
├── index.ts
views/
├── index.html
├── 404.html
├── expired.html
.env
```

## License

This project is open-source and free to use for educational and personal use.