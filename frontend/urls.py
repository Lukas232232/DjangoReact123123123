from django.contrib import admin
from django.urls import path
from .views import index

urlpatterns = [
    # path('', index),
    # path('join', index),
    # path('login', index),
    # path('join/us', index),
    # path('join/<int:pk>', index),
    # path('createRoom', index),
    # path('room/<str:roomCode>', index),
    # path('pages', index),
    # path('pages/<int:pk>', index),
    # path('posts/new', index),
    # path('pages/<int:pk>/edit', index),
    # Новые пути
    path('', index),
    path('skladUchastok', index),
    path('createRoom', index),
    path('About', index),
    path('Contact', index),
    path('ListingDetails', index),
    path('Listings', index),
    path('Login', index),
    path('SignUp', index),
    path('centerSklad', index),
]
