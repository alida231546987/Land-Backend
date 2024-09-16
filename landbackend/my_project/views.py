from rest_framework import serializers, views, status
from django.views.generic import TemplateView
from rest_framework.response import Response
from django.contrib.auth.models import User  # Django's built-in User model
from django.contrib.auth import authenticate  # For verifying user credentials
from rest_framework.authtoken.models import Token  # For token-based authentication
from django.http import JsonResponse
from landtitles.models import LandTitle, TransferOwnership
from django.views.decorators.csrf import csrf_exempt
import json

# Serializer for registering users
class RegisterSerializer(serializers.ModelSerializer):
    # This specifies that the 'password' field should only be used for writing, not for reading (e.g., sending back to the user)
    username = serializers.CharField(write_only=True)
    cniId = serializers.CharField(write_only=True)
    email = serializers.CharField(write_only=True)
    telephone = serializers.CharField(write_only=True)
    role = serializers.CharField(write_only=True)
    gender = serializers.CharField(write_only=True)
    profession = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User  # This is the model the serializer is based on, Django's built-in User model
        # The fields here correspond to the attributes of the User model in your database
        fields = ('username', 'cniId', 'profession','email','telephone','role','gender','password')  # Modify these if your User model has different or additional fields

    def create(self, validated_data):
        # Creates a new user using the validated data. This function is called when the serializer's `save()` method is called.
        user = User.objects.create_user(**validated_data)
        return user

# View for user registration
class RegisterView(views.APIView):
    def post(self, request):
        # The serializer converts the incoming JSON data into a Python dictionary and validates it
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            # If the data is valid, save it to create a new user
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)  # Respond with the created user's data
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # If invalid, respond with errors

# View for user login
class LoginView(views.APIView):
    def post(self, request):
        # Extract the username and password from the incoming request data
        name = request.data.get('name')
        password = request.data.get('password')
        # Authenticate the user using the provided credentials
        user = authenticate(username=username, password=password)
        if user:
            # If the credentials are correct, generate or retrieve a token for the user
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key})  # Send the token back to the client (your React app)
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)  # If invalid, respond with an error


@csrf_exempt
def transfer_ownership(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        land_id = data.get('landId')
        owner_name = data.get('ownerName')

        try:
            # Check if the land title exists in the database
            landtitle = LandTitle.objects.get(land_id=land_id, owner_name=owner_name)

            # Create a new TransferOwnership entry
            TransferOwnership.objects.create(
                land_id=land_id, #data.get('landId'),
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
            print("The land title doesn't exist")
            return JsonResponse({'success': False, 'message': 'No land title with the provided credentials'}, status=400)
    return JsonResponse({'success': False, 'message': 'Invalid request method'})
