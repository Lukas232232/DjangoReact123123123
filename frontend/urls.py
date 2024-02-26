from django.contrib import admin
from django.urls import path
from django.conf.urls import url, include
from .views import index

urlpatterns = [
    path('', index),
    path('join', index),
    path('login', index),
    path('join/us', index),
    path('join/<int:pk>', index),
    path('createRoom', index),
    path('room/<str:roomCode>', index),
    path('pages', index),
    path('pages/<int:pk>', index),
    path('posts/new>', index),
    path('pages/<int:pk>/edit', index),
    # Новые пути
    path('new', index),
    path('new/createRoom', index),
    path('new/About', index),
    path('new/Contact', index),
    path('new/ListingDetails', index),
    path('new/Listings', index),
    path('new/Login', index),
    path('new/SignUp', index),
]
