
# Advance Washing - Laundry Service Management App

A comprehensive web application for managing laundry services with customer booking, order tracking, and admin management capabilities.

## 🚀 Live Demo

**URL**: https://lovable.dev/projects/15afaa9a-7ebd-4807-ad5a-d06015c9bd36

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Authentication & Authorization](#authentication--authorization)
- [User Flows](#user-flows)
- [Admin Features](#admin-features)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🔍 Overview

Advance Washing is a modern, responsive web application that streamlines laundry service management. It provides an intuitive interface for customers to book services, track orders, and manage their profiles, while offering comprehensive admin tools for service management and order processing.

### Key Capabilities

- **Customer Management**: User registration, profile management, and address handling
- **Service Booking**: Interactive service selection with weight estimation and pricing
- **Order Tracking**: Real-time order status updates from pickup to delivery
- **Admin Dashboard**: Comprehensive order management and service administration
- **Mobile-First Design**: Responsive design optimized for mobile devices
- **Secure Authentication**: Role-based access control with Supabase Auth

## ✨ Features

### Customer Features
- 🔐 **Secure Authentication** - Email/password login with profile management
- 📍 **Address Management** - Multiple address support with location services
- 🛍️ **Service Selection** - Interactive service catalog with pricing
- 📅 **Pickup Scheduling** - Flexible pickup time selection
- 📦 **Order Tracking** - Real-time status updates and order history
- 💰 **Pricing Transparency** - Clear pricing with weight-based calculations
- 📱 **Mobile Optimized** - PWA-ready responsive design

### Admin Features
- 👥 **User Management** - View and manage customer accounts
- 🛠️ **Service Management** - Add, edit, and manage service offerings
- 📋 **Order Processing** - Update order status and manage workflow
- 📊 **Analytics Dashboard** - Order statistics and business insights
- 🔍 **Advanced Filtering** - Filter orders by status, date, and customer
- 📝 **Admin Logging** - Track admin actions for audit purposes

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development with strict typing
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible UI components
- **React Router DOM** - Client-side routing and navigation
- **React Hook Form** - Performant form handling with validation
- **Zod** - Schema validation for type safety

### Backend & Database
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **Row Level Security** - Database-level security policies
- **Real-time Subscriptions** - Live data updates
- **Edge Functions** - Serverless backend logic

### State Management & Data Fetching
- **TanStack Query** - Server state management and caching
- **React Context** - Global state for authentication
- **Custom Hooks** - Reusable data fetching logic

### UI/UX Libraries
- **Lucide React** - Beautiful, customizable icons
- **Recharts** - Responsive chart library
- **React Day Picker** - Date selection components
- **Sonner** - Toast notifications

### Mobile & PWA
- **Capacitor** - Native mobile app capabilities
- **PWA Support** - Offline functionality and app-like experience
- **Responsive Design** - Mobile-first approach

### Development Tools
- **ESLint** - Code linting and quality
- **PostCSS** - CSS processing
- **TypeScript** - Static type checking

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account for backend services

### Installation

1. **Clone the repository**
```bash
git clone <YOUR_GIT_URL>
cd advance-washing
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Supabase**
   - Create a new Supabase project
   - Apply the database schema from `docs/DATABASE.md`
   - Configure RLS policies from `src/integrations/supabase/RLS-SETUP-GUIDE.md`

4. **Configure environment**
   - Update Supabase credentials in `src/integrations/supabase/client.ts`

5. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── address/        # Address management components
│   └── ...             # Feature-specific components
├── hooks/              # Custom React hooks
│   ├── useAuth.tsx     # Authentication logic
│   ├── useOrders.ts    # Order management
│   └── ...             # Feature-specific hooks
├── pages/              # Page components
├── integrations/       # External service integrations
│   └── supabase/       # Supabase configuration and types
├── lib/                # Utility functions
├── types/              # TypeScript type definitions
└── utils/              # Helper functions

docs/                   # Documentation files
├── DATABASE.md         # Database schema documentation
├── USER_FLOWS.md       # User journey documentation
├── ADMIN_GUIDE.md      # Admin functionality guide
└── CODE_REVIEW.md      # Code review guidelines
```

## 🗄️ Database Schema

The application uses a PostgreSQL database with 7 main tables:

- **profiles** - User account information and roles
- **addresses** - Customer delivery addresses
- **services** - Available laundry services
- **bookings** - Pickup scheduling information
- **orders** - Order management and tracking
- **order_items** - Individual items within orders
- **admin_logs** - Admin action tracking

For detailed schema documentation, see [DATABASE.md](docs/DATABASE.md)

## 🔐 Authentication & Authorization

### Authentication Flow
1. Users register/login via Supabase Auth
2. Profile creation with role assignment (user/admin)
3. JWT-based session management
4. Role-based route protection

### Security Features
- Row Level Security (RLS) policies
- Role-based access control
- Secure password handling
- Session management
- API endpoint protection

## 📱 User Flows

### Customer Journey
1. **Registration/Login** → Profile creation
2. **Service Selection** → Browse and select services
3. **Address Management** → Add/select delivery address
4. **Pickup Scheduling** → Choose date and time
5. **Order Confirmation** → Review and confirm order
6. **Order Tracking** → Monitor status updates
7. **Delivery** → Receive completed order

### Admin Workflow
1. **Admin Login** → Access admin dashboard
2. **Order Management** → View and process orders
3. **Service Management** → Manage service catalog
4. **User Management** → Handle customer accounts
5. **Analytics** → Review business metrics

For detailed user flow documentation, see [USER_FLOWS.md](docs/USER_FLOWS.md)

## 👑 Admin Features

### Order Management
- View all orders with filtering capabilities
- Update order status through workflow stages
- Manage order items and pricing
- Track order history and analytics

### Service Management
- Add/edit/delete services
- Set pricing and availability
- Manage service categories
- Upload service images

### User Management
- View customer profiles
- Manage user roles and permissions
- Handle customer support issues
- Track user activity

For comprehensive admin documentation, see [ADMIN_GUIDE.md](docs/ADMIN_GUIDE.md)

## 📚 API Documentation

### Authentication Endpoints
- `POST /auth/signup` - User registration
- `POST /auth/signin` - User login
- `POST /auth/signout` - User logout

### Customer Endpoints
- `GET /profiles` - Get user profile
- `PUT /profiles` - Update profile
- `GET /addresses` - Get user addresses
- `POST /addresses` - Create new address
- `GET /services` - Get available services
- `POST /bookings` - Create pickup booking
- `GET /orders` - Get user orders
- `POST /orders` - Create new order

### Admin Endpoints
- `GET /admin/orders` - Get all orders
- `PUT /admin/orders/:id` - Update order status
- `GET /admin/users` - Get all users
- `POST /admin/services` - Create service
- `PUT /admin/services/:id` - Update service

## 🚀 Deployment

### Lovable Platform
1. Click "Publish" in the Lovable editor
2. Your app will be deployed to `yourapp.lovable.app`

### Custom Domain
1. Navigate to Project > Settings > Domains
2. Connect your custom domain
3. Configure DNS settings

### Self-Hosting
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting provider
3. Configure environment variables
4. Set up Supabase connection

## 🤝 Contributing

### Development Guidelines
1. Follow the code style defined in `.eslintrc`
2. Use TypeScript for all new components
3. Write tests for critical functionality
4. Follow the component structure patterns
5. Update documentation for new features

### Code Review Process
See [CODE_REVIEW.md](docs/CODE_REVIEW.md) for detailed guidelines

### Submitting Changes
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request
5. Ensure all checks pass

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

- **Documentation**: Check the `docs/` folder for detailed guides
- **Issues**: Create an issue in the repository
- **Discord**: Join the [Lovable Discord community](https://discord.com/channels/1119885301872070706/1280461670979993613)

## 🔄 Version History

- **v1.0.0** - Initial release with core functionality
- **v1.1.0** - Added admin dashboard and order management
- **v1.2.0** - Implemented RLS policies and security improvements
- **v1.3.0** - Mobile optimization and PWA support

---

Built with ❤️ using [Lovable](https://lovable.dev)
