from flask import current_app, render_template_string
from flask_mail import Mail, Message

mail = Mail()

def send_verification_email(email: str, verification_url: str) -> None:
    """
    Send verification email to user
    
    Args:
        email: Recipient email address
        verification_url: URL for email verification
    """
    subject = "Welcome to KeySaver - Verify Your Email"
    
    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }}
            .container {{
                background-color: #f8f9fa;
                border-radius: 10px;
                padding: 30px;
                margin: 20px 0;
            }}
            .header {{
                text-align: center;
                margin-bottom: 30px;
            }}
            .header h1 {{
                color: #1e293b;
                margin: 0;
                font-size: 28px;
            }}
            .content {{
                background-color: white;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }}
            .button {{
                display: inline-block;
                padding: 14px 28px;
                background-color: #1e293b;
                color: white !important;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                text-align: center;
                margin: 20px 0;
            }}
            .button:hover {{
                background-color: #334155;
            }}
            .footer {{
                text-align: center;
                margin-top: 30px;
                color: #6b7280;
                font-size: 14px;
            }}
            .warning {{
                background-color: #fef3c7;
                border-left: 4px solid #f59e0b;
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔐 Welcome to KeySaver</h1>
            </div>
            
            <div class="content">
                <h2>Verify Your Email Address</h2>
                
                <p>Hello!</p>
                
                <p>Thank you for signing up for KeySaver, your secure key-value storage solution. To get started, we need to verify your email address.</p>
                
                <p>Please click the button below to verify your email and set up your account:</p>
                
                <div style="text-align: center;">
                    <a href="{verification_url}" class="button">Verify Email Address</a>
                </div>
                
                <p>Or copy and paste this link into your browser:</p>
                <p style="background-color: #f3f4f6; padding: 12px; border-radius: 6px; word-break: break-all; font-size: 14px;">
                    {verification_url}
                </p>
                
                <div class="warning">
                    <strong>⚠️ Important:</strong> After verification, you'll be asked to set a passphrase. This passphrase is crucial for encrypting your keys and will never be stored on our servers. Make sure to remember it!
                </div>
                
                <p><strong>Link expires in 1 hour.</strong></p>
            </div>
            
            <div class="footer">
                <p>If you didn't request this email, you can safely ignore it.</p>
                <p>© 2025 KeySaver. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    text_body = f"""
    Welcome to KeySaver!
    
    Thank you for signing up. To verify your email address and complete your registration, please visit:
    
    {verification_url}
    
    After verification, you'll be asked to set a passphrase for encrypting your keys. This passphrase will never be stored on our servers, so make sure to remember it!
    
    This link will expire in 1 hour.
    
    If you didn't request this email, you can safely ignore it.
    
    Best regards,
    The KeySaver Team
    """
    
    msg = Message(
        subject=subject,
        recipients=[email],
        body=text_body,
        html=html_body
    )
    
    mail.send(msg)


def send_login_email(email: str, login_url: str) -> None:
    """
    Send login link to user
    
    Args:
        email: Recipient email address
        login_url: URL for login
    """
    subject = "KeySaver - Your Login Link"
    
    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }}
            .container {{
                background-color: #f8f9fa;
                border-radius: 10px;
                padding: 30px;
                margin: 20px 0;
            }}
            .header {{
                text-align: center;
                margin-bottom: 30px;
            }}
            .header h1 {{
                color: #1e293b;
                margin: 0;
                font-size: 28px;
            }}
            .content {{
                background-color: white;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }}
            .button {{
                display: inline-block;
                padding: 14px 28px;
                background-color: #1e293b;
                color: white !important;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                text-align: center;
                margin: 20px 0;
            }}
            .button:hover {{
                background-color: #334155;
            }}
            .footer {{
                text-align: center;
                margin-top: 30px;
                color: #6b7280;
                font-size: 14px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔐 KeySaver Login</h1>
            </div>
            
            <div class="content">
                <h2>Your Login Link is Ready</h2>
                
                <p>Hello!</p>
                
                <p>You requested to log in to your KeySaver account. Click the button below to access your account:</p>
                
                <div style="text-align: center;">
                    <a href="{login_url}" class="button">Log In to KeySaver</a>
                </div>
                
                <p>Or copy and paste this link into your browser:</p>
                <p style="background-color: #f3f4f6; padding: 12px; border-radius: 6px; word-break: break-all; font-size: 14px;">
                    {login_url}
                </p>
                
                <p><strong>Link expires in 30 minutes.</strong></p>
            </div>
            
            <div class="footer">
                <p>If you didn't request this email, you can safely ignore it.</p>
                <p>© 2025 KeySaver. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    text_body = f"""
    KeySaver Login
    
    You requested to log in to your KeySaver account.
    
    Click here to log in:
    {login_url}
    
    This link will expire in 30 minutes.
    
    If you didn't request this email, you can safely ignore it.
    
    Best regards,
    The KeySaver Team
    """
    
    msg = Message(
        subject=subject,
        recipients=[email],
        body=text_body,
        html=html_body
    )
    
    mail.send(msg)
