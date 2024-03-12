from rest_framework import permissions
# from datetime import datetime, timezone, timedelta
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import UserAccount
from .models import *
from .serializers import *


class Uchastok_all_View(APIView):
    serializer_class = Uchastok_all_serializer
    permission_classes = (permissions.IsAuthenticated,)

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
        user = UserAccount.objects.all()
        user = UserAccount_serializer(user, many=True)
        spravochnikOborudovanya = SpravochnikOborudovaniya.objects.all()
        spravochnikOborudovanya = SpravochnikOborudovaniya_serializer(spravochnikOborudovanya, many=True)
        return Response(
            {
                "allDvishenie": allDvishenie.data,
                "rudnik": rudnik.data,
                "istochnik": istochnik.data,
                "type_rabot": type_rabot.data,
                "enc": spravochnikOborudovanya.data,
                "user": user.data,
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


class Uchastok_create_View(APIView):
    serializer_class = Uchastok_all_serializer
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            data = serializer.save()
            serializer2 = self.serializer_class(data)
            return Response({'success': serializer2.data}, status=201)
        else:
            # ошибки сериализации передаем в ответ
            return Response({"errors": serializer.errors}, status=400)
