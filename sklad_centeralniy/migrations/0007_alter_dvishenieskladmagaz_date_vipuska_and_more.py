# Generated by Django 5.0.2 on 2024-06-30 06:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sklad_centeralniy', '0006_alter_dvishenieskladmagaz_date_vhod_document_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dvishenieskladmagaz',
            name='date_vipuska',
            field=models.CharField(blank=True, max_length=100, null=True, verbose_name='Дата выпуска'),
        ),
        migrations.AlterField(
            model_name='dvishenieskladmagaz',
            name='nomer_vhod_document',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name='№ Входящего документа'),
        ),
    ]
