# Vercel Deployment Fix

## Problem
The error `TypeError: issubclass() arg 1 must be a class` occurred because Vercel's Python runtime couldn't properly handle the FastAPI application without a proper ASGI adapter.

## Solution
We've implemented **Mangum**, an ASGI adapter that makes FastAPI compatible with AWS Lambda and Vercel's serverless environment.

## Changes Made

### 1. Updated `requirements.txt`
Added Mangum dependency:
```
mangum==0.17.0
```

### 2. Updated `api/index.py`
Changed from directly exporting the app to wrapping it with Mangum:

**Before:**
```python
from app.main import app
handler = app
```

**After:**
```python
from mangum import Mangum
from app.main import app

handler = Mangum(app, lifespan="off")
```

### 3. Updated `vercel.json`
Added maxLambdaSize configuration:
```json
{
  "config": {
    "maxLambdaSize": "15mb"
  }
}
```

## What is Mangum?

Mangum is an adapter for running ASGI applications (like FastAPI) in AWS Lambda and other serverless environments. It:
- Converts AWS Lambda events to ASGI format
- Handles request/response translation
- Manages the ASGI lifespan protocol

## Deployment Steps

1. **Commit the changes:**
   ```bash
   git add .
   git commit -m "Fix: Add Mangum adapter for Vercel deployment"
   git push
   ```

2. **Redeploy to Vercel:**
   ```bash
   vercel --prod
   ```

   Or if you have auto-deployment enabled via GitHub, just push to your repository.

3. **Verify the deployment:**
   ```bash
   curl https://your-project-name.vercel.app/
   curl https://your-project-name.vercel.app/health
   ```

   Expected responses:
   ```json
   {"message": "Welcome to Goal Tracker API"}
   {"status": "healthy"}
   ```

## Testing Endpoints

After deployment, test your API:

```bash
# Health check
curl https://your-project-name.vercel.app/health

# API Documentation
open https://your-project-name.vercel.app/docs

# Test user signup
curl -X POST "https://your-project-name.vercel.app/api/users/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123"
  }'
```

## Important Notes

### Database Connection
Make sure you've set the `DATABASE_URL` environment variable in Vercel:
```bash
vercel env add DATABASE_URL production
```

Use Supabase's **connection pooler** (port 6543) for better serverless performance:
```
postgresql://user:password@host.supabase.co:6543/postgres
```

### Cold Starts
- First request after inactivity may be slower (cold start)
- Subsequent requests will be faster
- This is normal behavior for serverless functions

### Timeouts
- Vercel Hobby plan: 10-second timeout per request
- Vercel Pro plan: 60-second timeout per request
- Optimize database queries to stay within limits

## Troubleshooting

### Still Getting Errors?

1. **Check Vercel logs:**
   ```bash
   vercel logs
   ```

2. **Verify environment variables:**
   ```bash
   vercel env ls
   ```

3. **Test locally with Vercel CLI:**
   ```bash
   vercel dev
   ```

4. **Check database connectivity:**
   - Ensure DATABASE_URL is correct
   - Verify Supabase allows external connections
   - Test connection pooler URL

### Common Issues

**Module Import Errors:**
- Clear build cache: Redeploy with `vercel --prod --force`
- Verify all dependencies are in `requirements.txt`

**Database Connection Timeout:**
- Use connection pooler (port 6543)
- Add `?connect_timeout=10` to DATABASE_URL
- Optimize queries with indexes

**Function Size Too Large:**
- Current max: 15mb (set in vercel.json)
- Remove unused dependencies
- Use lighter alternatives if needed

## Success Indicators

Your deployment is successful when:
- ✅ `/` returns: `{"message": "Welcome to Goal Tracker API"}`
- ✅ `/health` returns: `{"status": "healthy"}`
- ✅ `/docs` shows Swagger UI documentation
- ✅ API endpoints respond correctly
- ✅ Database operations work

## Additional Resources

- [Mangum Documentation](https://mangum.io/)
- [Vercel Python Runtime](https://vercel.com/docs/functions/serverless-functions/runtimes/python)
- [FastAPI Deployment Guide](https://fastapi.tiangolo.com/deployment/serverless/)
- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)

## Need Help?

If you continue to experience issues:
1. Check Vercel deployment logs
2. Verify environment variables are set correctly
3. Test database connection from Vercel's network
4. Review FastAPI and Mangum documentation
