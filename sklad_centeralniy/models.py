from django.db import models

from accounts.models import UserAccount
from sklad_uchastok.models import SpravochnikOborudovaniya, Sklad
from django.core.exceptions import ValidationError

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
    date_vipuska = models.CharField(max_length=100, verbose_name="Дата выпуска", null=True, blank=True)
    enc = models.ForeignKey(SpravochnikOborudovaniya,
                            on_delete=models.DO_NOTHING,
                            verbose_name="ЕНС")
    count = models.IntegerField(default=0, verbose_name="Количество")
    comment = models.TextField( verbose_name="Комментарий")
    user = models.ForeignKey(UserAccount,
                             null=True, blank=True,
                             on_delete=models.DO_NOTHING,
                             verbose_name="Пользователь")
    type_dvisheniya = models.CharField(max_length=50,
                                       choices=TYPE_DVISHEN,
                                       verbose_name="Тип движения")
    peredano = models.ForeignKey(Sklad,
                                 on_delete=models.DO_NOTHING,
                                 verbose_name="Рудник/Склад", null=True, blank=True)
    itog_count = models.IntegerField(null=True,
                                     blank=True,
                                     verbose_name="Вычисляемое количество")
    type_postupleniya = models.ForeignKey(TypePostupleniya, on_delete=models.DO_NOTHING, verbose_name="Тип постулпения",
                                          blank=True, null=True)
    nomer_vhod_document = models.CharField(max_length=255, verbose_name="№ Входящего документа", blank=True, null=True)
    date_vhod_document = models.DateField(verbose_name="Дата Входящего документа", blank=True,
                                          null=True)
    nomer_zakaza = models.ForeignKey(Naryd_zakaz, on_delete=models.DO_NOTHING, verbose_name="№ заказа", blank=True,
                                     null=True)
    price_za_edinicy = models.FloatField(default=0, verbose_name="Цена за ед.", null=True, blank=True)
    serial_number = models.CharField(max_length=50, verbose_name="Серийный номер", blank=True, null=True)
    nomer_dogovora = models.ForeignKey(Dogovor, on_delete=models.CASCADE, blank=True, null=True, verbose_name="Договор")

    class Meta:
        permissions = [
            ('getPar_DvishenieSkladMagaz', 'Запись просматривать DvishenieSkladMagaz'),
            ('edit_DvishenieSkladMagaz', 'Изменять DvishenieSkladMagaz'),
            ('delete_DvishenieSkladMagaz', 'Удалять DvishenieSkladMagaz'),
            ('list_DvishenieSkladMagaz', 'Список DvishenieSkladMagaz'),
            ('add_DvishenieSkladMagaz', 'Добавлять DvishenieSkladMagaz'),
        ]

    def clean_count(self):
        errors_arr = []
        if self.count == 11111:
            errors_arr.append("Необходимо ввести другое число")
        if self.count <= 0:
            errors_arr.append("Необходимо ввести число больше 0")
        if self.count > 4000:
            errors_arr.append("Необходимо ввести число меньше 4000")
        if errors_arr:
            errors = {'count': errors_arr}
            return errors
        else:
            return {}

    def clean_type_dvisheniya(self):
        # обрабатываем данные для поля ITOG_COUNT
        type_dvisheniya = self.type_dvisheniya
        current_count = self.count
        # Допустим, у вас есть доступ к self.instance для получения текущего значения itog_count
        # Если создается новая запись, self.instance будет None
        # current_itog_count = self.instance.itog_count if self.instance else None

        # Теперь вы можете выполнить проверку или обработку
        if type_dvisheniya and current_count:
            if type_dvisheniya == 'Приход':
                self.count = current_count  # Пример обработки
            else:
                self.itog_count = int(current_count) * (-1)
        return {}

    def clean(self):
        errors = {}
        errors.update(self.clean_count())
        errors.update(self.clean_type_dvisheniya())
        if errors:
            raise ValidationError(errors)
        super().clean()

    def save(self, *args, **kwargs):
        # Выполняем валидацию модели перед сохранением
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.enc.name
