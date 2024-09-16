from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate, login as auth_login, logout
from django.core.exceptions import ImproperlyConfigured
from django.db.models import Q
from django.utils.translation import gettext as _

from rest_framework import views, viewsets, status
from rest_framework.authtoken.models import Token  # For token-based authentication
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.serializers import ValidationError as SerializerValidationError
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView

from . import serializers
from .models import Profile
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.http import JsonResponse
from rest_framework.decorators import api_view

#Geolocation Api
from django.http import JsonResponse
from django.http.response import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import UserLocation
from django.shortcuts import render

from django.http.response import Http404

#For files uplaod
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from .models import FileUpload
from .serializers import FileUploadSerializer

#For land titles
from .models import LandTitle, TransferOwnership
from .serializers import OwnershipTransferSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import LandTitleSerializer


class AuthViewSet(viewsets.GenericViewSet):
    permision_classes = [AllowAny, ]
    serializer_class = serializers.EmptySerializer
    serializer_classes = {
        'login': serializers.UserLoginSerializer,
        'signup': serializers.RegisterSerializer,
        'change_password': serializers.ChangePasswordSerializer,
        # 'update_profile': serializers.UpdateUserSerializer
    }
    queryset = User.objects.all()

    @action(methods=['POST'], detail=False)
    def login(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = get_and_authenticate_user(**serializer.validated_data)

        auth_login(request, user)

        # Fetch user's profile to get the role
        profile = Profile.objects.get(user=user)
        role = profile.profession  # Assuming 'profession' field represents the role

        data = serializers.AuthenticatedUserSerializer(user).data
        data['role'] = role  # Add role to the response

        return Response(data=data, status=status.HTTP_200_OK)

    @action(methods=['POST'], detail=False)
    def signup(self, request):
        serializer: serializers.RegisterSerializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.create(serializer.validated_data)
        
        data = serializers.AuthenticatedUserSerializer(user).data

        return Response(data=data, status=status.HTTP_201_CREATED)

    @action(methods=['POST'], detail=False)
    def logout(self, request):
        logout(request)
        data = {'success': "Logged out successfully"}
        return Response(data=data, status=status.HTTP_200_OK)

    @action(methods=['POST'], detail=False)
    def change_password(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        user.set_password( serializer.validated_data['new_password'] )
        user.save()

        return Response(data={"message": _("Password changed successfully")})

    @action(methods=["POST"], detail=False, permision_classes=[IsAuthenticated,])
    def update_profile(self, request):
        user = request.user
        user_query = User.objects.filter(id=user.id)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if "profile" in serializer.validated_data:
            profile_object = serializer.validated_data.pop("profile")
            profile_query = Profile.objects.filter(user=user).update(**profile_object)

            if "first_name" in profile_object:
                user_query.update(first_name=profile_object['first_name'])

            if "last_name" in profile_object:
                user_query.update(last_name=profile_object['last_name'])

        if serializer.validated_data:
        
            user_query.update(**serializer.validated_data)

        user.refresh_from_db()

        return Response(serializers.AuthenticatedUserSerializer(user).data)

    def get_serializer_class(self):
        if not isinstance(self.serializer_classes, dict):
            raise ImproperlyConfigured(_("serializer_classes variable must be a dict mapping"))

        if self.action in self.serializer_classes.keys():
            return self.serializer_classes[self.action]
        
        return super().get_serializer_class()

User = get_user_model()

@api_view(['POST'])
def signup(request):
    data = request.data
    try:
        user = User.objects.create(
            username=data['username'],
            email=data['email'],
            password=make_password(data['password'])
        )
        Profile.objects.create(
            user=user,
            cni_id=data['cni_id'],
            telephone=data['telephone'],
            profession=data['profession'],
            gender=data['gender']
            
        )
        return JsonResponse({"message": "User created successfully"}, status=201)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

def get_and_authenticate_user(identifier: str, password: str):
    """
    identifier can either be username, phone number or email address
    """
    user_not_found_exception = SerializerValidationError("Invalid username or password. Please try again!")
    try:
        user = User.objects.get( Q(username=identifier) | Q(email=identifier) )
        
        user = authenticate(username=user.username, password=password)
        
        if user:
            return user
        raise user_not_found_exception

    except User.DoesNotExist:
        raise user_not_found_exception


def create_user_account(username, password, first_name="", last_name="", email="", phone="", country_code="", **kwargs):
    user = User.objects.create_user(username=username, email=email, password=password, first_name=first_name, last_name=last_name, is_staff=False)
    # create person
    Profile.objects.create(name=first_name, surname=last_name, telephone=phone, user=user, country_code=country_code, **kwargs)
    return user



class OwnershipTransferViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.OwnershipTransferSerializer
    queryset = TransferOwnership.objects.all()

    
# class FrontendAppView(TemplateView):      
#     template_name = './landfrontend/index.html'

@csrf_exempt  # Temporarily disable CSRF protection for testing (you can secure this later)
def save_location(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        latitude = data.get('latitude')
        longitude = data.get('longitude')

        # Save the location in the database
        location = UserLocation.objects.create(latitude=latitude, longitude=longitude)
        return JsonResponse({'status': 'success', 'location_id': location.id})

    return JsonResponse({'error': 'Invalid request'}, status=400)

# views.py

def index(request):
    return render(request, 'index.html')  # Render the template you just created


#For Land titles

@api_view(['POST'])
def update_land_title(request):
    land_id = request.data.get('land_id')
    surface_area = request.data.get('surface_area')
    coordinates = request.data.get('coordinates')

    try:
        land_title = LandTitle.objects.get(id=land_id)
        land_title.surface_area = surface_area
        land_title.coordinates = coordinates
        land_title.save()
        return Response({'status': 'Land title updated'}, status=status.HTTP_200_OK)
    except LandTitle.DoesNotExist:
        return Response({'error': 'Land title not found'}, status=status.HTTP_404_NOT_FOUND)

#Transfer ownership form view

@csrf_exempt
def transfer_ownership(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        land_id = data.get('land_id')
        owner_name = data.get('owner_name')

        # Logging the received data
        print(f"Received landId: {land_id}, ownerName: {owner_name}")

        try:
            # Check if the land title exists in the database (case-insensitive for owner_name)
            landtitle = LandTitle.objects.get(land_id=land_id, owner_name__iexact=owner_name)

            # Create a new TransferOwnership entry
            TransferOwnership.objects.create(
                land_id=data.get('landId'),
                present_land_size=data.get('presentLandSize'),
                owner_name=data.get('ownerName'),
                owner_email=data.get('ownerEmail'),
                land_location=data.get('landLocation'),
                national_id=data.get('nationalId'),
                buyer_name=data.get('buyerName'),
                buyer_email=data.get('buyerEmail'),
                buyer_address=data.get('buyerAddress'),
                land_size_to_sell=data.get('landSizeToSell'),
                selling_type=data.get('sellingType')
            )
            return JsonResponse({'success': True, 'message': 'Request taken into consideration'})
        except LandTitle.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'No land title with the provided credentials'})
    return JsonResponse({'success': False, 'message': 'Invalid request method'})


# views.py

class TransferOwnershipRequestViewSet(viewsets.ModelViewSet):
    queryset = TransferOwnership.objects.all()
    serializer_class = OwnershipTransferSerializer



#For files uplaod and sharing

class FileUploadViewSet(viewsets.ViewSet):
    parser_classes = (MultiPartParser, FormParser)

    def create(self, request):
        file_serializer = FileUploadSerializer(data=request.data)
        if file_serializer.is_valid():
            file_serializer.save()
            return Response(file_serializer.data, status=status.HTTP_201_CREATED)
        return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

# views.py api end point to retrieve files
class FileRetrieveViewSet(viewsets.ModelViewSet):
    queryset = FileUpload.objects.all()
    serializer_class = FileUploadSerializer

