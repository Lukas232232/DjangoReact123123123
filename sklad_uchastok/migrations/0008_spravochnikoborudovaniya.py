# Generated by Django 3.2.13 on 2024-02-24 04:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sklad_uchastok', '0007_alter_dvisheniemtr_type_dvisheniya'),
    ]

    operations = [
        migrations.CreateModel(
            name='SpravochnikOborudovaniya',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(max_length=500)),
                ('enc', models.CharField(max_length=255)),
                ('unique_magazin', models.BooleanField(default=False)),
                ('unique_metrologia', models.BooleanField(default=False)),
            ],
        ),
    ]
