from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, FileViewSet, get_file, get_link, user_login, user_logout
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static


router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'files', FileViewSet, basename='file')

urlpatterns = [
    path("login/", user_login, name='user-login'),
    path("logout/", user_logout, name='user-logout'),
    path("register/", UserViewSet.as_view({'post': 'create'}), name='user-register'),
    # path('api/detail_users_list/', get_detail_user_list),
    # path('api/delete_user/<int:user_id>/', delete_user),
    # path('files/', FileViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('files/<int:pk>/', FileViewSet.as_view({'get': 'list', 'post': 'create', 'delete': 'destroy', 'patch': 'update'}), name='file-detail'),
    path('files/<folder_name>/', FileViewSet.as_view({'get': 'list', 'post': 'create'}), name='file-list'),
    path('link/', get_link),
    path('link/<str:link>/', get_file),
	# path('files/<folder_name>/<int:pk>', FileViewSet.as_view({'patch': 'update', 'delete': 'destroy'}), name='file-detail'),
	# path('download/<unique_id>/', FileViewSet.as_view({'get': 'download'}), name='file-download'),
    path('', include(router.urls)),
] + router.urls

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
