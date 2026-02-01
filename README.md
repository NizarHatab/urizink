This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Admin authentication

The admin area (`/admin`) is protected by JWT authentication. **Login works with email or phone number** plus password.

1. **Install dependencies** (includes `jose` and `bcryptjs`):
   ```bash
   npm install
   ```

2. **Set `JWT_SECRET`** in `.env` (or `.env.local`):
   ```
   JWT_SECRET=your-secret-at-least-32-chars
   ```

3. **Create Yara as admin** (or any admin with email + optional phone):
   ```bash
   node scripts/create-admin-yara.mjs "yara@urizink.com" "YourPassword" "+961 1 234 567"
   ```
   This prints SQL: run it in your database (Neon, psql, Drizzle studio, etc.). Yara can then log in with **email** or **phone number** and that password.

4. **Log in** at `/admin/login` using **email or phone** and password. After login you are redirected to `/admin`. Use **Log out** in the sidebar to sign out.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
