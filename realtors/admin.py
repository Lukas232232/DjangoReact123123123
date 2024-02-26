from django.contrib import admin

# Register your models here.
from .models import *


class RealtorAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'date_hired')
    list_display_links = ('id', 'name')
    search_fields = ('name', )
    list_per_page = 25


admin.site.register(Realtor, RealtorAdmin)
