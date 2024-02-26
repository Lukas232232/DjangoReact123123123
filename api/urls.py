from django.contrib import admin
from django.urls import path
from django.conf.urls import url, include
from .views import *

urlpatterns = [
    path('room', RoomView.as_view()),
    path('create-room', CreateRoomView.as_view()),
    path('get-room', GetRoom.as_view()),
    path('join-room', JoinRoom.as_view()),
    path('user-in-room', UserIsRoom.as_view()),
    path('leave-room', LeaveRoom.as_view()),
]
