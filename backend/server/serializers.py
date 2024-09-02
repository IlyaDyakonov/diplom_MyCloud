from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from .models import User, File


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'password',
            'last_login',
            'is_superuser',
            'username',
            'is_staff',
            'date_joined',
            'email',
            # 'first_name',
            # 'last_name',
            'is_active',
            'folder_name',
        ]

    def create(self, validated_date):
        validated_date['password'] = make_password(validated_date['password'])
        return super().create(validated_date)
    
    def update(self, instance, validated_date):
        if 'password' in validated_date:
            validated_date['password'] = make_password(validated_date['password'])
        return super().update(instance, validated_date)


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = [
            'id',
            'file_name',
            'upload_date',
            'size',
            'path',
            'unique_id',
            'user_id'
        ]

    # проверяем, есть ли уже файл с таким же именем
    def validate(self, attributes):
        name = attributes.get('file_name')
        user_id = self.instance.user.id if self.instance else attributes['user'].id
        if File.objects.filter(user=user_id, file_name=name).exists():
            final_file_name = name or attributes['file'].name
            path, file_name = File().created_path_and_file_name(user_id, final_file_name)
            attributes['path'] = path
            attributes['file_name'] = file_name
        return attributes

    # создание файла
    def create(self, validated_date):
        # instance = File(**validated_date)
        # instance.save()
        # return instance
        return super().create(validated_date)

    # обновление файла
    def update(self, instance, validated_date):
        for attributes, value in validated_date.items():
            if attributes == 'file' and instance.file and instance.file.name != value.name:
                instance.file = value
                instance.size = value.size
            else:
                setattr(instance, attributes, value)
        instance.save()
        return instance