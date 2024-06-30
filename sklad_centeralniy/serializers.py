from rest_framework import serializers

from sklad_uchastok.models import Type_rabot, Istochnik
from .models import *
from accounts.models import UserAccount
from datetime import datetime


class Istochnik_serialize(serializers.ModelSerializer):
    class Meta:
        model = Istochnik
        fields = '__all__'


class Sklad_serialize(serializers.ModelSerializer):
    class Meta:
        model = Sklad
        fields = '__all__'


class TypePostupleniya_serialize(serializers.ModelSerializer):
    class Meta:
        model = TypePostupleniya
        fields = '__all__'


class Naryd_zakaz_serialize(serializers.ModelSerializer):
    class Meta:
        model = Naryd_zakaz
        fields = '__all__'


class Dogovor_serialize(serializers.ModelSerializer):
    class Meta:
        model = Dogovor
        fields = '__all__'


class UserAccount_serializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccount
        fields = ('id', 'name', 'email')


class SpravochnikOborudovaniya_serializer(serializers.ModelSerializer):
    class Meta:
        model = SpravochnikOborudovaniya
        fields = "__all__"


class Sklad_all_serializer(serializers.ModelSerializer):
    # rudnik = Sklad_serialize()
    # istochnik = Istochnik_serialize()
    # type_rabot = Type_rabot_serialize()
    # user = UserAccount_serializer()
    # enc = SpravochnikOborudovaniya_serializer()
    enc_enc = serializers.CharField(read_only=True)
    enc_name = serializers.CharField(read_only=True)

    class Meta:
        model = DvishenieSkladMagaz
        fields = '__all__'

    def validate_count(self, value):
        print(123)
        errors = []

        if value <= 0:
            errors.append("Необходимо ввести число больше 0")

        if value > 4000:
            errors.append("Необходимо ввести число меньше 4000")

        if errors:
            raise serializers.ValidationError(errors)
        return value

    def validate(self, data):
        print(data)
        # обрабатываем данные для поля ITOG_COUNT
        type_dvisheniya = data.get('type_dvisheniya')
        current_count = data.get('count')
        # Допустим, у вас есть доступ к self.instance для получения текущего значения itog_count
        # Если создается новая запись, self.instance будет None
        # current_itog_count = self.instance.itog_count if self.instance else None

        # Теперь вы можете выполнить проверку или обработку
        if type_dvisheniya and current_count:
            if type_dvisheniya == 'Приход':
                data['itog_count'] = current_count  # Пример обработки
            else:
                data['itog_count'] = int(current_count) * (-1)
        return data
