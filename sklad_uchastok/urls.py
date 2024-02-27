from django.contrib import admin
from django.urls import path
from .views import *

urlpatterns = [
    path('all', Uchastok_all_View.as_view()),
]
