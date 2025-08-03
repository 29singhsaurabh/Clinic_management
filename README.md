# Siddheshwar Clinic Management System

A modern web-based clinic management system built with React, TypeScript, Express.js, and PostgreSQL. This system replaces the original Python Tkinter desktop application with a comprehensive web solution.

## Features

- **Patient Management**: Complete patient records with medical history, demographics, and contact information
- **Appointment Scheduling**: Time-slot based appointment system with status tracking
- **Dashboard Analytics**: Real-time statistics and clinic overview
- **User Authentication**: Secure session-based authentication system
- **Responsive Design**: Professional medical interface optimized for all devices
- **Search & Filter**: Advanced patient and appointment filtering capabilities

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, Node.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based with bcrypt
- **Build Tool**: Vite

## Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd clinic-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env file with:
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=your_secure_session_secret
```

4. Push database schema:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

6. Access the application at `http://localhost:5000`

## Default Login

- **Username**: admin
- **Password**: admin123

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
├── server/                 # Express backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database operations
│   └── db.ts              # Database connection
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema definitions
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push schema changes to database
- `npm run db:generate` - Generate database migrations

## Database Schema

The system includes the following main entities:

- **Users**: System administrators and staff
- **Patients**: Patient records with complete medical information
- **Appointments**: Scheduling system with doctor assignments
- **Medical Records**: Patient medical history and treatment records

## Deployment

### Replit Deployment

This project is optimized for Replit deployment:

1. Import the repository to Replit
2. Set up environment variables in Replit Secrets
3. The system will automatically configure and deploy

### Other Platforms

The application can be deployed to any Node.js hosting platform:

- Heroku
- Vercel
- Railway
- DigitalOcean App Platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the GitHub repository.

---

Built with ❤️ for Siddheshwar Clinic