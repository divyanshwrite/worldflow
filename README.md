# WorldFlow - Spatial Workflow Builder in 3D

WorldFlow is a SaaS platform that enables teams to build, visualize, and interact with workflows in a shared 3D spatial environment. It addresses the limitations of linear task management tools by allowing nonlinear, spatial organization of tasks and projects.

## Features

- Create and position nodes freely in 3D space
- Link nodes to show dependencies
- Real-time multi-user collaboration
- File attachments and comments
- Version control and rollback
- Integration with third-party services

## Tech Stack

### Frontend
- Next.js
- Three.js
- TailwindCSS
- TypeScript

### Backend
- Node.js with Express
- TypeScript
- PostgreSQL
- Prisma
- Socket.io

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/worldflow.git
cd worldflow
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy example env files
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

4. Start development servers:
```bash
npm run dev
```

## Project Structure

```
worldflow/
├── frontend/          # Next.js frontend application
├── backend/           # Express backend server
└── package.json       # Root package.json for workspace management
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 