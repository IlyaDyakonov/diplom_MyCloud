from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from .views import UserViewSet, FileViewSet, user_login, user_logout


router = routers.DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
# router.register(r'users', FileViewSet, basename='file')

urlpatterns = [
    path("login/", user_login, name='user-login'),
    path("logout/", user_logout, name='user-logout'),
]
# ] + router.urls
