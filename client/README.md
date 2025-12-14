# Goal Tracker Frontend

A beautiful and professional Next.js frontend for the Goal Tracker application.

## Features

- 🎯 **Goal Management** - Create, track, and manage your goals
- 📚 **Resource Tracking** - Add learning resources (books, courses, videos)
- ✅ **Topic Progress** - Track completion of individual topics/chapters
- 📊 **Dashboard Analytics** - Visual progress tracking with charts
- 🎨 **Beautiful UI** - Built with shadcn/ui and Tailwind CSS
- 📱 **Responsive Design** - Works perfectly on all devices
- 🌙 **Dark Mode** - Full dark mode support

## Tech Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **date-fns** - Date utilities

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend server running (see `../server/README.md`)

### Installation

1. Install dependencies:
```bash
npm install
```

2. The `.env.local` file is already created with:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

3. Run the development server:


```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Pages

- `/` - Home (redirects to dashboard or login)
- `/login` - User login
- `/signup` - User registration
- `/dashboard` - Main dashboard with analytics and charts
- `/goals` - List of all goals
- `/goals/[goal_id]` - Individual goal details with resources
- `/resources` - List of all resources across all goals
- `/resources/[resource_id]` - Resource details with topic tracking

## API Integration

The app connects to the backend APIs through the `lib/api.ts` utility:

- **User API** - Authentication and profile management
- **Goal API** - CRUD operations for goals
- **Resource API** - CRUD operations for resources
- **Topic API** - CRUD operations for topics, including bulk creation

## Features in Detail

### Dashboard
- Visual charts showing last 7 days progress
- Quick stats: total goals, points, completion percentage
- Goal overview with progress bars
- Today's completion tracking

### Goals Management
- Create goals with target values and dates
- Track multiple resources per goal
- Visual progress indicators
- Domain categorization

### Resources
- Support for various resource types (Books, Courses, Videos, etc.)
- Track time per unit and value per unit
- Add external links to resources
- Notes and descriptions

### Topics
- Individual topic tracking within resources
- Point multiplier system for weighted progress
- Bulk topic creation
- Complete/skip functionality
- Completion date tracking

## Authentication

The app uses a simple localStorage-based authentication:
- User data is stored in `localStorage` after login
- Automatic redirect to login if not authenticated
- User info displayed in navbar

## Build & Deploy

### Build for production:
```bash
npm run build
```

### Start production server:
```bash
npm start
```

### Deploy to Vercel:
The easiest way to deploy is using [Vercel](https://vercel.com):
1. Push your code to GitHub
2. Import the project in Vercel
3. Set the environment variable `NEXT_PUBLIC_API_URL` to your production backend URL
4. Deploy!

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API base URL (required)

## Project Structure

```
client/
├── app/                      # Next.js app directory
│   ├── dashboard/           # Dashboard page
│   ├── login/               # Login page
│   ├── signup/              # Signup page
│   ├── goals/               # Goals pages
│   ├── resources/           # Resources pages
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/              # React components
│   ├── ui/                 # shadcn/ui components
│   └── navbar.tsx          # Navigation component
├── lib/                     # Utilities
│   ├── api.ts              # API client
│   ├── auth.ts             # Authentication utilities
│   └── utils.ts            # Helper functions
└── types/                   # TypeScript types
    └── index.ts            # Type definitions
```

## License

MIT

