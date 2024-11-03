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
            'user_id',
            'file'
        ]

    # проверяем, есть ли уже файл с таким же именем
    def validate(self, attributes):
        print('ВыЗыВаЕтСя! validate!!!!!')
        print(f'attributes1: {attributes}')
        name = attributes.get('file_name')
        print('валидация имя файла:', name)
        # user_id = self.instance.user.id if self.instance else attributes['user_id']
        # if File.objects.filter(user=user_id, file_name=name).exists():
        #     final_file_name = name or attributes['file'].name
        #     path, file_name = File().created_path_and_file_name(user_id, final_file_name)
        #     attributes['path'] = path
        #     attributes['file_name'] = file_name
        # return attributes
    
            # Используем либо `self.instance`, либо `request.user`
        user_id = attributes.get('user_id')
        print('Проверка user_id1:', user_id)
        if not user_id and 'request' in self.context:
            user_id = self.context['request'].user.id  # Получаем пользователя из запроса
            print('Проверка user_id2:', user_id)

        # Проверяем наличие файла с таким же именем
        print("11111111111111111", File.objects.filter(user=user_id, file_name=name).exists())
        print(f'attributes2: {attributes}')
        print('Проверка имени файла:', name)

        # Генерируем новое имя файла, если файл с таким именем уже существует
        if File.objects.filter(user=user_id, file_name=name).exists():
            final_file_name = name or attributes['file'].name

            if final_file_name:
                # Генерируем путь для нового имени файла
                path, file_name = File().created_path_and_file_name(user_id, final_file_name)
                attributes['path'] = path
                attributes['file_name'] = file_name
                print('проверка user_id3:', user_id)
                print('Имя файла изменено на:', file_name)
            else:
                print("Имя файла не указано и не передано в запросе.")
        else:
            final_file_name = name or attributes['file'].name
            path, file_name = File().created_path_and_file_name(user_id, final_file_name)
            print('проверка user_id4:', user_id)
            print('Имя файла осталось такое же:', file_name)
            attributes['path'] = path
            attributes['file_name'] = file_name
        print(f'attributes3: {attributes}')
        return attributes

    # создание файла
    def create(self, validated_datа):
        print(f'validated_datа: {validated_datа}')
        user = validated_datа.get('user_id')
        file_name = validated_datа.get('file_name')
        existing_file = File.objects.filter(user=user, file_name=file_name).first()

        if existing_file:
            # Если объект существует, обновляем его поля, если нужно
            for key, value in validated_datа.items():
                setattr(existing_file, key, value)
            existing_file.save()
            return existing_file
        else:
            # Если объект не существует, создаем новый
            file_instance = File.objects.create(**validated_datа)
            return file_instance
        # file_instance = File.objects.create(**validated_datа)
        # print('ВыЗыВаЕтСя! create11111')
        # print(f'ВыЗыВаЕтСя! {file_instance}')
        # # Теперь объект существует и можно вызвать метод created_path_and_file_name
        # # file_instance.path = file_instance.created_path_and_file_name(
        # #     user_id=file_instance.user.id,
        # #     name=file_instance.file_name)
        # # Сохраняем объект с обновлённым путём
        # file_instance.save()
        # return file_instance

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