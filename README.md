# Blogify - Modern Blog Platform

A modern, responsive blog platform built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- 📝 Rich text editor for blog posts
- 👤 User authentication and authorization
- 🎨 Responsive design with dark mode support
- 🔍 Search functionality
- 📱 Mobile-friendly interface
- ⚡ Fast performance with Next.js

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, Shadcn/ui
- **Form Handling**: React Hook Form
- **State Management**: React Context
- **Type Safety**: TypeScript
- **Icons**: Lucide Icons

## 📂 Project Structure

```
blogify/
├── src/
│   ├── app/                 # App router pages and layouts
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Shadcn/ui components
│   │   └── blog/           # Blog-specific components
│   ├── lib/                # Utility functions and configurations
│   ├── styles/             # Global styles and CSS modules
│   ├── types/              # TypeScript type definitions
│   ├── hooks/              # Custom React hooks
│   └── utils/              # Utility functions
├── public/                 # Static assets
└── tests/                  # Test files
```

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/blogify.git
   cd blogify
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory and add your environment variables:
   ```env
   NEXT_PUBLIC_API_URL=your_api_url_here
   # Add other environment variables as needed
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🧪 Running Tests

```bash
npm test
# or
yarn test
# or
pnpm test
```

## 🚀 Deployment

You can deploy this application to Vercel, Netlify, or any other static hosting service that supports Next.js.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/)
- [Shadcn/ui](https://ui.shadcn.com/)