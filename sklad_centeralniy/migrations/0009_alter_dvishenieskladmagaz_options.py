# Generated by Django 5.0.2 on 2024-07-07 09:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sklad_centeralniy', '0008_alter_dvishenieskladmagaz_options'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='dvishenieskladmagaz',
            options={'permissions': (('can_view_dvishCS', 'Просмотр обор-я ЦС'), ('can_delete_dvishCS', 'Удаление обор-я ЦС'), ('can_edit_dvishCS', 'Изменения обор-я ЦС'), ('can_list_dvishCS', 'Список обор-я ЦС'))},
        ),
    ]