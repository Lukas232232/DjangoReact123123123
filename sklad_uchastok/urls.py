from django.contrib import admin
from django.urls import path
from django.conf.urls import url, include
from .views import *

urlpatterns = [
    path('all', Uchastok_all_View.as_view()),
]
