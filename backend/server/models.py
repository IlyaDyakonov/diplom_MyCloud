from django.db import models
from django.utils.text import slugify
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.models import AbstractUser
from django.core.validators import FileExtensionValidator
from django.core.files.storage import FileSystemStorage
from uuid import uuid4
import os
from pathlib import Path


allowed_extensions = ['tiff', 'jpg', 'png', 'jpeg', 'pdf', 'doc', 'docx', 'gif']

class User(AbstractUser):
    username = models.CharField(verbose_name='Логин', max_length=30, unique=True) # логин пользователя
    email = models.EmailField(verbose_name='email адрес', max_length=100, unique=True) # электронная почта
    is_active = models.BooleanField(verbose_name='active', default=False) # активен ли пользователь
    is_superuser = models.BooleanField(default=False) # возможность редактирования
    folder_name = models.CharField(max_length=100, verbose_name="Папка пользователя", blank=True) # пусть к папке с файлами пользователя

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

def _create_directory_path(instance, filename):
    print(f'Вызов функции для сохранения файла.')
    # Если file_name уже существует, используется оно, иначе берется значение value
    name = instance.file_name or filename.name
    # Генерируется путь и имя файла с помощью метода created_path_and_file_name
    path, file_name = instance.created_path_and_file_name(instance.user.id, name)
    # Присваиваются значения атрибутам path и file_name объекта instance
    directory = os.path.dirname(f'uploads/{instance.user.folder_name}/{file_name}')
    print(f'instance.user.folder_name: {instance.user.folder_name}')
    print(f'Full directory path: {directory}')
    if not os.path.exists(directory):
        os.makedirs(directory)
        
    instance.path = path
    instance.file_name = file_name
    print(f'1 {directory}')
    print(f'2 {instance.path}')
    print(f'3 {instance.file_name}')
    return f'{directory}/{file_name}'  # Возвращаем путь для загрузки файла


class File(models.Model):
    file_name = models.CharField(verbose_name='Название файла', max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    file = models.FileField(
        upload_to=_create_directory_path,
        validators = [FileExtensionValidator(allowed_extensions),], 
        verbose_name='File',
        default='uploads/'
    )
    upload_date = models.DateField(verbose_name='Дата загрузки', auto_now_add=True)
    last_download_date = models.DateField(verbose_name='Дата последнего скачивания', null=True, blank=True)
    comment = models.CharField(verbose_name='Комментарий', max_length=255, default='', blank=True)
    size = models.IntegerField(verbose_name='Размер файла')
    path = models.CharField(verbose_name='Путь к файлу')
    unique_id = models.CharField(verbose_name='Уникальный идентификатор', max_length=50, unique=True, blank=True)

    def created_path_and_file_name(self, user_id, name):
        user = User.objects.get(id=user_id)
        _, file_name_only = os.path.split(name)
        base_name, extention = os.path.splitext(file_name_only)

        counter = 1
        unique_name = file_name_only
        print(f'extention: {extention}')
        print(f'unique_name: {unique_name}')
        # Проверка, существует ли файл с таким именем у пользователя, если да, то создаем уникальное имя
        while File.objects.filter(user=user_id, file_name=unique_name).exists():
            unique_name = f'{base_name}_{counter}{extention}'
            print(f"base_name: {base_name}, counter: {counter}, extention: {extention}")
            counter += 1

        path = f"uploads/{user.folder_name}/{unique_name}"
        file_name = unique_name
        print(f"код вызвался, путь: {path}, имя файла: {file_name}")
        return path, file_name

    def save(self, *args, **kwargs):
        print(f'ВРОДЕ ЭТА ХУЕТА ВЫЗЫВАЕТСЯ22222222222222222222222222')
        
        if not self.unique_id:
            self.unique_id = uuid4().hex  # Генерируем уникальный идентификатор для файла

        # Проверяем, есть ли расширение у файла
        if not Path(self.file_name).suffix:  
            extension = os.path.splitext(self.file.name)[1]  
            self.file_name = self.file_name + extension  

        # Генерируем путь для загрузки файла
        print(f'self.file_name: {self.file_name}')
        upload_path = _create_directory_path(self, self.file_name)
        print(f'генерация пути: {upload_path}')
        
        # Устанавливаем путь к файлу
        self.file.name = upload_path  # Устанавливаем имя файла в поле file
        print(f'Устанавливаем имя файла в поле file: {self.file.name}')
        super().save(*args, **kwargs)  # Сохраняем объект в базе данных
        print(f'Сохраняем объект в базе данных')
        # Теперь получаем размер файла после его сохранения
        # self.size = self.file.size
        print(f'Теперь получаем размер файла после его сохранения')
        # self.save(update_fields=['size'])  # Обновляем только поле size
        print(f'Обновляем только поле size')