from django.db import models
from django.utils.text import slugify
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.models import AbstractUser
from django.core.validators import FileExtensionValidator
from uuid import uuid4
import os
from pathlib import Path


allowed_extensions = ['tiff', 'jpg', 'png', 'jpeg', 'pdf', 'doc', 'docx', 'gif']

class User(AbstractUser):
    username = models.CharField(verbose_name='Логин', max_length=30, unique=True)
    email = models.EmailField(verbose_name='email адрес', max_length=100, unique=True)
    first_name = models.CharField(verbose_name='Имя', max_length=30, blank=False)
    last_name = models.CharField(verbose_name='Фамилия', max_length=30, blank=False)
    is_active = models.BooleanField(verbose_name='active', default=False) # активен ли пользователь
    is_superuser = models.BooleanField(default=False) # редактирование
    folder_name = models.CharField(max_length=100, verbose_name="Папка пользователя", blank=True)

    def save(self, *args, **kwargs):
        if not self.folder_name:
            self.folder_name = f'{self.username}_folder'
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username
    
    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = "Список пользователей"
        ordering = ('id', 'username',)

def _create_directory_path(instance, value):
    # Если file_name уже существует, используется оно, иначе берется значение value
    name = instance.file_name or value
    # Генерируется путь и имя файла с помощью метода created_path_and_file_name
    path, file_name = instance.created_path_and_file_name(instance.user.id, name)
    # Присваиваются значения атрибутам path и file_name объекта instance
    instance.path = path
    instance.file_name = file_name
    return path  # Возвращаем путь для загрузки файла


class File(models.Model):
    file_name = models.CharField(verbose_name='Название файла', max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    file = models.FileField(
        upload_to=_create_directory_path,
        validators = [
            FileExtensionValidator(allowed_extensions),
        ], 
        verbose_name='File',
        default='uploads/'
    )
    upload_date = models.DateField(verbose_name='Дата загрузки', auto_now_add=True)
    size = models.IntegerField(verbose_name='Размер файла')
    path = models.CharField(verbose_name='Путь к файлу')
    unique_id = models.CharField(verbose_name='Уникальный идентификатор', max_length=50, unique=True, blank=True)

    def created_path_and_file_name(self, user_id, name):
        user = User.objects.get(id=user_id)
        _, file_name_only = os.path.split(name)
        base_name, extention = os.path.splitext(file_name_only)

        counter = 1
        unique_name = file_name_only

        # Проверка, существует ли файл с таким именем у пользователя, если да, то создаем уникальное имя
        while File.objects.filter(user=user_id, file_name=unique_name).exists():
            unique_name = f'{base_name}_{counter}{extention}'
            counter += 1
        
        path = f"{user.folder_name}/{unique_name}"
        file_name = unique_name
        return path, file_name

    def save(self, *args, **kwargs):
        if not self.unique_id:
            self.unique_id = uuid4().hex  # Генерируем уникальный идентификатор для файла
        name = self.file_name or self.file.name
        if not Path(name).suffix:  # Проверяем, есть ли расширение у файла
            extention = os.path.splitext(self.file.name)[1]  # Исправлено: правильно извлекаем расширение из имени файла
            self.file_name = self.file_name + extention  # Добавляем расширение к имени файла, если его нет
        if self.file:
            self.size = self.file.size  # Устанавливаем размер файла
            super().save(*args, **kwargs)  # Сохраняем объект в базе данных