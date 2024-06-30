from django.contrib import admin

# Register your models here.
# Register your models here.
from .models import *


class DvishenieMTRadmin(admin.ModelAdmin):
    list_display = ('id', "rudnik", "enc", "type_dvisheniya")
    list_display_links = ("enc", "type_dvisheniya")
    readonly_fields = ('itog_count', )
    search_fields = (
        "enc",
        "type_dvisheniya",
    )
    list_per_page = 25
    #exclude = ('itog_count', )  # указывает какие поля не отображать
admin.site.register(DvishenieMTR, DvishenieMTRadmin)


class SpravochnikOborudovaniyaAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'enc',
        'name',
        "unique_magazin",
        "unique_metrologia",
    )
    list_display_links = (
        'id',
        'name',
        "unique_magazin",
        "unique_metrologia",
    )
    search_fields = (
        'id',
        'name',
        "unique_magazin",
        "unique_metrologia",
    )
    list_per_page = 25
    fields = (
        "enc",
        'name',
        "unique_magazin",
        "unique_metrologia",
    )
admin.site.register(SpravochnikOborudovaniya, SpravochnikOborudovaniyaAdmin)


class IstochnikAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
    )
    list_display_links = ("name", )
    search_fields = ("name", )
    list_per_page = 25
    fields = ('name', )
admin.site.register(Istochnik, IstochnikAdmin)


class SkladAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
    )
    list_display_links = ("name", )
    search_fields = ("name", )
    list_per_page = 25
    fields = ('name', )
admin.site.register(Sklad, SkladAdmin)


class Type_rabotAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
    )  # Определяем какие поля отображать при выборе записи
    list_display_links = ("name", )
    search_fields = ("name", )
    list_per_page = 25
    fields = ('name', )
admin.site.register(Type_rabot, Type_rabotAdmin)
