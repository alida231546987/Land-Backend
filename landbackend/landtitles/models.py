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
    username = models.CharField(max_length=150)
    cniId = models.CharField(max_length=150)
    email = models.EmailField()
    telephone = models.CharField(max_length=150)
    role = models.CharField(max_length=150)
    profession= models.CharField(max_length=150)
    gender = models.CharField(max_length=150)
    password = models.CharField(max_length=150)
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
    nature = models.CharField(max_length=500, null=True)
    profession = models.CharField(max_length=500, null=True)
    address = models.CharField(null=True, max_length=500)
    dob = models.DateTimeField(null=True)
    pob = models.CharField(max_length=500, null=True)
    father_name = models.CharField(max_length=500, null=True)
    mother_name = models.CharField(max_length=500, null=True)
    delivery_date = models.DateTimeField(null=True ,auto_now_add=True)
    
    
    
    
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


class PDFFile(models.Model):
    file = models.FileField(upload_to='pdfs/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    destination_dashboard = models.CharField(max_length=100)  # To identify dashboard destination
    recipient = models.ForeignKey(User,on_delete=models.SET_NULL,null=True) # Referencing the users table 

    def __str__(self):
        return self.file.name

