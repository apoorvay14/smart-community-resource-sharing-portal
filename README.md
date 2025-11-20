5# Smart Community Resource Sharing Portal (SCRSP)

A full-stack web platform enabling communities to share resources, book amenities, report issues, and collaborate efficiently.

## 🏘️ Project Overview

The Smart Community Resource Sharing Portal is a comprehensive web application designed to enhance community living through digital collaboration. Residents can share resources, book community amenities, report and track complaints, stay updated with announcements, and engage in community discussions.

## ✨ Features

### Core Functionality (8+ Features)

1. **User Registration & Login** - Secure authentication with role-based access (Admin/Resident)
2. **Resource Sharing** - Borrow and lend items within the community
3. **Amenity Booking System** - Book community facilities (Gym, Pool, Party Hall, etc.)
4. **Complaint Registration & Tracking** - Report issues and monitor resolution status
5. **Announcement Management** - Community-wide notifications and updates
6. **Community Discussion Forum** - Engage and collaborate with neighbors
7. **User Profile Management** - Manage personal information and preferences
8. **Admin Dashboard** - Comprehensive monitoring and management tools
9. **Notification System** - Real-time alerts for bookings, complaints, and announcements

### Non-Functional Requirements

- **Usability**: Simple, intuitive UI suitable for all age groups
- **Performance**: Instant booking processing and real-time updates
- **Security**: Password encryption (bcrypt), JWT authentication, role-based access control
- **Scalability**: Architecture supports multiple apartments/communities

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript, React.js
- **Backend**: Node.js (Native HTTP module)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## 📁 Project Structure

```
resource_management_fullstack/
├── server/
│   ├── controllers/       # Request handlers
│   ├── models/           # MongoDB schemas
│   ├── index.js          # Server entry point
│   ├── package.json
│   └── .env             # Environment variables
├── client/              # React application
│   ├── src/
│   ├── public/
│   └── package.json
├── public/              # Static homepage
│   ├── index.html
│   └── styles.css
└── package.json         # Root package file
```

## 📊 Database Schema

### Entities

1. **User** - name, email, password, role, flatNumber, phone, community
2. **Resource** - name, description, category, owner, status, currentBorrower, condition
3. **Amenity** - name, description, type, capacity, pricePerHour, availableHours
4. **Booking** - amenity, user, bookingDate, startTime, endTime, status, totalAmount
5. **Complaint** - title, description, category, priority, status, reportedBy, assignedTo
6. **Announcement** - title, content, type, postedBy, priority, validUntil
7. **Forum** - title, content, author, category, comments, likes
8. **Notification** - user, title, message, type, relatedId, isRead

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or connection string)
- npm or yarn

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd c:\Users\Admin\Documents\resource_management_fullstack
   ```

2. **Install all dependencies (root, server, and client)**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   
   Edit `server/.env` file:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/communityDB
   JWT_SECRET=your_secret_key_here
   NODE_ENV=development
   ```

4. **Start MongoDB**
   
   Ensure MongoDB is running on your system.

### Running the Application

#### Development Mode (Recommended)

Run both server and client concurrently:
```bash
npm run dev
```

#### Individual Services

**Server only:**
```bash
npm run server
```

**Client only:**
```bash
npm run client
```

### Access the Application

- **Homepage**: http://localhost:3000 (Static landing page)
- **React App**: http://localhost:3000 (React dev server)
- **API Server**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 📖 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user

### Resources
- `GET /api/resources` - Get all resources
- `POST /api/resources` - Create resource
- `PUT /api/resources/:id` - Update resource
- `DELETE /api/resources/:id` - Delete resource

### Amenities
- `GET /api/amenities` - Get all amenities
- `POST /api/amenities` - Create amenity

### Bookings
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create booking

### Complaints
- `GET /api/complaints` - Get all complaints
- `POST /api/complaints` - Create complaint
- `PUT /api/complaints/:id` - Update complaint

### Announcements
- `GET /api/announcements` - Get all announcements
- `POST /api/announcements` - Create announcement

### Forum
- `GET /api/forum` - Get all discussions
- `POST /api/forum` - Create discussion

### Notifications
- `GET /api/notifications` - Get all notifications

## 👥 User Stories

### Story 1: Book an Amenity
> "As a resident, I want to book the community gym for a specific time slot so that I can use it without conflicts."

**Acceptance Criteria:**
- User can view available amenities
- User can select date and time slot
- System checks availability before confirming
- User receives booking confirmation

### Story 2: Raise a Complaint
> "As a resident, I want to report a maintenance issue and track its status so that my problem gets resolved quickly."

**Acceptance Criteria:**
- User can submit complaint with title, description, and category
- User can upload images (optional)
- User can track complaint status (open, in-progress, resolved)
- Admin can assign and update complaint status

## 🎯 Scrum Roles (4-Member Team)

1. **Product Owner** - Defines requirements and prioritizes features
2. **Scrum Master** - Organizes sprints and maintains development flow
3. **Frontend Developer** - Implements React UI/UX
4. **Backend Developer** - Develops Node.js API and database

## 🔒 Security Features

- Password hashing using bcryptjs (10 rounds)
- JWT-based authentication
- Role-based access control (Admin/Resident)
- CORS enabled for cross-origin requests
- Input validation and sanitization

## 📝 License

MIT License - Feel free to use this project for learning and development.

## 🤝 Contributing

This is an educational project. Contributions, issues, and feature requests are welcome!

## 📧 Support

For questions or support, please open an issue in the project repository.

---

**Built with ❤️ for better community living**
