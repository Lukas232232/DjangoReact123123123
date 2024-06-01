# ну вот так
from rest_framework import permissions
# from datetime import datetime, timezone, timedelta
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import *


class Uchastok_all_View(APIView):
    serializer_class = Uchastok_all_serializer
    #permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, pk=None):
        if pk:
            uchastoksMTR = DvishenieMTR.objects.filter(pk=pk)
            if not uchastoksMTR:
                return Response(
                    {'error': "Данной записи не найдено"},
                    status=404)
            allDvishenie = Uchastok_all_serializer(uchastoksMTR, many=True)
        else:
            uchastoksMTR = DvishenieMTR.objects.all()
            allDvishenie = Uchastok_all_serializer(uchastoksMTR, many=True)
        verbose_name = self.addVerboseName(DvishenieMTR)
        rudnik = Sklad.objects.all()
        rudnik = Sklad_serialize(rudnik, many=True)
        istochnik = Istochnik.objects.all()
        istochnik = Istochnik_serialize(istochnik, many=True)
        type_rabot = Type_rabot.objects.all()
        type_rabot = Type_rabot_serialize(type_rabot, many=True)
        user = UserAccount.objects.filter(pk=request.user.id)
        user = UserAccount_serializer(user, many=True)
        print(user.data)
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
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        mutable_data = request.data.copy()  # Создаем изменяемую копию request.data
        mutable_data['user'] = request.user.id  # Теперь мы можем добавить/изменить данные
        print(mutable_data)
        serializer = self.serializer_class(data=mutable_data)
        if serializer.is_valid():
            pass
            data = serializer.save()
            serializer_new = self.serializer_class(data)
            return Response({'success': serializer_new.data}, status=201)
        else:
            # ошибки сериализации передаем в ответ
            return Response({"errors": serializer.errors}, status=400)
        return Response({"ok": "ok"})

    def delete(self, request, pk, format=None):
        itemDelete = DvishenieMTR.objects.filter(pk=pk).first()
        if itemDelete:
            itemDelete.delete()
            # статус 204 не предпологает возврата ответа (не как 200 или 404)
            return Response(status=204)
        else:
            return Response({"error": "error"}, status=404)

    def patch(self, request, pk):
        item = DvishenieMTR.objects.filter(pk=pk).first()
        # print(request.data)
        # if item:
        #     return Response({"success": "ok"}, status=203)
        # else:
        #     return Response({"error": "Указанного pk не существует"}, status=404)

        if item:
            serializer = self.serializer_class(item, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=203)
            else:
                return Response({"errors": serializer.errors}, status=400)
        else:
            return Response({"error": "Указанного pk не существует"}, status=404)
