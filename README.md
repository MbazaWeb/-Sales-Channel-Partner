# Sales Channel Partner Onboarding System

Production-grade SCP onboarding portal built with React, Vite, Tailwind CSS, and Supabase.

## Features

- Standard user application form with generated branded PDF preview and download
- Supabase authentication and application storage
- Role-based access for user and superadmin workflows
- Required document uploads with storage policy enforcement
- Dedicated admin review route with required internal review fields, approval, rejection, and PDF export workflow
- Responsive shell with desktop sidebar and mobile bottom navigation
- SPA fallback files for Netlify and Vercel deployments

## Tech Stack

- React 19
- Vite 8
- Tailwind CSS 4
- Supabase Auth, Postgres, and Storage
- pdf.js and pdf-lib

## Environment Variables

Create a local `.env` file from `.env.example`.

Required frontend variables:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Optional local-only values kept outside the client bundle:

```env
SUPABASE_PROJECT_ID=your-project-ref
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Local Development

Install dependencies:

```bash
npm install
```

Start the app:

```bash
npm run dev
```

Quality checks:

```bash
npm run lint
npm run build
```

## SPA Hosting Fallbacks

The project uses `createBrowserRouter`, so static hosts need a fallback to `index.html` for nested routes.

Included files:

- `public/_redirects` for Netlify
- `vercel.json` for Vercel

These ensure routes like `/admin/applications/<id>` work on refresh.

## Supabase Setup

Run the SQL files in this order inside the Supabase SQL Editor:

1. `supabase/schema.sql`
2. `supabase/policies.sql`
3. `supabase/storage.sql`

What each file does:

- `schema.sql` creates the application tables and update trigger
- `policies.sql` enables row-level security and creates application/data policies
- `storage.sql` creates the `application-documents` bucket and storage policies

## Storage Rules

Uploaded files are stored under this pattern:

```text
applications/<application-id>/<document-key>-<timestamp>-<filename>
```

Accepted file types:

- JPG
- PNG
- PDF

Max file size:

- 5MB

## Access Model

Default roles:

- `USER` for standard applicants
- `ADMIN` for the privileged review account

Configured superadmin identity:

- Email: `mbazzacodes@gmail.com`
- UID: `32fbf24f-6a93-4a19-af06-eded5be88496`

## Project Structure

```text
src/
	components/
		form/
		layout/
		ui/
	config/
	context/
	hooks/
	pages/
		admin/
		auth/
		user/
	services/
	utils/
supabase/
	schema.sql
	policies.sql
	storage.sql
public/
	pdf/
		form.pdf
```

## Notes

- The generated application PDF now uses a React PDF layout and appends uploaded supporting documents to the output pack.
- The frontend only uses the Supabase anon key. Do not expose the service role key through `VITE_` variables.
- The build currently succeeds, but the PDF tooling contributes a large bundle chunk. Code-splitting can be added later if needed.
