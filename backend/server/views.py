import os
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
from rest_framework.decorators import action
from rest_framework import permissions, viewsets, status
from rest_framework.parsers import MultiPartParser, FormParser

from .models import User, File
from .serializers import UserSerializer, FileSerializer

import json


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
        try:
            data = json.loads(request.body.decode('utf-8'))
            username = data.get('username')
            password = data.get('password')
            print('username', username)
            print('password', password)
            user = authenticate(request, username=username, password=password)
            print('user', user)
        except json.JSONDecodeError:
            return JsonResponse({'message': 'Невалидный JSON'}, status=status.HTTP_400_BAD_REQUEST)

        if user is not None:
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
            print('response', response_data)
            return JsonResponse(response_data, status=status.HTTP_200_OK)
        else:
            # Если пользователь не найден, возвращаем соответствующее сообщение
            return JsonResponse({'message': 'Неверный логин или пароль'}, status=status.HTTP_401_UNAUTHORIZED)

    elif request.method == 'GET':
        return JsonResponse({'message': 'GET-запрос не поддерживается для этого ресурса'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    # Возвращаем ответ для других методов
    return JsonResponse({'message': 'Метод не поддерживается'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

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
    permission_classes = [permissions.IsAuthenticated]

    # получение списка папок
    def list (self, request, folder_name, *args, **kwargs):
        if request.user.is_superuser:
            # есть ли folder_name в запросе
            if not folder_name:
                return Response({"message": "Не указан идентификатор хранилища"}, status=status.HTTP_400_BAD_REQUEST)
            # существует ли пользователь с указанным идентификатором хранилища
            try:
                user = User.object.get(folder_name=folder_name)
            except User.DoesNotExist:
                return Response({"message": "Пользователь с указанным идентификатором хранилища не найден"},
								status=status.HTTP_404_NOT_FOUND)
            # Получаем список файлов для указанного пользователя
            queryset = File.object.filter(user=user) 
        else:
            # Если пользователь не администратор, получаем список файлов только для текущего пользователя
            queryset = File.objects.filter(user=request.user)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # @action(detail=False, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def create (self, request, *args, **kwargs):
        serializer = FileSerializer(data=request.data)
        if serializer.is_valid():
            file_instance = serializer.save(user=request.user)
            return Response(FileSerializer(file_instance).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, pk=None, *args, **kwargs):
        file_instance = self.queryset.filter(user=request.user, pk=pk).first()
        if not file_instance:
            return Response({"message": "Файл не найден"}, status=status.HTTP_404_NOT_FOUND)
        serializer = FileSerializer(file_instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy (self, request, pk=None, *args, **kwargs):
        file_instance = self.queryset.filter(user=request.user, pk=pk).first()
        if not file_instance:
            return Response({"message": "Файл не найден"}, status=status.HTTP_404_NOT_FOUND)
        file_path = file_instance.path
        if file_path and os.path.isfile(f"storage/{file_path}"):
            try:
                os.remove(f"storage/{file_path}")
            except OSError as error:
                return Response({"message": f"Ошибка при удалении файла: {error}"},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        file_instance.delete()
        return Response({"message": "Файл успешно удален"}, status=status.HTTP_204_NO_CONTENT)
