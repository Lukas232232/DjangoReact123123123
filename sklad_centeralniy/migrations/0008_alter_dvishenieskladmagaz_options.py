# Generated by Django 5.0.2 on 2024-07-07 09:54

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sklad_centeralniy', '0007_alter_dvishenieskladmagaz_date_vipuska_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='dvishenieskladmagaz',
            options={'permissions': (('can_view_dvishCS', 'Can view'), ('can_delete_dvishCS', 'Can delete'), ('can_edit_dvishCS', 'Can edit'), ('can_list_dvishCS', 'Can list'))},
        ),
    ]
