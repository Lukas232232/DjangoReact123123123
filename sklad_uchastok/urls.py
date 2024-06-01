from django.urls import path

from .views import *

urlpatterns = [
    path('all', Uchastok_all_View.as_view(), name='uchastok_all'),
    path('all/<int:pk>/', Uchastok_all_View.as_view(), name='uchastok_detail'),
    path('create', Uchastok_create_View.as_view()),
    path('delete/<int:pk>', Uchastok_create_View.as_view()),
    path('edit/<int:pk>', Uchastok_create_View.as_view()),
]
