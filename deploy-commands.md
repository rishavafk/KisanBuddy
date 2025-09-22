# Vercel Deployment Commands

## 1. Login to Vercel
```bash
vercel login
```
Follow the browser authentication process.

## 2. Deploy to Preview
```bash
vercel
```
This creates a preview deployment for testing.

## 3. Deploy to Production
```bash
vercel --prod
```
This deploys to your production domain.

## 4. Set Environment Variables
```bash
vercel env add SESSION_SECRET
```
Enter a secure random string when prompted (e.g., generated with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)

## 5. Redeploy with Environment Variables
```bash
vercel --prod
```
Redeploy after adding environment variables.

## Environment Variables Needed:
- `SESSION_SECRET`: A secure random string for JWT signing (required)

## Example SESSION_SECRET Generation:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Verification:
After deployment, your app will be available at:
- **Preview**: `https://your-project-name-git-main-username.vercel.app`
- **Production**: `https://your-project-name.vercel.app`

Test these endpoints:
- `/` - Landing page
- `/login` - Login/signup page
- `/dashboard` - Dashboard (after login)
- `/api/auth/login` - API endpoint

## Troubleshooting:
- If build fails, check the build logs in Vercel dashboard
- Ensure all dependencies are in package.json
- Check that API routes are working by testing `/api/auth/me`

