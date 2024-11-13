from django.db import models
from django.utils.text import slugify
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.models import AbstractUser
from django.core.validators import FileExtensionValidator
from django.core.files.storage import FileSystemStorage
from django.conf import settings
from uuid import uuid4
import os
from pathlib import Path


allowed_extensions = ['tiff', 'jpg', 'png', 'jpeg', 'pdf', 'doc', 'docx', 'gif', 'exe']

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
    """Генерация пути и создание директории для пользователя внутри `uploads`."""
    print(f'Вызов функции для сохранения файла!!!!!!!!')

    # Только пользовательская папка будет добавляться к "uploads"
    user_folder = instance.user.folder_name
    user_name = filename
    print(f'Создаем user_name: {user_name}')
    print(f'Создаем user_folder: {user_folder}')
    
    # Относительный путь для сохранения файла (без лишнего "uploads")
    # relative_path = os.path.join(user_folder)  # Теперь просто "user_folder"
    # print(f'Создаем директорию relative_path: {relative_path}')
    # Полный путь внутри MEDIA_ROOT (с "uploads")
    full_path = os.path.join(settings.MEDIA_ROOT, user_folder)  # "uploads" добавляется здесь
    os.makedirs(full_path, exist_ok=True)

    print(f'Создаем директорию: {full_path}')
    print(f'Имя файла для сохранения: {filename}')

    # Возвращаем путь от "uploads" (относительный)
    return os.path.join(user_folder, filename)


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

        path = f"{user.folder_name}/"
        file_name = unique_name
        print(f"код вызвался, путь: {path}, имя файла: {file_name}")
        return path, file_name

    def save(self, *args, **kwargs):
        print(f'Запуск метода save для {self.file_name}')
        
        # Проверка, вызывается ли сохранение при обновлении файла
        if not self.pk:  # если это новое создание записи
            # Генерация уникального идентификатора
            if not self.unique_id:
                self.unique_id = uuid4().hex
            print(f"self.pk1111111: {self.pk}")
            # Проверка расширения файла
            if not Path(self.file_name).suffix:
                extension = os.path.splitext(self.file.name)[1]
                self.file_name = f"{self.file_name}{extension}"

            # Установка пути и имени файла
            self.path, unique_file_name = self.created_path_and_file_name(self.user.id, self.file_name)
            self.file.name = unique_file_name  # Уникальное имя файла
            print(f'Полный путь для сохранения: {self.path}')
        else:
            print(f"self.pk22222222: {self.__dict__}")
            # Если это обновление записи, путь и имя файла не меняются
            print(f'Обновление записи без изменения пути и имени файла.')

        # Вызов оригинального метода `save` для завершения сохранения
        try:
            super().save(*args, **kwargs)
            print(f'Файл {self.file.name} успешно сохранен.')
        except Exception as e:
            print(f'Ошибка при сохранении файла: {e}')
    # def save(self, *args, **kwargs):
    #     print(f'Запуск метода save для {self.file_name}')

    #     # Генерация уникального идентификатора, если его нет
    #     if not self.unique_id:
    #         self.unique_id = uuid4().hex

    #     # Проверка расширения файла
    #     if not Path(self.file_name).suffix:
    #         extension = os.path.splitext(self.file.name)[1]
    #         self.file_name = f"{self.file_name}{extension}"

    #     # Создаем относительный путь для сохранения файла (без дублирования `uploads`)
    #     # self.path, unique_file_name = self.created_path_and_file_name(self.user.id, self.file_name)
    #     # print(f'Полный путь для unique_file_name: {unique_file_name}')
    #     print(f'self.file_name: {self.file_name}')
    #     # ПОНЯТЬ ПОЧЕМУ ТУТ ОН МЕНЯЕТ ПУТЬ ПРИ СОХРАНЕНИИ
    #     self.file.name = self.file_name
    #     print(f'Полный путь для сохранения: {self.path}')
    #     print(f'Файл для записи: {self.file.name}')

    #     try:
    #         super().save(*args, **kwargs)
    #         print(f'Файл {self.file.name} успешно сохранен.')

    #     except Exception as e:
    #         print(f'Ошибка при сохранении файла: {e}')
