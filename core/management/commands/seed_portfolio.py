"""Load the initial CMS content, taken only from Retisha's CV.

Safe to re-run: existing items are left alone, so edits made in the CMS are never
overwritten. Use --force to wipe the seeded sections and load them again.
"""
import datetime
from pathlib import Path

from django.conf import settings
from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from django.db import transaction

from core.models import Profile, SiteSettings
from education.models import Education
from experience.models import Experience
from projects.models import Project, Tag
from services.models import Service
from skills.models import Skill, SkillCategory

SEED_ASSETS = Path(settings.BASE_DIR) / "seed_assets"

PROFILE = {
    "full_name": "Retisha Nakiyemba",
    "professional_title": "Virtual Assistant & AI Operations Specialist",
    "short_bio": (
        "A dependable, detail-oriented and systems-minded professional who combines virtual "
        "assistance and AI operations training with business education and hands-on technical skills."
    ),
    "long_bio": (
        "I’m Retisha Nakiyemba, a dependable, detail-oriented and systems-minded professional based "
        "in Kampala, Uganda. I combine training in virtual assistance and AI operations with business "
        "education and practical technical problem-solving.\n\n"
        "My AI operations and executive-support training covers executive workflow management, automated "
        "inbox triage, strategic calendar architecture and BLUF (bottom line up front) communication, "
        "alongside AI risk management, verification of AI-generated data and data-privacy enforcement.\n\n"
        "I also work as a full-stack developer. I currently build CRM, CMS and public-facing systems on a "
        "legal technology platform as a Frontend & Full-Stack Developer Intern at Vigour Technology Inc. "
        "That technical background helps me understand systems, work comfortably with digital tools, "
        "and take work from build through testing to deployment."
    ),
    "location": "Kampala, Uganda",
    "email": "retishanakiyemba202@gmail.com",
    "phone_primary": "0701066872",
    "phone_secondary": "0748864949",
    "linkedin_url": "https://www.linkedin.com/in/retisha-nakiyemba-50b9462a3",
    "github_url": "https://github.com/retisha256",
    "about_executive_support": (
        "I approach executive support as protecting time and attention. That means structuring calendars "
        "around real priorities, triaging the inbox so important messages surface first, preparing for "
        "meetings and following up so nothing slips, and communicating bottom line up front (BLUF) so "
        "busy people can decide quickly."
    ),
    "about_strengths": (
        "Organization and clear communication are at the centre of how I work: tracking tasks and "
        "deadlines, keeping information in order, and writing concisely. I like to understand how a "
        "process works before improving it, which is how I approached auditing a lead/task lifecycle at "
        "Vigour Technology Inc and surfacing four defects caused by an unenforced status state machine."
    ),
    "about_ai_responsibility": (
        "I treat AI as a tool that needs oversight. My training covers AI risk management, verification "
        "of AI-generated data, automation-bias prevention and data-privacy boundaries, so AI-assisted work "
        "is checked before it is relied on and sensitive information is handled with care."
    ),
    "about_technical": (
        "I hold a Certificate in Software Engineering with Python from Refactory Academy, with project "
        "work spanning React, Next.js, TypeScript, Django and Node.js. I use that background as a "
        "supporting advantage: it lets me help with website content, digital tool coordination, API "
        "integrations and technical documentation."
    ),
    "seo_title": "Retisha Nakiyemba | Virtual Assistant & AI Operations Specialist",
    "seo_description": (
        "Virtual Assistant & AI Operations Specialist in Kampala, Uganda: executive support, "
        "administrative operations and responsible AI workflows."
    ),
}

