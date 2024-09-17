# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.contrib.auth.models import User
from django.db import models



class CustomUser(AbstractUser):
    pass  # Add any additional fields here
    groups = models.ManyToManyField(
        Group,
        related_name='customuser_set',  # Change this to avoid conflict
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='customuser_set_permissions',  # Change this to avoid conflict
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    username = models.CharField(max_length=15)
    cniId = models.CharField(max_length=15)
    email = models.CharField(max_length=15)
    telephone = models.CharField(max_length=15)
    role = models.CharField(max_length=15)
    profession= models.CharField(max_length=15)
    gender = models.CharField(max_length=15)
    password = models.CharField(max_length=15)
    # Add other fields as needed

    def __str__(self):
        return self.user.username
    
    
# models.py for Geolocalisation api

class UserLocation(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Location: {self.latitude}, {self.longitude} at {self.timestamp}"

#Land titles models to store info
class LandTitle(models.Model):
    land_id = models.CharField(max_length=255, unique=True, primary_key=True)
    owner_name = models.CharField(max_length=255)
    owner_email = models.EmailField()
    land_location = models.CharField(max_length=255)
    national_id = models.CharField(max_length=255)
    land_size = models.FloatField()
    surface_area = models.FloatField(null=True, blank=True)
    coordinates = models.JSONField(null=True, blank=True)  # To store coordinates

    def __str__(self):
        return f"{self.owner_name} - {self.land_id}"


#Transfer ownership model
class TransferOwnership(models.Model):
    # Current Owner Information
    land_id = models.CharField(max_length=255)
    present_land_size = models.FloatField()
    owner_name = models.CharField(max_length=255)
    owner_email = models.EmailField()
    land_location = models.CharField(max_length=255)
    national_id = models.CharField(max_length=255)

    # Buyer Information
    buyer_name = models.CharField(max_length=255)
    buyer_email = models.EmailField()
    buyer_address = models.CharField(max_length=255)
    land_size_to_sell = models.FloatField()

    # Transfer Information
    SELLING_TYPE_CHOICES = [
        ('total', 'Total Mutation'),
        ('diminution', 'Diminution'),
    ]
    selling_type = models.CharField(max_length=20, choices=SELLING_TYPE_CHOICES)

    transfer_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Transfer of Land ID: {self.land_id} from {self.owner_name} to {self.buyer_name}"


#Messaging model
class FileUpload(models.Model):
    file = models.FileField(upload_to='uploads/')
