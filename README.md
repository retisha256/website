# Retisha Nakiyemba — Virtual Assistant & AI Operations Portfolio

A working portfolio website with a built-in CMS, so every piece of content can be edited without touching code.

- **Backend:** Django 5 + Django REST Framework (session auth, PostgreSQL in production, SQLite locally)
- **Public site:** server-rendered page shells (SEO tags, nav, footer) + TypeScript that fetches all content from the API
- **CMS dashboard:** TypeScript single-page app at **`/admin/`**
- **Styling:** Tailwind CSS (Inter font; palette `#F8F9FA` / `#0A192F` / `#64FFDA`)
- Django's built-in admin is still available at `/django-admin/` as a fallback (users, raw data).

## Project layout

```
portfolio_site/     settings, root URLs
core/               site settings, profile, links, auth + dashboard API, page views, sitemap, middleware, seed command, tests
skills/ services/ projects/ experience/ education/ testimonials/    one Django app per content type (models, serializers, views)
templates/          base layout, page shell, CMS shell, 404, maintenance
frontend/           TypeScript + Tailwind sources  →  builds into static/dist/
static/dist/        built JS/CSS (committed, so deploying needs no Node)
seed_assets/        photo, CV and screenshot used by the seed command
```

## Run it locally

Requirements: Python 3.11+ and (only to change the frontend) Node 18+.

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1            # macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
copy .env.example .env                  # then edit: set DJANGO_DEBUG=True for local work
python manage.py migrate
python manage.py seed_portfolio         # loads the content from the CV (safe to re-run)
python manage.py createsuperuser        # your CMS login (see below)
python manage.py runserver
```

- Website: <http://localhost:8000/>
- CMS: <http://localhost:8000/admin/>
- API docs (Swagger): <http://localhost:8000/api/docs/>

### Create the first administrator

```powershell
python manage.py createsuperuser
```

Enter a username and a strong password (10+ characters). Sign in at `/admin/`. Only users marked *staff* can use the CMS or the admin API. Change your password later under **Account → Change password**.

### Changing the frontend (optional)

The built files are already in `static/dist/`. Only if you edit `frontend/src`:

```powershell
cd frontend
npm install
npm run build        # type-checks, bundles JS, builds CSS
npm run watch        # rebuild JS on change
```

## What you can edit in the CMS

Everything is edited at `/admin/`. Publishing or editing updates the live site immediately — no rebuild.

| CMS section | Controls |
|---|---|
| **Dashboard** | Published/draft counts, recent edits, quick-add links, content checklist |
| **Projects** | Case studies: all 7 sections, category, tags, thumbnail, gallery, links, featured-on-homepage, publish/unpublish, reorder |
| **Services** | Title, description, bullet list, category, built-in or uploaded icon, order, status |
| **Skill categories / Skills** | Add your own categories and skills; icons, order, status. No percentage bars are ever shown |
| **Experience** | Employer, title, dates, current-role toggle, arrangement, responsibilities |
| **Education** | Institution, qualification, status (completed / pursuing / **expected**), date, certificate upload |
| **Testimonials** | Real, authorised testimonials only (requires a permission tick before publishing). None are pre-loaded |
| **Profile** | Name, title, bios, photo, About-page sections, **CV upload** (powers every “Download my CV” button), SEO |
| **Contact details** | Location, email, phones, LinkedIn, GitHub (shown on Contact page + footer as `mailto:`/`tel:` links) |
| **Other links** | Any extra professional links |
| **Site settings** | Title, monogram/logo, favicon, theme colours, nav labels, homepage hero and closing text, footer, SEO + social image, maintenance mode |

Items can be reordered with the arrows, hidden with **Unpublish**, or permanently removed with **Delete** (always confirmed first).

## Honesty rules built in

- The seed content comes **only from the CV**. The ERA92 certificate is stored as *Expected Nov 2026*, not completed.
- Case-study sections you leave empty are not shown. “Verified outcomes” need an evidence note before they can be saved.
- Testimonials cannot be published without ticking that the author gave permission.

## Tests

```powershell
python manage.py test
```

36 tests cover public vs. admin visibility, permissions, CSRF, login rate-limiting, validation, secure uploads, SEO pages, sitemap, maintenance mode and the seed command.

## API

Interactive docs at `/api/docs/` (schema at `/api/schema/`).

| Prefix | Access | Purpose |
|---|---|---|
| `GET /api/public/…` | anyone, read-only | published content only: `site`, `services`, `skills`, `projects` (`?search=&category=&tag=&featured=`), `projects/facets`, `experience`, `education`, `testimonials` |
| `/api/admin/…` | staff session + CSRF | full CRUD, `publish`, `unpublish`, `reorder`, `dashboard`, `profile`, `site-settings` |
| `/api/auth/…` | — | `csrf`, `login` (rate-limited), `logout`, `me`, `password` |

Errors always look like `{"detail": "summary", "errors": {"field": ["message"]}}`.

## Security notes

Hashed passwords (Django), session cookies (HttpOnly, Secure in production, SameSite), CSRF on every write, login throttling (5/min), upload limits and real-content checks (images are decoded with Pillow; SVG is refused; CVs must be real PDFs; filenames are randomised), strict Content-Security-Policy, HSTS + HTTPS redirect in production, public API physically separated from the admin API, secrets only from environment variables.

## Deploy

Everything runs as one Django service (the frontend is already built into `static/dist/`).

### 1. Database (PostgreSQL)
Create a PostgreSQL database (Render, Neon, Supabase, Railway…) and copy its connection string into `DATABASE_URL`.

### 2. Backend + frontend (example: Render web service)
- **Build command:** `pip install -r requirements.txt && python manage.py collectstatic --no-input && python manage.py migrate`
- **Start command:** `gunicorn portfolio_site.wsgi:application`
- **Environment variables** (see `.env.example`): `DJANGO_SECRET_KEY`, `DJANGO_DEBUG=False`, `DJANGO_ALLOWED_HOSTS`, `DJANGO_CSRF_TRUSTED_ORIGINS`, `SITE_URL`, `DATABASE_URL`, plus the media settings below.
- After the first deploy, open a shell and run `python manage.py createsuperuser`, then `python manage.py seed_portfolio` (or enter content yourself in the CMS).
- Check the config any time with `python manage.py check --deploy`.

### 3. Media storage (photo, CV, certificates)
Hosts like Render have a temporary disk, so uploads would vanish on redeploy. Choose one:
- **Persistent disk:** attach a disk (e.g. mounted at `/var/data`) and set `MEDIA_ROOT=/var/data/media`. Django serves `/media/` itself.
- **S3-compatible bucket (recommended):** create a public-read bucket (AWS S3, Cloudflare R2, Backblaze B2) and set `USE_S3_MEDIA=True`, `AWS_STORAGE_BUCKET_NAME`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and for non-AWS providers `AWS_S3_ENDPOINT_URL` / `AWS_S3_CUSTOM_DOMAIN`.

### 4. Hosting the frontend separately (optional)
Not needed. If you ever host the TypeScript frontend on another domain, set `CORS_ALLOWED_ORIGINS` and `DJANGO_CSRF_TRUSTED_ORIGINS` to that origin.

## What still needs your input

- **A real `DJANGO_SECRET_KEY`**, domain names, database URL, and media-storage credentials (none are in the repo).
- **Your latest CV PDF:** the seeded file is the PDF already in the repo; upload your newest one under *Profile → CV*.
- **Availability statement** (left blank because it isn’t in the CV).
- **Project links** for Farmer’s Companion and the Vigour internship, and any **verified outcomes** you can evidence.
- **Social sharing image** (*Site settings*): until set, the profile photo is used.
