from django.db import models
from accounts.models import UserAccount
from django.core.exceptions import ValidationError


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
    real_date = models.DateTimeField(auto_now_add=True)
    my_date = models.DateField()
    enc = models.ForeignKey(SpravochnikOborudovaniya,
                            on_delete=models.DO_NOTHING)
    type_dvisheniya = models.CharField(max_length=50,
                                       choices=TYPE_DVISHEN,
                                       verbose_name="Тип движения")
    count = models.IntegerField()
    itog_count = models.IntegerField(null=True, blank=True)
    istochnik = models.ForeignKey(Istochnik,
                                  on_delete=models.DO_NOTHING,
                                  verbose_name="Источник")
    type_rabot = models.ForeignKey(Type_rabot, on_delete=models.DO_NOTHING)
    sdo = models.CharField(max_length=100, verbose_name="№ СДО/оборудования")
    nomer_incidenta = models.CharField(max_length=50,
                                       verbose_name="№ INC/RITM")
    comment = models.TextField(blank=True)
    user = models.ForeignKey(UserAccount, on_delete=models.DO_NOTHING)

    def clean_count(self):
        if self.count <= 0:
            raise ValidationError(
                "Поле Количество - Необходимо ввести число больше 0")
        return self.count

    def clean_itog_count(self):
        if self.type_dvisheniya == 'Приход' and isinstance(self.count, int):
            self.itog_count = self.count
        else:
            self.itog_count = self.count * (-1)

    def clean(self):
        self.clean_itog_count()
        self.clean_count()

    def save(self, *args, **kwargs):
        self.full_clean(
        )  # Запускаем метод full_clean() для проведения валидации всех полей
        super().save(*args, **kwargs)

    def __str__(self):
        return self.enc
