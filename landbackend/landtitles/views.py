from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate, login as auth_login, logout
from django.core.exceptions import ImproperlyConfigured
from django.db.models import Q
from django.utils.translation import gettext as _

from rest_framework import views, viewsets, status, serializers as drf_serializers
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

#For Emails
from django.core.mail import EmailMessage
from .serializers import UserEmailSerializer
from django.conf import settings
from .models import UserEmail
import logging


#Geolocation Api
from django.http import JsonResponse
from django.http.response import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import UserLocation
from django.shortcuts import render
from rest_framework.parsers import JSONParser

from django.http.response import Http404

#For files uplaod
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status, permissions

#For land titles
from .models import LandTitle, TransferOwnership , NotarialDeed, UserEmail
from .serializers import OwnershipTransferSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import LandTitleSerializer, PDFFileSerializer , NotarialDeedSerializer
from django.contrib.auth.decorators import login_required  # Import login_required

#Send email to confirm account
from rest_framework import generics, status
from .serializers import RegisterSerializer
from rest_framework.response import Response
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.conf import settings
from .models import CustomUser
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.template.loader import render_to_string
from .tokens import account_activation_token  # We'll create this
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny

#Payement API
from campay.sdk import Client as CamPayClient
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.http import FileResponse
from django.utils.timezone import now
from .models import Payment
from .serializers import PaymentSerializer
from django.contrib.auth import get_user_model
from campay.sdk import Client as CamPayClient
from reportlab.pdfgen import canvas
from reportlab.graphics.shapes import Drawing
from reportlab.graphics import renderPDF
from reportlab.graphics.barcode import qr
from reportlab.graphics.barcode.qr import QrCodeWidget
from io import BytesIO

#Files Shared
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from .models import PDFFile

User = get_user_model()

    

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
        role = profile.role  # Assuming 'profession' field represents the role

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


class UserViewSet(viewsets.ModelViewSet):
    class UserSerializer(drf_serializers.ModelSerializer):
        class Meta:
            model = User
            fields = "__all__"
    
    queryset = User.objects.all()
    serializer_class = UserSerializer

@csrf_exempt  
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


class MultipleSerializerViewSet(viewsets.GenericViewSet):
    serializer_classes = {

    }
    
    def get_serializer_class(self):
        if not isinstance(self.serializer_classes, dict):
            raise ImproperlyConfigured(_("serializer_classes variable must be a dict mapping"))

        if self.action in self.serializer_classes.keys():
            return self.serializer_classes[self.action]
        
        return super().get_serializer_class()

class OwnershipTransferViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.OwnershipTransferSerializer
    queryset = TransferOwnership.objects.all()

