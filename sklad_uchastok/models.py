from django.db import models

from accounts.models import UserAccount


class SpravochnikOborudovaniya(models.Model):
    name = models.TextField(max_length=500)
    enc = models.CharField(max_length=255)
    unique_magazin = models.BooleanField(default=False)
    unique_metrologia = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class Istochnik(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Sklad(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Type_rabot(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class DvishenieMTR(models.Model):
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
        (
            'Списан',
            'Списан',
        ),  # Второе значение и его отображаемое имя
        # Другие варианты значений и их отображаемые имена
    )

    rudnik = models.ForeignKey(Sklad,
                               on_delete=models.DO_NOTHING,
                               verbose_name="Рудник/Склад")
    real_date = models.DateTimeField(auto_now_add=True,
                                     verbose_name="Реальная дата")
    my_date = models.DateField(verbose_name="Дата")
    enc = models.ForeignKey(SpravochnikOborudovaniya,
                            on_delete=models.DO_NOTHING,
                            verbose_name="ЕНС")
    type_dvisheniya = models.CharField(max_length=50,
                                       choices=TYPE_DVISHEN,
                                       verbose_name="Тип движения")
    count = models.IntegerField(default=0, verbose_name="Количество")
    itog_count = models.IntegerField(null=True,
                                     blank=True,
                                     verbose_name="Вычисляемое количество")
    istochnik = models.ForeignKey(Istochnik,
                                  on_delete=models.DO_NOTHING,
                                  verbose_name="Источник")
    type_rabot = models.ForeignKey(Type_rabot,
                                   on_delete=models.DO_NOTHING,
                                   verbose_name="Тип работ")
    sdo = models.CharField(max_length=100, null=True, blank=True, verbose_name="№ СДО/оборудования")
    nomer_incidenta = models.CharField(max_length=50, null=True, blank=True,
                                       verbose_name="№ INC/RITM")
    comment = models.TextField(blank=True, null=True, verbose_name="Комментарий")
    user = models.ForeignKey(UserAccount,
                             null=True, blank=True,
                             on_delete=models.DO_NOTHING,
                             verbose_name="Пользователь")

    def __str__(self):
        return self.enc.name
