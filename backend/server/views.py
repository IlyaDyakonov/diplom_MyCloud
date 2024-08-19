from django.contrib.auth import authenticate, login, logout
from django.http import FileResponse, JsonResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie, csrf_protect
from django.shortcuts import render, redirect
from django.shortcuts import get_object_or_404
from django.middleware.csrf import get_token
from django.contrib import messages
from django.urls import reverse
from django.contrib.auth.forms import AuthenticationForm

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import permissions, viewsets, status

from .models import User, File
from .serializers import UserSerializer, FileSerializer


class UserViewSet(viewsets.ModelViewSet):
    # def get(self, request):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    # Метод для управления правами доступа на основе действий
    def get_permissions(self):
        # удаление
        if self.action == 'destroy':
            self.permission_classes = [permissions.IsAdminUser, permissions.IsAuthenticated]
        # Если действия 'update' или 'partial_update' (обновление), то доступ разрешён только аутентифицированным пользователям
        elif self.action in ['update', 'partial_update']:
            self.permission_classes = [permissions.IsAuthenticated]
        # Для всех остальных действий доступ разрешён любому пользователю
        else:
            self.permission_classes = [permissions.AllowAny]
        # Возвращаем результат вызова родительского метода get_permissions()
        return super().get_permissions()

    # создание нового пользователя
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            # проверяем валидность данных
            serializer.is_valid(raise_exception=True)
            # сохраняем пользователя
            user = serializer.save()
            # проверяем что возвращаемый объект был экземпляром класса User, если нет, выдаём ошибку
            if not isinstance(user, User):
                raise ValueError("Создаваемый объект не пользователь!")
        except Exception as error:
            return Response({'detail': str(error)}, status=status.HTTP_400_BAD_REQUEST)

        response_data = {
            'message': 'Успешная регистрация',
            'user': UserSerializer(user).data,
        }
        return JsonResponse(response_data, status=status.HTTP_201_CREATED)


@csrf_exempt
def user_login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)

        if user:
            login(request, user)
            response_data = {
				'message': 'Успешная авторизация',
				'user': {
					'id': user.id,
					'username': user.username,
					'email': user.email,
					'is_superuser': user.is_superuser,
					'is_authenticated': user.is_authenticated,
					'is_staff': user.is_staff,
					'folder_name': user.folder_name,
				},
			}
            return JsonResponse(response_data, status=status.HTTP_200_OK)
        else:
            response_data = {
				'message': 'Неверный логин или пароль',
			}
            return JsonResponse(response_data, status=status.HTTP_401_UNAUTHORIZED)
    else:
        response_data = {
			'message': 'Метод не поддерживается',
		}
        return JsonResponse(response_data, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@csrf_protect
def user_logout(request):
    try:
        logout(request)
        response_data = {
            'message': 'Вы вышли из аккаунта'
        }
        return JsonResponse(response_data, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        response_data = {
            'message': 'Вы не залогинены'
        }
        return JsonResponse(response_data, status=status.HTTP_302_OK)


class FileViewSet(viewsets.ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileSerializer

    def list_files_by_user(self, request, username=None):
        user = get_object_or_404(User, username=username)

        files = File.objects.filter(user=user)

        serializer = self.get_serializers(request, many=True)

        return Response(serializer.date, status=status.HTTP_200_OK)