class LandTitleViewSet(viewsets.ModelViewSet, MultipleSerializerViewSet):
    class LandTitleSerializer(drf_serializers.ModelSerializer):
        class Meta:
            model = LandTitle
            fields = "__all__"

    class UpdateCoordinateSerializer(drf_serializers.ModelSerializer):
        class Meta:
            model = LandTitle
            fields = ["surface_area", "coordinates"]

        def validate_coordinates(self, value):
            """
            Custom validation for the coordinates field.
            Ensures it's a list of objects with latitude and longitude keys.
            """
            if value is None:
                raise serializers.ValidationError("Coordinates cannot be null.")

            if not isinstance(value, list):
                raise serializers.ValidationError("Coordinates should be a list.")

            for coordinate in value:
                if not isinstance(coordinate, dict):
                    raise serializers.ValidationError("Each coordinate should be an object.")
                if 'latitude' not in coordinate or 'longitude' not in coordinate:
                    raise serializers.ValidationError("Each coordinate must contain 'latitude' and 'longitude'.")
                if not isinstance(coordinate['latitude'], (float, int)) or not isinstance(coordinate['longitude'], (float, int)):
                    raise serializers.ValidationError("Latitude and longitude must be numbers.")
            
            return value

    serializer_classes = {
        'update_coordinates': UpdateCoordinateSerializer
    }

    serializer_class = LandTitleSerializer
    queryset = LandTitle.objects.all()

    @action(methods=['PATCH'], detail=True)
    def update_coordinates(self, request, *args, **kwargs):
        serializer = self.get_serializer_class()(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        landtitle: LandTitle = self.get_object()

        landtitle.surface_area = data['surface_area']
        landtitle.coordinates = data['coordinates']

        landtitle.save()

        return Response(
            data=self.serializer_class(landtitle).data
        )

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
    
#Verify land tite existing coordinates
@api_view(['POST'])
def verify_coordinates(request):
    coordinates = request.data.get('coordinates')
    
    if not coordinates:
        return Response({'error': 'No coordinates provided.'}, status=400)

    # Check if the coordinates exist in the LandTitle model
    existing_coordinates = LandTitle.objects.filter(coordinates__in=coordinates)
    
    if existing_coordinates.exists():
        existing_coords_list = existing_coordinates.values_list('coordinates', flat=True)
        return Response({'exists': True, 'existing_coordinates': list(existing_coords_list)}, status=200)

    return Response({'exists': False}, status=200)

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

@login_required
def transfer_ownership_requests(request):
    current_user = request.user  # The logged-in user
    owner_name = current_user.username  # Assuming username matches owner_name

    # Filter based on `owner_name` in LandTitle
    land_titles = LandTitle.objects.filter(owner_name=owner_name)
    
    # Get all the transfer requests related to those land titles
    transfer_requests = TransferOwnership.objects.filter(land_id__in=land_titles.values('id'))
    
    # Prepare the data to return
    data = list(transfer_requests.values())  # Convert the queryset to a list of dictionaries
    return JsonResponse(data, safe=False)


# views.py

class TransferOwnershipRequestViewSet(viewsets.ModelViewSet):
    queryset = TransferOwnership.objects.all()
    serializer_class = OwnershipTransferSerializer
    
class NotarialDeedViewSet(viewsets.ModelViewSet):
    queryset = NotarialDeed.objects.all()
    serializer_class = NotarialDeedSerializer
    
class PDFFileViewSet(viewsets.ModelViewSet):
    queryset = PDFFile.objects.all()
    serializer_class = PDFFileSerializer
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        
        if "user" in request.GET:
            queryset = queryset.filter(recipient__id=request.GET['user'])

        data = self.serializer_class(queryset, many=True).data
        
        return Response(data=data)


logger = logging.getLogger(__name__)

class UserEmailViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing user email instances, including sending emails.
    """
    queryset = UserEmail.objects.all()
    serializer_class = UserEmailSerializer

    @action(detail=False, methods=['post'], url_path='send-email', serializer_class=UserEmailSerializer)
    def send_email(self, request):
        """
        Custom action to send an email based on the provided data.
        """
        logger.debug('send_email action called with data: %s', request.data)
        
        # Use the SendEmailSerializer for this action
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            logger.warning('Email serializer is invalid.', extra={'errors': serializer.errors})
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Extract validated data
        recipient = serializer.validated_data.get('recipient')
        message = serializer.validated_data.get('message')
        file = serializer.validated_data.get('file', None)

        logger.info('Preparing to send email to %s.', recipient)
        logger.debug('Message: %s', message)
        if file:
            logger.debug('File attached: %s', file.name)

        # Create the EmailMessage instance
        email = EmailMessage(
            subject='New Message from FRAGMARK',
            body=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[recipient],
        )

        # Attach file if provided
        if file:
            try:
                email.attach(file.name, file.read(), file.content_type)
                logger.debug('Attached file: %s', file.name)
            except Exception as e:
                logger.error('Failed to attach file: %s', e)
                return Response({'error': 'Failed to attach file.'}, status=status.HTTP_400_BAD_REQUEST)

        # Attempt to send the email
        try:
            sent_count = email.send(fail_silently=False)
            logger.debug('Email send returned: %s', sent_count)
            
            if sent_count:
                # Save the email record in the database
                user_email = serializer.save()
                logger.info('Email sent successfully to %s and saved with ID %s.', recipient, user_email.id)
                return Response({'success': 'Email sent successfully.'}, status=status.HTTP_200_OK)
            else:
                logger.error('Email send failed without raising an exception.')
                return Response({'error': 'Failed to send email.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        except Exception as e:
            logger.exception('An unexpected error occurred while sending the email.')
            return Response({'error': 'An unexpected error occurred while sending the email.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# @csrf_exempt
# def upload_pdf(request):
#     if request.method == 'POST':
#         file = request.FILES['file']
#         dashboard = request.POST.get('destination_dashboard')
#         pdf = PDFFile(file=file, destination_dashboard=dashboard)
#         pdf.save()
#         return JsonResponse({'message': 'File uploaded successfully'})

# def fetch_pdfs(request, dashboard):
#     pdf_files = PDFFile.objects.filter(destination_dashboard=dashboard)
#     pdf_list = [{'file': pdf.file.url, 'uploaded_at': pdf.uploaded_at} for pdf in pdf_files]
#     return JsonResponse(pdf_list, safe=False)


User = get_user_model()

# Initialize CamPayClient
campay = CamPayClient({
        "app_username" : "LWHm0LdslUfK62bZRRGjOV03u9fXpFXcBnhzDNBWGNmUf0OMRhvUVH7vzFZWL3uQBerG2w7qJX__1reqgWFVmQ",
        "app_password" : "x_Udfgxm_potmkY1bWLERV9ZjWBvtmdJ8CsWnqZsqQPKsnZyzWFXRyFNI1-6o8HG-_dwRPrH1Ppi59rHsvLibg",
        "environment" : "DEV" #use "DEV" for demo mode or "PROD" for live mode
})

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

    def create(self, request, *args, **kwargs):
        phone = request.data.get("tel")
        reference = request.data.get("paymentReference")
        # Ensure phone is not None
        if phone is None or phone == "":
            return JsonResponse({"error": "Phone number is required"}, status=400)
        campay_status = campay.get_transaction_status({
         "reference": reference, #The amount you want to collect
        })

        if campay_status.get('status') == 'SUCCESSFUL':
            # Fetch the user and appointment
            # user = get_object_or_404(User, pk=request.user.id)

            # Save payment to the database
            payment_data = {
                'reference': campay_status['reference'],
                'external_reference': campay_status['external_reference'],
                'status': campay_status['status'],
                'amount': campay_status['amount'],
                'currency': campay_status['currency'],
                'operator': campay_status['operator'],
                'code': campay_status['code'],
                'operator_reference': campay_status['operator_reference'],
                'description': request.data.get('description'),
                'external_user': '',
                'phone_number': request.data.get('tel'),
                'date': now(),
                # 'user': user.id
            }

            payment_serializer = self.get_serializer(data=payment_data)
            payment_serializer.is_valid(raise_exception=True)
            payment_serializer.save()

            return Response({'success': 'Payment successfully !!!', "data": payment_serializer.data}, status=200)

        else:
            # Determine the error message
            reason = collect.get('reason') or collect.get('message') or 'An error occurred with the payment. Please try again later.'
            return Response({"message": reason}, status=status.HTTP_400_BAD_REQUEST)

        """
        Generate a PDF receipt for the payment.
        """
        buffer = BytesIO()
        p = canvas.Canvas(buffer)

        current_user = payment_receipt_info["user"]

        # Create a PDF document
        p.drawString(100, 750, "Payment Receipt For National ID Card Establishment")

        y = 700
        p.drawString(100, y, f"Reference: {payment_receipt_info['reference']}")
        p.drawString(100, y - 20, f"ID: {payment_receipt_info['reference']}")
        p.drawString(100, y - 40, f"User: {current_user.username}")
        p.drawString(100, y - 60, f"Phone Number: {payment_receipt_info['from']}")
        p.drawString(100, y - 80, f"Fees: {payment_receipt_info['amount']} {payment_receipt_info['currency']}")
        p.drawString(100, y - 100, f"Police Station: {payment_receipt_info['location']}")
        p.drawString(100, y - 120, f"Description: {payment_receipt_info['description']}")
        p.drawString(100, y - 140, f"Date: {payment_receipt_info['date'].strftime('%Y-%m-%d %H:%M:%S')}")

        # Generate QR Code
        qrcode_info = (
            f"Reference: {payment_receipt_info['reference']}\n"
            f"ID: {payment_receipt_info['reference']}\n"
            f"User: {current_user.username}\n"
            f"Phone Number: {payment_receipt_info['from']}\n"
            f"Fees: {payment_receipt_info['amount']} {payment_receipt_info['currency']}\n"
            f"Police Station: {payment_receipt_info['location']}\n"
            f"Description: {payment_receipt_info['description']}\n"
            f"Date: {payment_receipt_info['date'].strftime('%Y-%m-%d %H:%M:%S')}"
        )

        qrw = QrCodeWidget(qrcode_info)
        bounds = qrw.getBounds()
        width = bounds[2] - bounds[0]
        height = bounds[3] - bounds[1]
        d = Drawing(100, 100, transform=[100./width,0,0,100./height,0,0])
        d.add(qrw)
        renderPDF.draw(d, p, 100, 500)  # Adjust position as needed

        p.showPage()
        p.save()

        buffer.seek(0)
        return buffer
    
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes  # This is the correct import for force_bytes
from rest_framework import generics
from rest_framework.permissions import AllowAny
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from .models import CustomUser ,Profile # Adjust the import based on your project structure
from .tokens import account_activation_token  # Ensure this is correctly imported

# To send email
class SignupView(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            self.send_activation_email(user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def send_activation_email(self, user):
        try:
            print(f"Sending activation email to: {user.email}")  # Debugging statement
            current_site = get_current_site(self.request)
            mail_subject = 'Activate your Land Management account.'
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = account_activation_token.make_token(user)
            activation_link = reverse('activate', kwargs={'uidb64': uid, 'token': token})
            activation_url = f"http://{current_site.domain}{activation_link}"

            # Render the email template with the user and activation URL
            message = render_to_string('accounts/activation_email.html', {
                'user': user, 
                'activation_url': activation_url,
            })

            # Prepare the email message
            email = EmailMessage(
                mail_subject, message, to=[user.email]
            )

            # Send the email
            email.send()
            print(f"Activation email sent to {user.email}")  # Debugging statement
        except Exception as e:
            print(f"Error sending activation email: {str(e)}")  # Print error if sending fails
            
class ActivateAccount(APIView):
    permission_classes = (AllowAny,)

    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = CustomUser.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
            user = None
        
        if user is not None and account_activation_token.check_token(user, token):
            user.is_active = True
            user.save()
            return Response({'message': 'Thank you for your email confirmation. You can now log in.'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Activation link is invalid!'}, status=status.HTTP_400_BAD_REQUEST)