SERVICES = [
    {
        "title": "Executive Virtual Assistance", "category": "executive", "icon": "calendar",
        "description": "Calm, organized support that keeps an executive’s calendar, inbox and commitments under control.",
        "features": [
            "Calendar organization and strategic scheduling",
            "Inbox organization and email triage",
            "Meeting preparation and follow-ups",
            "Task and deadline tracking",
            "Document organization",
            "Professional written communication",
        ],
    },
    {
        "title": "Administrative and Operations Support", "category": "administrative", "icon": "folder",
        "description": "Reliable day-to-day coordination so routine work keeps moving and nothing is lost.",
        "features": [
            "Workflow coordination",
            "Records and file organization",
            "Research and information organization",
            "Process documentation",
            "Routine administrative task management",
        ],
    },
    {
        "title": "AI Operations Support", "category": "ai_operations", "icon": "brain",
        "description": "Practical help using AI tools carefully: checked, privacy-conscious and kept in proportion.",
        "features": [
            "AI-generated content and information verification",
            "Responsible AI workflow assistance",
            "AI risk awareness",
            "Privacy-conscious use of AI tools",
            "Automation workflow planning",
            "Reducing reliance on unverified AI outputs",
        ],
    },
    {
        "title": "Technical Assistance", "category": "technical", "icon": "wrench",
        "description": "Hands-on help with the digital side of the business, backed by a software engineering background.",
        "features": [
            "Website content support",
            "Basic troubleshooting and digital tool coordination",
            "API integration support",
            "Database and system-related assistance",
            "Technical documentation",
        ],
    },
]

# (category name, description, icon, [skills]) - only skills listed in the CV.
SKILLS = [
    ("Virtual Assistance", "", "calendar", []),
    ("Executive Support", "Protecting an executive’s time and attention.", "briefcase", [
        "Executive workflow management", "Automated inbox triage", "Strategic calendar architecture",
    ]),
    ("Administrative Operations", "", "folder", []),
    ("AI Operations", "Using AI carefully and responsibly.", "brain", [
        "AI risk management", "Verification of AI-generated data", "Automation-bias prevention",
        "Data-privacy boundaries",
    ]),
    ("Communication", "", "message", ["BLUF communication"]),
    ("Workflow Management", "", "workflow", ["Automated workflow design"]),
    ("Frontend Development", "", "code", [
        "React", "Next.js (App Router)", "React 19", "TypeScript", "JavaScript", "HTML", "CSS",
        "Responsive web development", "UI/UX design",
    ]),
    ("Backend Development", "", "layers", [
        "Django", "Django REST Framework", "Node.js", "Express.js", "RESTful APIs",
    ]),
    ("Databases", "", "database", ["PostgreSQL", "Supabase", "SQLite", "MongoDB"]),
    ("APIs and Integrations", "", "api", ["API integration", "Mobile money integration"]),
    ("Security and Data Privacy", "", "shield", [
        "Authentication", "Role-based access control", "Secure API routes", "Data-privacy enforcement",
    ]),
    ("Tools and Technologies", "", "settings", [
        "Git/GitHub", "Agile", "Code review", "Figma", "Object-oriented programming",
    ]),
]

EXPERIENCE = {
    "organization": "Vigour Technology Inc",
    "job_title": "Frontend & Full-Stack Developer Intern",
    "start_date": datetime.date(2026, 8, 1),
    "is_current": True,
    "arrangement": "Remote (Nigeria)",
    "description": "Building CRM, CMS and public-facing systems on a legal technology platform.",
    "responsibilities": [
        "Designed a Practice Head role model and audited the lead/task lifecycle, surfacing four defects "
        "caused by an unenforced status state machine.",
        "Diagnosed the CMS’s SEO scoring system and produced a roadmap to align it with industry-standard tooling.",
        "Specified a Lawyer Profile Management system covering data modelling, hierarchy sort logic, "
        "public API design and CMS interface.",
        "Replaced fragile server-migration tooling with reliable Postgres backup and restore scripts.",
    ],
}

EDUCATION = [
    {"institution": "Refactory Academy", "qualification": "Certificate in Software Engineering with Python",
     "kind": "certification", "status": "completed", "date": datetime.date(2025, 6, 1)},
    {"institution": "Nexford University", "qualification": "Bachelor of Business Administration — Artificial Intelligence",
     "kind": "degree", "status": "in_progress", "date": None},
    {"institution": "ERA92 Academy", "qualification": "Certificate for Virtual Assistants",
     "kind": "certification", "status": "expected", "date": datetime.date(2026, 11, 1)},
    {"institution": "ASPIRE Programs", "qualification": "Leadership Development Program",
     "kind": "development", "status": "completed", "date": datetime.date(2026, 9, 1)},
]

