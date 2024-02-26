from django.urls import path
from .views import *

urlpatterns = [
    path('', RealtorListView.as_view()),
    path('topSeller', TopSellerView.as_view()),
    path('<int:pk>', RealtorView.as_view()),

]
