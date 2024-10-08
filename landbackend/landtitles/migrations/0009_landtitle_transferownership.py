# Generated by Django 5.1 on 2024-09-11 21:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('landtitles', '0008_student'),
    ]

    operations = [
        migrations.CreateModel(
            name='LandTitle',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('land_id', models.CharField(max_length=255, unique=True)),
                ('owner_name', models.CharField(max_length=255)),
                ('owner_email', models.EmailField(max_length=254)),
                ('land_location', models.CharField(max_length=255)),
                ('national_id', models.CharField(max_length=255)),
                ('land_size', models.FloatField()),
            ],
        ),
        migrations.CreateModel(
            name='TransferOwnership',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('land_id', models.CharField(max_length=255)),
                ('present_land_size', models.FloatField()),
                ('owner_name', models.CharField(max_length=255)),
                ('owner_email', models.EmailField(max_length=254)),
                ('land_location', models.CharField(max_length=255)),
                ('national_id', models.CharField(max_length=255)),
                ('buyer_name', models.CharField(max_length=255)),
                ('buyer_email', models.EmailField(max_length=254)),
                ('buyer_address', models.CharField(max_length=255)),
                ('land_size_to_sell', models.FloatField()),
                ('selling_type', models.CharField(choices=[('total', 'Total Mutation'), ('diminution', 'Diminution')], max_length=20)),
                ('transfer_date', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
