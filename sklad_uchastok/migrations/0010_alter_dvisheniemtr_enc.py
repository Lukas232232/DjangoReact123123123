# Generated by Django 3.2.13 on 2024-02-24 04:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sklad_uchastok', '0009_alter_dvisheniemtr_enc'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dvisheniemtr',
            name='enc',
            field=models.CharField(max_length=255),
        ),
    ]