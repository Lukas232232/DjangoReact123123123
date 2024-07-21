from django.contrib import admin
from django.contrib.admin.widgets import FilteredSelectMultiple
from django.contrib.auth.models import User, Group, Permission
from .models import *
from django import forms


class UserChangeForm(forms.ModelForm):
    class Meta:
        model = User
        fields = '__all__'

    groups = forms.ModelMultipleChoiceField(
        queryset=Group.objects.all(),
        required=False,
        widget=FilteredSelectMultiple('Groups', is_stacked=False)
    )

    user_permissions = forms.ModelMultipleChoiceField(
        queryset=Permission.objects.all(),
        required=False,
        widget=FilteredSelectMultiple('User permissions', is_stacked=False)
    )

class UserAccountAdmin(admin.ModelAdmin):
    form = UserChangeForm
    list_display = ("email", "name")
    user_permissions = forms.ModelMultipleChoiceField(
        queryset=Group.objects.all(),
        required=False,
        widget=FilteredSelectMultiple('User permissions', is_stacked=False)
    )

    # exclude = ('itog_count', )  # указывает какие поля не отображать


admin.site.register(UserAccount, UserAccountAdmin)
