# Deploy Weather Travel Assistant

This monorepo has a Vite React frontend in `frontend/` and an ASP.NET Core 9 API in `backend/WeatherTravelAssistant.Api/`.

## 1. Railway API

1. Create a Railway project, choose **New Service > GitHub Repo**, and select `sindhoora-17/weather-travel-assistant`.
2. Once this PR is merged, set its deployment branch to `main`. Configure **Root Directory** as `/backend/WeatherTravelAssistant.Api`. Railway detects its Dockerfile automatically.
3. In the API service Variables, enter:
   - `OpenWeather__ApiKey` = your secret OpenWeather API key
   - `FrontendOrigin` = the final `https://YOUR-PROJECT.vercel.app` origin, no path or trailing slash
   - `EnableSharedHistory` = `false` for the public demo (default)
4. Generate a public domain in **Settings > Networking**. The API health check is `https://YOUR-API.up.railway.app/health`.
5. Railway injects `PORT` automatically; the API binds to `0.0.0.0`.

**Important:** Do not paste OpenWeather keys or database credentials in GitHub, Vercel variables, or browser code. Do not expose the database publicly.

### Optional MySQL (private development/testing)

You can add a Railway **MySQL** service to the project. To connect the API, create reference variables in the API's Variables tab (replace `MySQL` with your actual Railway service name):

- `MYSQLHOST=${{MySQL.MYSQLHOST}}`
- `MYSQLPORT=${{MySQL.MYSQLPORT}}`
- `MYSQLDATABASE=${{MySQL.MYSQLDATABASE}}`
- `MYSQLUSER=${{MySQL.MYSQLUSER}}`
- `MYSQLPASSWORD=${{MySQL.MYSQLPASSWORD}}`

Alternatively set `ConnectionStrings__DefaultConnection` to an ADO.NET-style MySQL connection string. The backend uses Pomelo + EF Core.

For a **private** environment only, set `EnableSharedHistory=true` and `ApplyMigrations=true` to apply migrations on startup. Turn `ApplyMigrations` off again after initial setup. Never enable shared history publicly without per-user authentication and authorization: the current history APIs have no user scoping.

Public deployment does not require MySQL while `EnableSharedHistory=false`; this is intentional so it can be a safe public weather demo.

## 2. Vercel frontend

1. Import the GitHub repository in Vercel and choose **Root Directory** `frontend`.
2. Framework preset: **Vite**. Build: `npm run build`. Output: `dist`.
3. Add **Environment Variables** for Production:
   - `VITE_BACKEND_URL=https://YOUR-API.up.railway.app` (no trailing slash)
   - `VITE_ENABLE_HISTORY=false`
4. Deploy. The `frontend/vercel.json` rewrite makes direct navigation to `/about` work.
5. Copy the deployed origin to Railway's `FrontendOrigin` variable and redeploy the API if necessary.

Vite `VITE_` variables are compiled into the public JavaScript. Never put secrets in them. If the backend domain changes, update the Vercel variable and redeploy.

## 3. Smoke tests

- Visit `/health` on Railway: HTTP 200 with `{"status":"ok"}`.
- On Vercel, search Chicago and New York, rapidly changing locations to check stale-response cancellation.
- Test current-location weather in a browser with location permission enabled.
- Refresh the `/about` page directly; it should render.
- Confirm History is not shown on public demo and `/api/WeatherSearches` returns HTTP 403.
- Inspect browser developer tools for errors and CORS issues. Confirm OpenWeather API key never appears in responses or frontend JS.
- Check GitHub Actions frontend and backend jobs are green.

## Important limitations

- Public history is disabled until login and per-user data scoping are implemented.
- The weather API is public and its OpenWeather calls may consume request quotas. Consider backend rate limits and caching before broad traffic.
- Production deployment to either platform requires connecting your own accounts and configuring keys in their dashboards.
