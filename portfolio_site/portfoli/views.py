from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponseRedirect
from django.core.mail import send_mail
from django.conf import settings
from django.contrib import messages
from django.utils import timezone

from .models import ContactMessage

@csrf_exempt
def home(request):
    if request.method == "POST":
        name = request.POST.get('name')
        email = request.POST.get('email')
        message = request.POST.get('message')
        
        if name and email and message:
            # Save to database (Persistence)
            contact = ContactMessage.objects.create(name=name, email=email, message=message)
            
            # Send email notification
            subject = f"New Contact Message from {name}"
            body = f"""
Name: {name}
Email: {email}

Message:
{message}

Sent at: {timezone.now().strftime('%Y-%m-%d %H:%M:%S')}
            """
            try:
                send_mail(
                    subject,
                    body,
                    settings.DEFAULT_FROM_EMAIL,
                    [settings.DEFAULT_FROM_EMAIL],  # Sends to your email
                    fail_silently=False,
                )
                messages.success(request, "Thanks — your message was received successfully! I'll get back to you soon.")
            except Exception as e:
                # If email fails, we still have it in DB
                print(f"EMAIL ERROR: {e}")
                messages.success(request, "Message saved! (Note: Email notification failed, but I will see your message in my dashboard.)")
        else:
            messages.error(request, "Please fill in all fields.")
        return redirect('home')
    
    # Pass current year for footer
    return render(request, 'portfolio_app/index.html', {
        'now': timezone.now()
    })