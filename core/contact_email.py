"""Send contact messages through Resend's HTTPS API."""
import json
import logging
import os
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

logger = logging.getLogger(__name__)


class ContactEmailNotConfigured(Exception):
    pass


class ContactEmailDeliveryError(Exception):
    pass


def send_contact_email(*, name: str, email: str, subject: str, message: str) -> None:
    api_key = os.environ.get("RESEND_API_KEY", "").strip()
    if not api_key:
        raise ContactEmailNotConfigured

    payload = {
        "from": os.environ.get(
            "CONTACT_FROM_EMAIL", "Portfolio website <onboarding@resend.dev>"
        ).strip(),
        "to": [os.environ.get("CONTACT_TO_EMAIL", "retishanakiyemba202@gmail.com").strip()],
        "reply_to": email,
        "subject": f"Portfolio contact: {subject}",
        "text": f"Name: {name}\nEmail: {email}\n\n{message}",
    }
    request = Request(
        "https://api.resend.com/emails",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urlopen(request, timeout=10) as response:
            response.read()
            if not 200 <= response.status < 300:
                logger.error("Resend returned HTTP %s for a contact message.", response.status)
                raise ContactEmailDeliveryError
    except HTTPError as exc:
        logger.error("Resend rejected a contact message with HTTP %s.", exc.code)
        raise ContactEmailDeliveryError from exc
    except (URLError, TimeoutError, OSError) as exc:
        logger.error("Could not reach Resend to deliver a contact message: %s", exc)
        raise ContactEmailDeliveryError from exc
