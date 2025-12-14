# Deploying Goal Tracker API to Vercel

This guide will help you deploy your FastAPI application to Vercel.

## Prerequisites

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

## Project Structure for Vercel

The project has been configured with:
- `vercel.json` - Vercel configuration file
- `api/index.py` - Entry point for Vercel serverless function
- `.vercelignore` - Files to ignore during deployment

## Environment Variables

Before deploying, you need to set your environment variables in Vercel:

### Option 1: Using Vercel Dashboard
1. Go to your project on Vercel
2. Navigate to Settings → Environment Variables
3. Add the following variables:
   - `DATABASE_URL` - Your Supabase PostgreSQL connection string
   - `HOST` - Set to `0.0.0.0` (optional, defaults in code)
   - `PORT` - Set to `8000` (optional, defaults in code)

### Option 2: Using Vercel CLI
```bash
vercel env add DATABASE_URL
# Paste your database URL when prompted
```

Example DATABASE_URL format:
```
postgresql://user:password@host.supabase.co:5432/postgres
```

## Deployment Steps

### 1. First Time Deployment

Navigate to the server directory:
```bash
cd "/media/Main Files/pythonprojects/goal_tracker/server"
```

Deploy to Vercel:
```bash
vercel
```

Follow the prompts:
- Set up and deploy: **Yes**
- Which scope: Select your account
- Link to existing project: **No**
- Project name: `goal-tracker-api` (or your preferred name)
- Directory: `./` (current directory)
- Override settings: **No**

### 2. Production Deployment

After testing the preview deployment, deploy to production:
```bash
vercel --prod
```

## Important Notes

### Database Connection
- Make sure your Supabase PostgreSQL database allows connections from Vercel's IP addresses
- Vercel runs in serverless mode, so each request may create a new database connection
- Consider using connection pooling (like Supabase's connection pooler) for better performance

### Limitations
- Vercel serverless functions have a 10-second execution timeout on Hobby plan
- Cold starts may occur if the function hasn't been called recently
- Static files and uploads are not persistent (use external storage if needed)

### API Endpoint

After deployment, your API will be available at:
```
https://your-project-name.vercel.app
```

API Documentation:
- Swagger UI: `https://your-project-name.vercel.app/docs`
- ReDoc: `https://your-project-name.vercel.app/redoc`

## Testing the Deployment

Test your deployed API:
```bash
curl https://your-project-name.vercel.app/health
```

Expected response:
```json
{"status": "healthy"}
```

## Continuous Deployment

Vercel automatically deploys:
- **Production**: When you push to the `main` or `master` branch
- **Preview**: For every pull request and branch

To connect your GitHub repository:
1. Go to Vercel Dashboard
2. Import your GitHub repository
3. Configure the root directory as `server`
4. Add environment variables
5. Deploy

## Troubleshooting

### Database Connection Issues
If you get database connection errors:
1. Check your DATABASE_URL is correct
2. Verify Supabase allows external connections
3. Use Supabase's connection pooler URL (port 6543) instead of direct connection (port 5432)

Example pooler URL:
```
postgresql://user:password@host.supabase.co:6543/postgres
```

### Import Errors
If you get module import errors:
- Make sure all dependencies are in `requirements.txt`
- Vercel installs dependencies from this file automatically

### Function Timeout
If requests timeout:
- Optimize database queries
- Add indexes to frequently queried columns
- Consider upgrading to Vercel Pro for longer timeout limits

## Local Testing Before Deployment

Test locally to ensure everything works:
```bash
source venv/bin/activate
python run.py
```

Or use Vercel CLI to test locally:
```bash
vercel dev
```

## Useful Commands

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View deployment logs
vercel logs

# List deployments
vercel ls

# Remove deployment
vercel remove [deployment-url]
```

## Additional Configuration

### Custom Domain
To add a custom domain:
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain
3. Configure DNS settings as instructed

### CORS Configuration
CORS is already configured in `app/main.py` to allow all origins. For production, consider restricting to specific domains:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Restrict to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Support

For issues related to:
- Vercel deployment: https://vercel.com/docs
- FastAPI: https://fastapi.tiangolo.com/
- Supabase: https://supabase.com/docs
