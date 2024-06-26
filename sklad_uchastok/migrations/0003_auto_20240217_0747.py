# Generated by Django 3.2.13 on 2024-02-17 07:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('sklad_uchastok', '0002_delete_rudnik'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dvisheniemtr',
            name='istochnik',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='sklad_uchastok.istochnik', verbose_name='Источник'),
        ),
        migrations.AlterField(
            model_name='dvisheniemtr',
            name='nomer_incidenta',
            field=models.CharField(max_length=50, verbose_name='№ INC/RITM'),
        ),
        migrations.AlterField(
            model_name='dvisheniemtr',
            name='rudnik',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='sklad_uchastok.sklad', verbose_name='Рудник/Склад'),
        ),
        migrations.AlterField(
            model_name='dvisheniemtr',
            name='sdo',
            field=models.CharField(max_length=100, verbose_name='№ СДО/оборудования'),
        ),
        migrations.AlterField(
            model_name='dvisheniemtr',
            name='type_dvisheniya',
            field=models.CharField(choices=[('Приход', 'Приход'), ('Расход', 'Расход')], max_length=50, verbose_name='Тип движения'),
        ),
    ]
