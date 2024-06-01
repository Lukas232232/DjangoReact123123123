from django.urls import path

from .views import *

urlpatterns = [
    path('all', Centeraln_all_View.as_view(), name='Centeraln_all'),
    # path('all/<int:pk>', Uchastok_all_View.as_view(), name='uchastok_detail'),
    # path('create', Uchastok_create_View.as_view()),
    # path('delete/<int:pk>', Uchastok_create_View.as_view()),
    # path('edit/<int:pk>', Uchastok_create_View.as_view()),
]