PROJECTS = [
    {
        "title": "Vigour Technology Inc — Frontend & Full-Stack Internship",
        "category": "other", "is_featured": False,
        "organization": "Vigour Technology Inc", "period": "Aug 2026 – Present",
        "role_title": "Frontend & Full-Stack Developer Intern (Remote, Nigeria)",
        "summary": "Internship on a legal technology platform: role modelling, a lifecycle audit, CMS SEO diagnosis, specification work and reliable database backups.",
        "overview": "A remote internship building CRM, CMS and public-facing systems on a legal technology platform.",
        "problem": (
            "The lead/task lifecycle relied on a status state machine that was not enforced, the CMS’s SEO "
            "scoring needed to match industry-standard tooling, and the server-migration tooling was fragile."
        ),
        "role_description": "Frontend & Full-Stack Developer Intern, working remotely from Nigeria.",
        "responsibilities": [
            "Role and permission design", "Process and lifecycle auditing", "System specification",
            "Database reliability",
        ],
        "work_completed": EXPERIENCE["responsibilities"],
        "technologies": ["PostgreSQL", "CRM", "CMS", "Public API design", "Backup and restore scripts"],
        "tags": ["Internship", "PostgreSQL", "CMS", "CRM", "Process audit"],
    },
    {
        "title": "Farmer’s Companion — AI-Powered Agricultural Assistant",
        "category": "backend_development", "is_featured": True,
        "period": "2026", "role_title": "Full-Stack Developer",
        "summary": "An AI farming assistant reachable by USSD, SMS and Voice on any 2G phone, with no smartphone or internet required.",
        "overview": (
            "An AI-powered farming assistant accessible via USSD, SMS and Voice on any 2G phone, with "
            "localized support in English, Runyankole and Acholi."
        ),
        "problem": "Farmers without a smartphone or internet connection cannot use app-based tools, so the assistant had to work on any basic 2G phone.",
        "role_description": "Full-Stack Developer, covering the Django backend and the integration of messaging and AI services.",
        "responsibilities": ["Full-stack development", "Backend development with Django", "Third-party API and AI integration"],
        "work_completed": [
            "Built an AI farming assistant accessible via USSD, SMS and Voice on any 2G phone, requiring no smartphone or internet.",
            "Integrated Africa’s Talking APIs and Sunflower AI, a Uganda-focused LLM, for localized support in English, Runyankole and Acholi.",
            "Developed the Django backend with SQLite for farmer profiles, crop data and transaction history.",
        ],
        "technologies": ["Django", "SQLite", "Africa’s Talking APIs", "Sunflower AI", "USSD", "SMS", "Voice"],
        "tags": ["AI", "Django", "USSD", "SMS", "Voice", "API integration"],
    },
    {
        "title": "Academic Services Platform",
        "category": "web_development", "is_featured": True,
        "period": "2026", "role_title": "Full-Stack Developer",
        "summary": "A role-based admin dashboard and client-intake platform with a custom blog CMS, built with Next.js 15 and Supabase.",
        "overview": "A platform for managing client intakes, messages and a custom blog CMS, built on Next.js 15, React 19 and TypeScript 5.",
        "role_description": "Full-Stack Developer, responsible for the architecture, admin dashboard and validated client workflows.",
        "responsibilities": ["Application architecture", "Secure admin dashboard", "Data validation and API security"],
        "work_completed": [
            "Architected a platform using Next.js 15 App Router, React 19 and TypeScript 5.",
            "Built a secure, role-based admin dashboard with Supabase PostgreSQL, Authentication and Storage for client intakes, messages and a custom blog CMS.",
            "Engineered data validation and secure API routes using React Hook Form and Zod for multi-step client workflows.",
        ],
        "technologies": ["Next.js 15", "React 19", "TypeScript 5", "Supabase PostgreSQL", "Supabase Authentication", "Supabase Storage", "React Hook Form", "Zod"],
        "tags": ["Next.js", "React", "TypeScript", "Supabase", "CMS"],
        "live_url": "https://scholar-craft-ccc3.vercel.app/",
        "source_url": "https://github.com/retisha256/ScholarCraft",
    },
    {
        "title": "Novuna Electronics E-Commerce Platform",
        "category": "backend_development", "is_featured": True,
        "period": "2025 – 2026", "role_title": "Full-Stack Developer",
        "summary": "An e-commerce platform with MTN Mobile Money and Airtel Money payment workflows, built with Node.js, Express.js and MongoDB.",
        "overview": "An e-commerce platform for electronics built with Node.js, Express.js and MongoDB, with mobile money payments.",
        "role_description": "Full-Stack Developer, responsible for the platform build and the payment integrations.",
        "responsibilities": ["Full-stack development", "Payment workflow integration"],
        "work_completed": [
            "Developed an e-commerce platform using Node.js, Express.js and MongoDB.",
            "Integrated MTN Mobile Money and Airtel Money payment workflows.",
        ],
        "technologies": ["Node.js", "Express.js", "MongoDB", "MTN Mobile Money", "Airtel Money"],
        "tags": ["E-commerce", "Node.js", "MongoDB", "Mobile money"],
        "live_url": "https://ecommerce-0oxh.onrender.com/",
        "thumbnail": ("ecommerce.png", "Screenshot of the Novuna Electronics storefront"),
    },
]


