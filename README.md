# MedsygnWebApp - Next.js Frontend

This is the first frontend-migration stage for the existing MedsygnWebApp ASP.NET MVC 5 application.

## Scope

- Existing ASP.NET MVC 5 controllers remain unchanged.
- Existing DAL / Services / DTO / SQL Server remain unchanged.
- Existing API paths remain unchanged.
- This project contains the new Next.js UI only.
- A Next.js server-side proxy forwards `/api/backend/*` to the existing ASP.NET application so browser CORS does not have to be solved by changing the ASP.NET backend.

## Current migrated screens

1. Login: `app/login/page.tsx`
2. Shared dashboard layout: `app/dashboard/layout.tsx`
3. Header: `components/Header.tsx`
4. Dynamic sidebar: `components/Sidebar.tsx`
5. Dashboard: `app/dashboard/page.tsx`

## Existing backend endpoints used

- `POST /UserLogin/Vallidateuser`
- `GET /UserLogin/Getmenuinfobyuser`
- `GET /UserLogin/GetAppointmentDashboardSummary`

The upstream endpoint names are intentionally unchanged.

## Run locally

Requirements: Node.js 20.9+.

1. Make sure the existing ASP.NET MVC project is running at:

   `https://localhost:44397`

2. In this folder run:

   `npm install`

3. Start Next.js:

   `npm run dev`

4. Open:

   `http://localhost:3000/login`

### HTTPS development certificate

The Next.js proxy connects from Node.js to `https://localhost:44397`. If the ASP.NET development HTTPS certificate is not trusted by Node, the proxy may fail with a TLS/certificate error. Trust the existing ASP.NET development certificate on the machine rather than changing the backend API.

## Important authentication note

The existing MVC login action creates ASP.NET Session values and the old Razor login also stores user values in `sessionStorage`. This first migration preserves that browser-side `sessionStorage` behavior and forwards the ASP.NET session cookie through the Next.js proxy. A proper server-side logout endpoint is not present in the controller source inspected so far, so this starter does not invent one.
