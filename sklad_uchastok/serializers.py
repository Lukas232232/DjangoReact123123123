from rest_framework import serializers
from .models import *
from accounts.models import UserAccount


class Istochnik_serialize(serializers.ModelSerializer):
    class Meta:
        model = Istochnik
        fields = '__all__'


class Sklad_serialize(serializers.ModelSerializer):
    class Meta:
        model = Sklad
        fields = '__all__'


class Type_rabot_serialize(serializers.ModelSerializer):
    class Meta:
        model = Type_rabot
        fields = '__all__'


class UserAccount_serializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccount
        fields = ('id', 'name', 'email')


class SpravochnikOborudovaniya_serializer(serializers.ModelSerializer):
    class Meta:
        model = SpravochnikOborudovaniya
        fields = "__all__"

class Uchastok_all_serializer(serializers.ModelSerializer):
    # rudnik = Sklad_serialize()
    # istochnik = Istochnik_serialize()
    # type_rabot = Type_rabot_serialize()
    # user = UserAccount_serializer()
    # enc = SpravochnikOborudovaniya_serializer()
    class Meta:
        model = DvishenieMTR
        fields = '__all__'

    def validate_count(self, value):
        if value <= 0:
            raise serializers.ValidationError("Необходимо ввести число больше 0")
        if value >= 4000:
            raise serializers.ValidationError("Необходимо ввести число меньше 4000")
        return value

    def validate(self, data):
        # обрабатываем данные для поля ITOG_COUNT
        type_dvisheniya = data.get('type_dvisheniya')
        current_count = data.get('count')
        # Допустим, у вас есть доступ к self.instance для получения текущего значения itog_count
        # Если создается новая запись, self.instance будет None
        # current_itog_count = self.instance.itog_count if self.instance else None

        # Теперь вы можете выполнить проверку или обработку
        if type_dvisheniya == 'Приход':
            data['itog_count'] = current_count  # Пример обработки
        else:
            data['itog_count'] = int(current_count) * (-1)
        return data
