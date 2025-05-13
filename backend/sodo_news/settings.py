
import smtplib
from pathlib import Path
import psycopg2
from datetime import datetime
import os


from email.mime.text import MIMEText
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-g^x20410(7*@hb3-kvt_tbhs(7_!xytur6w4!eb1s6u92$uav9'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'news_app',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'sodo_news.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'sodo_news.wsgi.application'
CORS_ALLOW_ALL_ORIGINS = True

# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = 'static/'

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field


# MEDIA_URL = '/media/'
# MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


def sendResponse(resultCode, action=None, data=[]):
    response = {}
    response["action"] = action
    response["data"] = data
    response["resultCode"] = resultCode
    response["resultMessage"] = resultMessages[resultCode]
    response["size"] = len(data)
    response["curdate"] = datetime.now().strftime("%Y/%m/%d %H:%M:%S")
    return response


resultMessages = {
    1000: 'Бүртгэлтэй хэрэглэгч байна',
    1001: 'Token-ний хугацаа дууссан эсвэл хүчингүй token байна',
    1002: 'Баталгаажсан хэрэглэгч байна',
    1004: 'Бүртгэлгүй хэрэглэгч байна',
    500: 'id butsaaj chadsangvi',
    501: 'amjiltgui',

    200: 'Success',
    204: 'No Content',
    301: "Bad request",

    404: "Not found",
    4000: 'Invalid Method',
    4001: 'Invalid Json',
    4002: 'Action Missing',
    4003: 'Invalid Action',
    4004: 'Key дутуу',
    4005: 'Database Error',
    4007: 'Password буруу байна',
    4008: 'Бүртгэлээ баталгаажуулна уу',
    4009: 'утга олдсонгүй',

    5000: 'Server Error',
    5004: 'Register Service дотоод алдаа',
}


def sendMail(recipient, subj, bodyHtml):
    sender_email = "testmail@mandakh.edu.mn"
    sender_password = "Mandakh2"
    recipient_email = recipient
    subject = subj
    body = bodyHtml

    html_message = MIMEText(body, 'html')
    html_message['Subject'] = subject
    html_message['From'] = sender_email
    html_message['To'] = recipient_email
    with smtplib.SMTP('smtp-mail.outlook.com', 587) as server:
        server.ehlo()
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, recipient_email,
                        html_message.as_string())
        server.quit()
# sendMail


def connectDB():
    conn = psycopg2.connect(
        #host="192.168.0.15",
        host="59.153.86.254",
        dbname="dbissw",
        user="userISSW",
        password="passissw",
        # password="paasissw",
        port=5938
    )
    return conn


def disconnectDB(conn):
    conn.close()
