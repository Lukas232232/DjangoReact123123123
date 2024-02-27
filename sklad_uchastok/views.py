from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework import permissions
#from datetime import datetime, timezone, timedelta
from django.core.serializers import serialize
from django.core.exceptions import ValidationError
from rest_framework import status
from .serializers import *
from .models import *


class Uchastok_all_View(APIView):
    serializer_class = Uchastok_all_serializer
    permission_classes = (permissions.IsAuthenticated, )

    def get(self, request, *args, **kwargs):
        uchastoksMTR = DvishenieMTR.objects.all()
        allDvishenie = Uchastok_all_serializer(uchastoksMTR, many=True)
        verbose_name = self.addVerboseName(DvishenieMTR)
        rudnik = Sklad.objects.all()
        rudnik = Sklad_serialize(rudnik, many=True)
        istochnik = Istochnik.objects.all()
        istochnik = Istochnik_serialize(istochnik, many=True)
        type_rabot = Type_rabot.objects.all()
        type_rabot = Type_rabot_serialize(type_rabot, many=True)
        return Response(
            {
                "allDvishenie": allDvishenie.data,
                "rudnik": rudnik.data,
                "istochnik": istochnik.data,
                "type_rabot": type_rabot.data,
                "verbose_name": verbose_name,
            },
            status=200)

    def addVerboseName(self, model):
        # Добавляем поле Verbose_name как словарь где ключ это имя поля
        fields = model._meta.get_fields()
        # Сбор verbose_name каждого поля в список
        verbose_names = [{
            field.name: field.verbose_name
        } for field in fields if hasattr(field, 'verbose_name')]
        return verbose_names
