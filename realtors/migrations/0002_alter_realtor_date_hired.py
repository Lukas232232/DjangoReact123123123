# Generated by Django 3.2.13 on 2023-12-24 11:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('realtors', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='realtor',
            name='date_hired',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
