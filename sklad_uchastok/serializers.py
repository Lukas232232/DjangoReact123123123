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
