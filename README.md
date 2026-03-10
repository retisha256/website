# Retisha Nakiyemba — Portfolio Site

A professional portfolio website built with Django and Tailwind CSS, featuring a 3D interactive photo frame, project showcase, and contact information.

## 📁 Project Structure

```text
portifolio/
├── portfolio_site/          # Project configuration (settings, asgi, wsgi)
│   ├── settings.py          # Django settings with WhiteNoise & Gunicorn config
│   ├── urls.py              # Main URL routing
│   └── .env                 # Environment variables (private)
├── portfoli/                # Main application folder
│   ├── templates/           # HTML templates
│   │   └── portfolio_app/
│   │       └── index.html   # Main landing page
│   ├── static/              # CSS, JS, and Images
│   ├── models.py            # ContactMessage database model
│   └── views.py             # Home page logic
├── manage.py                # Django management script
├── requirements.txt         # Project dependencies (for Render/Deployment)
├── .gitignore               # Files to exclude from Git
├── db.sqlite3               # Local database
└── venv/                    # Python virtual environment
```

## 🚀 Deployment on Render

This project is optimized for deployment on **Render.com**.

### Render Settings:
- **Environment**: `Python 3`
- **Build Command**: `pip install -r requirements.txt && python manage.py collectstatic --no-input`
- **Start Command**: `gunicorn portfolio_site.wsgi:application`

### Environment Variables:
Ensure the following are set in the Render Dashboard:
- `EMAIL_HOST_USER`: Your Gmail address
- `EMAIL_HOST_PASSWORD`: Your Google App Password

## 🛠️ Local Development

1.  **Activate Virtual Environment**:
    ```powershell
    .\venv\Scripts\Activate.ps1
    ```
2.  **Install Dependencies**:
    ```powershell
    pip install -r requirements.txt
    ```
3.  **Run Server**:
    ```powershell
    python manage.py runserver
    ```
