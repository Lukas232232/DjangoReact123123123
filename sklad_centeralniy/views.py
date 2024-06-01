from django.shortcuts import render
from rest_framework import permissions
# from datetime import datetime, timezone, timedelta
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import *
from sklad_uchastok.models import SpravochnikOborudovaniya, Sklad


class Centeraln_all_View(APIView):
    serializer_class = Sklad_all_serializer
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, pk=None):
        if pk:
            SkladMtr = DvishenieSkladMagaz.objects.filter(pk=pk)
            if not SkladMtr:
                return Response(
                    {'error': "Данной записи не найдено"},
                    status=404)
            SkladMtr = Sklad_all_serializer(SkladMtr, many=True)
        else:
            SkladMtr = DvishenieSkladMagaz.objects.all()
            SkladMtr = Sklad_all_serializer(SkladMtr, many=True)

        verbose_name = self.addVerboseName(DvishenieSkladMagaz)

        rudnik = Sklad.objects.all()
        rudnik = Sklad_serialize(rudnik, many=True)

        enc = SpravochnikOborudovaniya.objects.all()
        enc = Sklad_serialize(enc, many=True)

        type_postupleniya = TypePostupleniya.objects.all()
        type_postupleniya = TypePostupleniya_serialize(type_postupleniya, many=True)

        nomer_zakaza = Naryd_zakaz.objects.all()
        nomer_zakaza = Naryd_zakaz_serialize(nomer_zakaza, many=True)

        nomer_dogovora = Dogovor.objects.all()
        nomer_dogovora = Dogovor_serialize(nomer_dogovora, many=True)

        user = UserAccount.objects.filter(pk=request.user.id)
        user = UserAccount_serializer(user, many=True)

        spravochnikOborudovanya = SpravochnikOborudovaniya.objects.all()
        spravochnikOborudovanya = SpravochnikOborudovaniya_serializer(spravochnikOborudovanya, many=True)
        return Response(
            {
                "allSklad": SkladMtr.data,
                "rudnik": rudnik.data,
                "enc": spravochnikOborudovanya.data,
                "type_postupleniya": type_postupleniya.data,
                "nomer_zakaza": nomer_zakaza.data,
                "nomer_dogovora": nomer_dogovora.data,
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
