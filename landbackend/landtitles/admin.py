# Register your models here.
from django.contrib import admin
from .models import CustomUser
from .models import LandTitle, UserLocation

admin.site.register(CustomUser)

models_list =[LandTitle, UserLocation]
admin.site.register(models_list)