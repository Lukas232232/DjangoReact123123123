from django.contrib import admin

# Register your models here.
# Register your models here.
from .models import *


#
# class DvishenieMTRadmin(admin.ModelAdmin):
#     list_display = ('id', "rudnik", "enc", "type_dvisheniya")
#     list_display_links = ("enc", "type_dvisheniya")
#     readonly_fields = ('itog_count', )
#     search_fields = (
#         "enc",
#         "type_dvisheniya",
#     )
#     list_per_page = 25
#     #exclude = ('itog_count', )  # указывает какие поля не отображать
# admin.site.register(DvishenieMTR, DvishenieMTRadmin)
#
#
class DvishenieSkladMagazAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'my_date',
        "date_vipuska",
        "enc",
        "count",
        "comment",
        "user",
        "type_dvisheniya",
        "peredano",
        "itog_count",
        "type_postupleniya",
        "nomer_vhod_document",
        "date_vhod_document",
        "nomer_zakaza",
        "price_za_edinicy",
        "serial_number",
        "nomer_dogovora",
    )
    list_display_links = (
        'id',
        'enc',
    )
    search_fields = (
        'id',
        'enc',
    )
    list_per_page = 25
    fields = (
        'my_date',
        "date_vipuska",
        "enc",
        "count",
        "comment",
        "user",
        "type_dvisheniya",
        "peredano",
        "itog_count",
        "type_postupleniya",
        "nomer_vhod_document",
        "date_vhod_document",
        "nomer_zakaza",
        "price_za_edinicy",
        "serial_number",
        "nomer_dogovora",
    )


admin.site.register(DvishenieSkladMagaz, DvishenieSkladMagazAdmin)


class PostavshikAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
    )
    list_display_links = ("name",)
    search_fields = ("name",)
    list_per_page = 25
    fields = ('name',)


admin.site.register(Postavshik, PostavshikAdmin)


class TypePostupleniyaAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
    )
    list_display_links = ("name",)
    search_fields = ("name",)
    list_per_page = 25
    fields = ('name',)


admin.site.register(TypePostupleniya, TypePostupleniyaAdmin)


class StatusPostavkiAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
    )  # Определяем какие поля отображать при выборе записи
    list_display_links = ("name",)
    search_fields = ("name",)
    list_per_page = 25
    fields = ('name',)


admin.site.register(StatusPostavki, StatusPostavkiAdmin)


class Status_narydZakazAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
    )  # Определяем какие поля отображать при выборе записи
    list_display_links = ("name",)
    search_fields = ("name",)
    list_per_page = 25
    fields = ('name',)


admin.site.register(Status_narydZakaz, Status_narydZakazAdmin)


class DogovorAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'nomer_dogovora',
        'kratkoe_opisanie',
        'date_formir_proekta',
        'date_podpis_proekta',
        'kontragent',
        'valyta',
        'nds',
    )  # Определяем какие поля отображать при выборе записи
    list_display_links = ('nomer_dogovora',)
    search_fields = ('nomer_dogovora',
                     'kratkoe_opisanie',
                     'date_formir_proekta',
                     'date_podpis_proekta',
                     'kontragent',
                     'valyta',
                     'nds',)
    list_per_page = 25
    fields = ('nomer_dogovora',
              'kratkoe_opisanie',
              'date_podpis_proekta',
              'kontragent',
              'valyta',
              'nds',)


admin.site.register(Dogovor, DogovorAdmin)


class Naryd_zakazAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'nomer_Zakaz_naryd',
        'nomer_document',
        'date_sozdaniya',
        'date_otpravki',
        'date_podpisaniy',
        'date_zakritiy',
        'status',
        'nomer_dogovora',
        'postavshik',
        'comment',
        'status_postavki',
        'type_postupleniya',
    )  # Определяем какие поля отображать при выборе записи
    list_display_links = ('nomer_Zakaz_naryd', "nomer_document")
    search_fields = ('nomer_Zakaz_naryd',
                     'nomer_document',
                     'date_sozdaniya',
                     'date_otpravki',
                     'date_podpisaniy',
                     'date_zakritiy',
                     'status',
                     'nomer_dogovora',
                     'postavshik',
                     'comment',
                     'status_postavki',
                     'type_postupleniya',)
    list_per_page = 25
    fields = ('nomer_Zakaz_naryd',
              'nomer_document',
              'date_sozdaniya',
              'date_otpravki',
              'date_podpisaniy',
              'date_zakritiy',
              'status',
              'nomer_dogovora',
              'postavshik',
              'comment',
              'status_postavki',
              'type_postupleniya',)


admin.site.register(Naryd_zakaz, Naryd_zakazAdmin)
