from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, FileViewSet, user_login, user_logout
from django.views.generic import TemplateView


router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'files', FileViewSet, basename='file')

urlpatterns = [
    path("login/", user_login, name='user-login'),
    path("logout/", user_logout, name='user-logout'),
    path("register/", UserViewSet.as_view({'post': 'create'}), name='user-register'),
    path('files/<folder_name>/', FileViewSet.as_view({'get': 'list', 'post': 'create'}), name='file-list'),
	path('files/<folder_name>/<int:pk>', FileViewSet.as_view({'patch': 'update', 'delete': 'destroy'}), name='file-detail'),
	path('download/<unique_id>/', FileViewSet.as_view({'get': 'download'}), name='file-download'),
    path('', include(router.urls)),
# ]
] + router.urls
