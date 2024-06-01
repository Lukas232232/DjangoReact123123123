from django.db import models

from accounts.models import UserAccount
from sklad_uchastok.models import SpravochnikOborudovaniya, Sklad


class TypePostupleniya(models.Model):
    name = models.CharField(max_length=255)
    def __str__(self):
        return self.name

class Postavshik(models.Model):
    name = models.CharField(max_length=255)
    def __str__(self):
        return self.name

class StatusPostavki(models.Model):
    name = models.CharField(max_length=255)
    def __str__(self):
        return self.name
class Status_narydZakaz(models.Model):
    name = models.CharField(max_length=255)
    def __str__(self):
        return self.name

class Dogovor(models.Model):
    Valyta = (
        (
            'долларах',
            'долларах',
        ),  # Первое значение и его отображаемое имя
        (
            'евро',
            'евро',
        ),
        (
            'рублях',
            'рублях',
        ),  # Первое значение и его отображаемое имя
        (
            'фунтах-стерлингах',
            'фунтах-стерлинга',
        ),
    )
    NDS = (
        (
            '0',
            '0',
        ),  # Первое значение и его отображаемое имя
        (
            '20%',
            '20%',
        ),
    )
    nomer_dogovora = models.CharField(max_length=255)
    kratkoe_opisanie = models.CharField(max_length=255)
    date_formir_proekta = models.DateField(auto_now_add=True, blank=True, null=True, verbose_name="Дата формирования проекта")
    date_podpis_proekta = models.DateField(blank=True, null=True, verbose_name="Дата подписания проекта")
    kontragent = models.ForeignKey(Postavshik, on_delete=models.CASCADE, blank=True, null=True,
                                   verbose_name="Контрагент")
    valyta = models.CharField(max_length=30, choices=Valyta, blank=True, null=True, verbose_name="Валюта")
    nds = models.CharField(max_length=30, choices=NDS, blank=True, null=True)

    def __str__(self):
        return self.nomer_dogovora

class Naryd_zakaz(models.Model):
    nomer_Zakaz_naryd = models.CharField(max_length=255, verbose_name="№ заказ-наряда", unique=True)
    nomer_document = models.CharField(max_length=255, verbose_name="№ документа", unique=True)
    date_sozdaniya = models.DateField(blank=True, null=True, verbose_name="Дата создания")
    date_otpravki = models.DateField(blank=True, null=True, verbose_name="Дата отправки")
    date_podpisaniy = models.DateField(blank=True, null=True, verbose_name="Дата подписания")
    date_zakritiy = models.DateField(blank=True, null=True, verbose_name="Дата закрытия")
    status = models.ForeignKey(Status_narydZakaz, on_delete=models.CASCADE, verbose_name="Статус")
    nomer_dogovora = models.ForeignKey(Dogovor, on_delete=models.CASCADE, verbose_name="№ Договора")
    postavshik = models.ForeignKey(Postavshik, on_delete=models.CASCADE, verbose_name="Постовщик")
    comment = models.TextField(blank=True, null=True, verbose_name="Комментарий")
    status_postavki = models.ForeignKey(StatusPostavki, on_delete=models.CASCADE, verbose_name="Статус поставки",
                                       null=True, blank=True)
    type_postupleniya = models.ForeignKey(TypePostupleniya, on_delete=models.CASCADE, verbose_name="Тип поступления")

    def __str__(self):
        return self.nomer_Zakaz_naryd
class DvishenieSkladMagaz(models.Model):
    TYPE_DVISHEN = (
        (
            'Приход',
            'Приход',
        ),  # Первое значение и его отображаемое имя
        (
            'Расход',
            'Расход',
        ),
        (
            'Выдан',
            'Выдан',
        ),  # Первое значение и его отображаемое имя
    )

    my_date = models.DateField(verbose_name="Дата")
    date_vipuska = models.CharField(max_length=100, verbose_name="Дата выпуска")
    enc = models.ForeignKey(SpravochnikOborudovaniya,
                            on_delete=models.DO_NOTHING,
                            verbose_name="ЕНС")
    count = models.IntegerField(default=0, verbose_name="Количество")
    comment = models.TextField(blank=True, null=True, verbose_name="Комментарий")
    user = models.ForeignKey(UserAccount,
                             null=True, blank=True,
                             on_delete=models.DO_NOTHING,
                             verbose_name="Пользователь")
    type_dvisheniya = models.CharField(max_length=50,
                                       choices=TYPE_DVISHEN,
                                       verbose_name="Тип движения")
    peredano = models.ForeignKey(Sklad,
                                 on_delete=models.DO_NOTHING,
                                 verbose_name="Рудник/Склад")
    itog_count = models.IntegerField(null=True,
                                     blank=True,
                                     verbose_name="Вычисляемое количество")
    type_postupleniya = models.ForeignKey(TypePostupleniya, on_delete=models.DO_NOTHING, verbose_name="Тип постулпения",
                                          blank=True, null=True)
    nomer_vhod_document = models.CharField(max_length=255, verbose_name="№ Входящего документа", blank=True, null=True)
    date_vhod_document = models.CharField(max_length=255, verbose_name="Дата Входящего документа", blank=True,
                                          null=True)
    nomer_zakaza = models.ForeignKey(Naryd_zakaz, on_delete=models.DO_NOTHING, verbose_name="№ заказа", blank=True,
                                     null=True)
    price_za_edinicy = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Цена за ед.")
    serial_number = models.CharField(max_length=50, verbose_name="Серийный номер", blank=True, null=True)
    nomer_dogovora = models.ForeignKey(Dogovor, on_delete=models.CASCADE, blank=True, null=True, verbose_name="Договор")

    def __str__(self):
        return self.enc.name
