# Generated by Django 5.1 on 2024-10-03 13:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('landtitles', '0019_useremail'),
    ]

    operations = [
        migrations.AlterField(
            model_name='useremail',
            name='file',
            field=models.FileField(blank=True, null=True, upload_to='attachments/'),
        ),
    ]
