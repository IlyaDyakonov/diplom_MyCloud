from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, FileViewSet, user_login, user_logout
from django.views.generic import TemplateView


router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
# router.register(r'users', FileViewSet, basename='file')

urlpatterns = [
    path("login/", user_login, name='user-login'),
    path("logout/", user_logout, name='user-logout'),
    path("register/", UserViewSet.as_view({'post': 'create'}), name='user-register'),
    path('', include(router.urls)),
# ]
] + router.urls
