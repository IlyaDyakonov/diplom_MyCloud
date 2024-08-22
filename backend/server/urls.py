from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework import routers
from .views import UserViewSet, FileViewSet, user_login, user_logout
from django.views.generic import TemplateView


router = routers.DefaultRouter()
# router.register(r'users', UserViewSet, basename='user')
# router.register(r'users', FileViewSet, basename='file')

urlpatterns = [
    path("login/", user_login, name='user-login'),
    path("logout/", user_logout, name='user-logout'),
    # path("register/", UserViewSet, name='user-logout'),
    path('', include(router.urls)),
# ]
] + router.urls
