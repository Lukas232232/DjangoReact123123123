# Generated by Django 5.0.2 on 2024-06-17 14:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sklad_centeralniy', '0002_alter_dvishenieskladmagaz_count'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dvishenieskladmagaz',
            name='count',
            field=models.DecimalField(decimal_places=5, default=0, max_digits=10, verbose_name='Количество'),
        ),
    ]
