import os
from venv import logger
from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.http import FileResponse, JsonResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie, csrf_protect
from django.shortcuts import render, redirect
from django.shortcuts import get_object_or_404
from django.middleware.csrf import get_token
from django.contrib import messages
from django.urls import reverse
from django.contrib.auth.forms import AuthenticationForm
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework import permissions, viewsets, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from .models import User, File
from .serializers import UserSerializer, FileSerializer
from datetime import date

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
            token, _ = Token.objects.get_or_create(user=user)
        except Exception as error:
            return Response({'detail': str(error)}, status=status.HTTP_400_BAD_REQUEST)

        response_data = {
            'message': 'Успешная регистрация',
            'user': UserSerializer(user).data,
            'token': token.key,
        }
        return JsonResponse(response_data, status=status.HTTP_201_CREATED)


@csrf_exempt
def user_login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            username = data.get('username')
            password = data.get('password')
            user = authenticate(request, username=username, password=password)
        except json.JSONDecodeError:
            return JsonResponse({'message': 'Невалидный JSON'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_from_db = User.objects.get(username=username)
            if not user_from_db.is_active:
                user_from_db.is_active = True  # Устанавливаем флаг активности
                user_from_db.save()  # Сохраняем изменения в базе данных
            user = authenticate(request, username=username, password=password)
            if user:
                login(request, user)

                token, created = Token.objects.get_or_create(user=user)
                if not created:
                    token.delete()  # Удаляем старый токен
                    token = Token.objects.create(user=user)  # Создаём новый токен

                response_data = {
                    'message': 'Успешная авторизация',
                    'token': token.key,
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'is_superuser': user.is_superuser,
                        'is_active': user.is_active,
                        'is_staff': user.is_staff,
                        'folder_name': user.folder_name,
                    },
                }
                return JsonResponse(response_data, status=status.HTTP_200_OK)

            else:
                # Если пользователь не найден, возвращаем соответствующее сообщение
                return JsonResponse({'message': 'Неверный логин или пароль'}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return JsonResponse({'message': 'Пользователь не найден'}, status=status.HTTP_404_NOT_FOUND)
    elif request.method == 'GET':
        return JsonResponse({'message': 'GET-запрос не поддерживается для этого ресурса'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    # Возвращаем ответ для других методов
    return JsonResponse({'message': 'Метод не поддерживается'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@ensure_csrf_cookie
def user_logout(request):
    if request.method == 'POST':
        try:
            if not request.body:
                return JsonResponse({'message': 'Пустое тело запроса'}, status=status.HTTP_400_BAD_REQUEST)

            data = json.loads(request.body.decode('utf-8'))
            username = data.get('username')
            
            user_from_db = User.objects.get(username=username)
            user_from_db.is_active = False  # Устанавливаем флаг активности
            user_from_db.save()  # Сохраняем изменения в базе данных
            
            logout(request)
            response_data = {'message': 'Вы вышли из аккаунта'}
            print('вы разлогинились')
            return JsonResponse(response_data, status=status.HTTP_200_OK)


        except json.JSONDecodeError:
            return JsonResponse({'message': 'Невалидный JSON'}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return JsonResponse({'message': 'Пользователь не найден'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return JsonResponse({'message': 'Произошла ошибка при выходе из аккаунта', 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return JsonResponse({'message': 'Метод не поддерживается'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


class FileViewSet(viewsets.ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    permission_classes = [permissions.IsAuthenticated]


    # получение списка папок
    def list(self, request, folder_name=None, *args, **kwargs):
        user_id = request.query_params.get('user_id')

        # Если админ запрашивает все файлы
        if request.user.is_superuser and not user_id and not folder_name:
            queryset = File.objects.all()

        # Если указан `user_id`, получаем файлы этого пользователя
        elif user_id:
            queryset = File.objects.filter(user_id=user_id)

        # Если указан `folder_name`, получаем файлы по имени папки
        elif folder_name:
            try:
                user = User.objects.get(folder_name=folder_name)
                queryset = File.objects.filter(user=user)
            except User.DoesNotExist:
                return Response({"message": "Пользователь с указанным идентификатором хранилища не найден"},
                                status=status.HTTP_404_NOT_FOUND)
        
        # Иначе возвращаем файлы для текущего пользователя
        else:
            queryset = File.objects.filter(user=request.user)

        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # @action(detail=False, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def create (self, request, *args, **kwargs):
        # serializer = FileSerializer(data=request.data)
        # print(f"Файл получен: {request.FILES}")  # Проверьте, что файл действительно передаётся
        data = request.data.copy()
        file = request.FILES.get('file')
        print("Все файлы в запросе:", request.FILES)  # Логируем все файлы в запросе
        if file:
            data['file'] = file
            print("Тип файла:", type(file))  # Должно быть <class 'django.core.files.uploadedfile.InMemoryUploadedFile'>
            print("Размер файла:", file.size)  # Проверьте, что размер файла соответствует оригиналу
        print(f"Файл получен data: {data}")
        print(f"Файл получен file: {file}")
        print("Получен файл:", request.FILES.get('file'))
        serializer = FileSerializer(data=data, context={'request': request})  # Передайте файлы для сохранения

        if serializer.is_valid():
            file_instance = serializer.save(user=request.user)
            print(f"отправляем в сериалайзер! {file_instance}")
            return Response(FileSerializer(file_instance).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        serializer = FileSerializer(data=request.data)
        data = {}
        if serializer.is_valid():
            serializer.create(user_id=request.user.id, file=request.FILES['file'])
            data = self.get_queryset().values('id', 'user__username', 'size', 'native_file_name', 'upload_date', 'last_download_date', 'comment')
            return Response(data, status=status.HTTP_200_OK) 
        data = serializer.errors
        return Response(data)


    def update(self, request, pk=None, *args, **kwargs):
        file_instance = self.queryset.filter(user=request.user, pk=pk).first()
        if not file_instance:
            return Response({"message": "Файл не найден"}, status=status.HTTP_404_NOT_FOUND)
        serializer = FileSerializer(file_instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None, *args, **kwargs):
        # Получаем экземпляр файла по user и pk
        file_instance = self.queryset.filter(user=request.user, pk=pk).first()
        if not file_instance:
            return Response({"message": "Файл не найден"}, status=status.HTTP_404_NOT_FOUND)
        
        # Формируем полный путь к файлу
        # Здесь мы используем file_instance.file.name для получения имени файла
        file_path = os.path.join(settings.MEDIA_ROOT, file_instance.file.name)  # Изменено: используем имя файла из поля file
        file_path = os.path.normpath(file_path)  # Нормализуем путь
        print(f'file_path: {file_path}')
        
        # Проверяем существование файла и удаляем его
        if os.path.isfile(file_path):
            print(f"тык тык")
            try:
                os.remove(file_path)  # Удаляем файл по правильному пути
                print(f"Файл {file_path} успешно удалён из хранилища.")
            except OSError as error:
                return Response({"message": f"Ошибка при удалении файла: {error}"},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Удаляем запись из базы данных
        file_instance.delete()
        print(f"Файл {file_path} успешно удалён из хранилища.")  # Это сообщение теперь будет точным
        return Response({"message": "Файл успешно удален"}, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_link(request):
    user_id = request.user.id
    file_id = request.query_params['file_id']
    print(f"request.user.is_staff: {request.user.is_staff}")
    if request.user.is_staff:
        file = File.objects.filter(id=file_id).first()
    else:
        file = File.objects.filter(user_id=user_id).filter(id=file_id).first()
    
    if file:
        data = {
            'link': file.unique_id,
        }

        return Response(data, status=status.HTTP_200_OK)

    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def get_file(request, link):
    file = File.objects.filter(unique_id=link).first()

    if file:
        # Формируем полный путь к файлу
        file_path = os.path.join(settings.MEDIA_ROOT, file.file.name)  
        print(f"file path1: {file_path}")
        file_path = os.path.normpath(file_path)
        
        logger.info(f"Attempting to access file at: {file_path}")

        if not os.path.isfile(file_path):
            logger.error(f"Файл не найден по пути: {file_path}")
            return Response({"message": "Файл не найден"}, status=status.HTTP_404_NOT_FOUND)

        try:
            # Обновляем только поле last_download_date без вызова save()
            File.objects.filter(id=file.id).update(last_download_date=date.today())

            # Отправляем файл как ответ
            print(f"file.file_name: {file.file_name}")
            return FileResponse(open(file_path, 'rb'), status=status.HTTP_200_OK, as_attachment=True, filename=file.file_name)
        except PermissionError as e:
            logger.error(f"Ошибка доступа к файлу: {e}")
            return Response({"message": f"Ошибка доступа к файлу: {e}"}, status=status.HTTP_403_FORBIDDEN)
        except Exception as e:
            logger.error(f"Ошибка при отправке файла: {e}")
            return Response({"message": f"Ошибка при отправке файла: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(status=status.HTTP_404_NOT_FOUND)