# Generated by Django 5.1 on 2024-09-09 11:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('landtitles', '0006_message'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='profession',
            field=models.CharField(max_length=15),
        ),
    ]