class Command(BaseCommand):
    help = "Load the initial portfolio content from the CV (idempotent)."

    def add_arguments(self, parser):
        parser.add_argument("--force", action="store_true",
                            help="Delete services, skills, projects, experience and education first.")

    @transaction.atomic
    def handle(self, *args, **options):
        if options["force"]:
            for model in (Service, Skill, SkillCategory, Project, Tag, Experience, Education):
                model.objects.all().delete()

        SiteSettings.load()
        self._profile()
        self._services()
        self._skills()
        self._experience()
        self._education()
        self._projects()
        self.stdout.write(self.style.SUCCESS("Portfolio content is ready."))

    def _profile(self):
        profile = Profile.load()
        if profile.short_bio:  # already filled in through the CMS
            return
        for field, value in PROFILE.items():
            setattr(profile, field, value)
        photo = SEED_ASSETS / "profile.jpg"
        if photo.exists() and not profile.photo:
            profile.photo.save("profile.jpg", ContentFile(photo.read_bytes()), save=False)
        cv = SEED_ASSETS / "Retisha_Nakiyemba_CV.pdf"
        if cv.exists() and not profile.cv_file:
            profile.cv_file.save("cv.pdf", ContentFile(cv.read_bytes()), save=False)
        profile.save()

    def _services(self):
        for order, data in enumerate(SERVICES):
            Service.objects.get_or_create(title=data["title"], defaults={**data, "display_order": order})

    def _skills(self):
        for c_order, (name, description, icon, skills) in enumerate(SKILLS):
            category, _ = SkillCategory.objects.get_or_create(
                name=name, defaults={"description": description, "icon": icon, "display_order": c_order}
            )
            for s_order, skill in enumerate(skills):
                Skill.objects.get_or_create(category=category, name=skill, defaults={"display_order": s_order})

    def _experience(self):
        Experience.objects.get_or_create(
            organization=EXPERIENCE["organization"], job_title=EXPERIENCE["job_title"], defaults=EXPERIENCE
        )

    def _education(self):
        for order, data in enumerate(EDUCATION):
            Education.objects.get_or_create(
                qualification=data["qualification"], institution=data["institution"],
                defaults={**data, "display_order": order},
            )

    def _projects(self):
        for order, data in enumerate(PROJECTS):
            data = dict(data)
            tags = data.pop("tags", [])
            thumb = data.pop("thumbnail", None)
            if Project.objects.filter(title=data["title"]).exists():
                continue
            project = Project(display_order=order, **data)
            if thumb:
                filename, alt = thumb
                source = SEED_ASSETS / filename
                if source.exists():
                    project.thumbnail.save(filename, ContentFile(source.read_bytes()), save=False)
                    project.thumbnail_alt = alt
            project.save()
            project.tags.set([Tag.objects.get_or_create(name=t)[0] for t in tags])
