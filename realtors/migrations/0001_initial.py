# Generated by Django 3.2.13 on 2023-12-24 11:31

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Realtor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('photo', models.ImageField(upload_to='photo/%Y/%m/%d')),
                ('description', models.TextField(blank=True)),
                ('phone', models.CharField(max_length=20)),
                ('email', models.EmailField(max_length=50)),
                ('top_seller', models.BooleanField(default=False)),
                ('date_hired', models.DateTimeField(blank=True, default=datetime.datetime.now)),
            ],
        ),
    ]
