"""Names of the built-in icons. The SVG artwork lives in frontend/src/shared/icons.ts."""
ICON_NAMES = [
    "calendar", "inbox", "tasks", "users", "file", "folder", "search", "brain",
    "shield", "workflow", "code", "database", "globe", "wrench", "mail", "phone",
    "chart", "check", "star", "clock", "lock", "cloud", "api", "layers", "book",
    "award", "message", "briefcase", "heart", "link", "pen", "settings", "sparkle",
]
ICON_CHOICES = [(name, name.replace("_", " ").title()) for name in ICON_NAMES]
