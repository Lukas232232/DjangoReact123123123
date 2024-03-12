from django.urls import path

from .views import *

urlpatterns = [
    path('all', Uchastok_all_View.as_view()),
    path('create', Uchastok_create_View.as_view()),
]
