"""
Django settings for django_project project.

Generated by 'django-admin startproject' using Django 3.2.13.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.2/ref/settings/
"""

from pathlib import Path
import os
from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY')

if SECRET_KEY is None:
    SECRET_KEY = "fsdfsafdfdffdDFDFSDFF&(&(&_&FSDF_FDF_FSDF"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']
X_FRAME_OPTIONS = '*'

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'api',
    'frontend',
    'accounts',
    'realtors',
    'listings',
    'contacts',
    'sklad_uchastok',
]

SESSION_COOKIE_AGE = 60 * 60 * 72  # время жизни сессии в секундах, здесь установлено на 3 дня

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'accounts.middleware.JWT_middleware.JWT_middleware',
]

ROOT_URLCONF = 'django_project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'APP_DIRS': True,
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
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

WSGI_APPLICATION = 'django_project.wsgi.application'

# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = 'slavikogienko232@gmail.com'
EMAIL_HOST_PASSWORD = 'thirksndrnrbunwm'
EMAIL_USE_TLS = True

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME':
        'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME':
        'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME':
        'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME':
        'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = 'ru'

TIME_ZONE = 'Europe/Moscow'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/

STATIC_URL = '/static/'
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'build/static')]
STATIC_ROOT = os.path.join(BASE_DIR, 'static')

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
#minutes=15
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME":
    timedelta(days=60),
    "REFRESH_TOKEN_LIFETIME":
    timedelta(days=60),
    "ROTATE_REFRESH_TOKENS":
    False,
    "BLACKLIST_AFTER_ROTATION":
    False,
    "UPDATE_LAST_LOGIN":
    False,
    "ALGORITHM":
    "HS256",
    "SIGNING_KEY":
    SECRET_KEY,
    "VERIFYING_KEY":
    "",
    "AUDIENCE":
    None,
    "ISSUER":
    None,
    "JSON_ENCODER":
    None,
    "JWK_URL":
    None,
    "LEEWAY":
    0,
    "AUTH_HEADER_TYPES": ("Bearer", ""),
    "AUTH_HEADER_NAME":
    "HTTP_AUTHORIZATION",
    "USER_ID_FIELD":
    "id",
    "USER_ID_CLAIM":
    "user_id",
    "USER_AUTHENTICATION_RULE":
    "rest_framework_simplejwt.authentication.default_user_authentication_rule",
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken", ),
    "TOKEN_TYPE_CLAIM":
    "token_type",
    "TOKEN_USER_CLASS":
    "rest_framework_simplejwt.models.TokenUser",
    "JTI_CLAIM":
    "jti",
    "SLIDING_TOKEN_REFRESH_EXP_CLAIM":
    "refresh_exp",
    "SLIDING_TOKEN_LIFETIME":
    timedelta(minutes=5),
    "SLIDING_TOKEN_REFRESH_LIFETIME":
    timedelta(days=1),
    "TOKEN_OBTAIN_SERIALIZER":
    "rest_framework_simplejwt.serializerr",
    "TOKEN_REFRESH_SERIALIZEs.TokenObtainPairSerializeR":
    "rest_framework_simplejwt.serializers.TokenRefreshSerializer",
    "TOKEN_VERIFY_SERIALIZER":
    "rest_framework_simplejwt.serializers.TokenVerifySerializer",
    "TOKEN_BLACKLIST_SERIALIZER":
    "rest_framework_simplejwt.serializers.TokenBlacklistSerializer",
    "SLIDING_TOKEN_OBTAIN_SERIALIZER":
    "rest_framework_simplejwt.serializers.TokenObtainSlidingSerializer",
    "SLIDING_TOKEN_REFRESH_SERIALIZER":
    "rest_framework_simplejwt.serializers.TokenRefreshSlidingSerializer",
}

REST_FRAMEWORK = {
    # Использование аутентификации с помощью стандартного токена
    'DEFAULT_AUTHENTICATION_CLASSES':
    ('rest_framework_simplejwt.authentication.JWTAuthentication', ),
    # Установка стандартных разрешений для доступа к API
    'DEFAULT_PERMISSION_CLASSES': ('rest_framework.permissions.AllowAny', ),
    # Конфигурация рендереров (какие типы контента может генерировать API)
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ),
}

CORS_ORIGIN_ALLOW_ALL = True
FILE_UPLOAD_PERMISSIONS = 0o640
AUTH_USER_MODEL = 'accounts.UserAccount'
