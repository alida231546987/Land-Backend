import re

number_regex = re.compile(r'\d+')  # Add 'r' to make it a raw string


from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
from django.utils.translation import gettext as _

from rest_framework import serializers
from rest_framework.authtoken.models import Token

from .models import Profile, TransferOwnership

from rest_framework import serializers
from .models import LandTitle, PDFFile ,NotarialDeed, UserEmail



User = get_user_model()

class EmptySerializer(serializers.Serializer):
    pass

class UserLoginSerializer(serializers.Serializer):
    identifier = serializers.CharField(max_length=300, required=True)
    password = serializers.CharField(required=True, write_only=True)

class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(write_only=True)
    cniId = serializers.CharField(write_only=True)
    email = serializers.CharField(write_only=True)
    telephone = serializers.CharField(write_only=True)
    role = serializers.CharField(write_only=True)
    profession = serializers.CharField(write_only=True)
    gender = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        username, password, email = validated_data.pop("username", None), validated_data.pop("password", None), validated_data.pop("email", None)

        # Creates a new user using the validated data. This function is called when the serializer's `save()` method is called.
        user = User.objects.create_user(username=username, password=password, email=email)

        Profile.objects.create(user=user, **validated_data)

        return user

def validate_password(password, password_field_name="password"):
        errors = []
        # check if the password is at least 8 digits long with digits, upper and lowercase characters
        number_regex = re.compile('\d+')
        uppercase_regex = re.compile('[ABCDEFGHIJKLMNOPQRSTUVWXYZ]+')
        lowercase_regex = re.compile('[abcdefghijklmnopqrstuvwxyz]+')

        if len(password) < 8:
            errors.append(f"The {password_field_name} must have at least 8 characters")
        if not number_regex.search(password):
            errors.append(f"The {password_field_name} must have at least one numeric character")
        if not uppercase_regex.search(password):
            errors.append(f"The {password_field_name} must have at least one uppercase character")
        if not lowercase_regex.search(password):
            errors.append(f"The {password_field_name} must have at least one lowercase character")
        
        return errors


class ChangePasswordSerializer(serializers.Serializer):
    """
    A serializer for changing passwords
    """
    old_password = serializers.CharField()
    new_password = serializers.CharField(validators=[])

    def validate_old_password(self, data):
        user = self.context['request'].user

        if not check_password(data, user.password):
            raise serializers.ValidationError(_("The password is incorrect"))

        return data

    def validate_new_password(self, data):
        errors = validate_password(data)
        validation_errors = []

        if not errors:
            return data
        else:
            for error in errors:
                validation_errors.append(
                    serializers.ValidationError(error)
                )
            
            raise serializers.ValidationError(validation_errors)

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = (
            "id",
            "username",
            "cniId",
            "email",
            "telephone",
            "role",
            "gender",
            "profession",
            "password"
        )

class AuthenticatedUserSerializer(serializers.ModelSerializer):
    auth_token = serializers.SerializerMethodField()

    profile = ProfileSerializer()
    
    class Meta:
        model = User
        fields = ('id', "username", 'email', 'is_active', 'is_staff', 'auth_token', "profile")
        read_only_fields = ('id', 'is_active', 'is_staff', "profile")

    def get_auth_token(self, obj):
        token = Token.objects.get_or_create(user=obj)
        return token[0].key
        
        
class OwnershipTransferSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransferOwnership
        fields = '__all__'
        
    def validate_land_id(self, value):
        if LandTitle.objects.filter(land_id=value).count() == 0:
            raise serializers.ValidationError(f"No land title with id {value}")
        
        return value
    
class PDFFileSerializer(serializers.ModelSerializer):
    class Meta: 
        model = PDFFile
        fields = "__all__"



class LandTitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = LandTitle
        fields = ['id', 'surface_area', 'coordinates']
        

class NotarialDeedSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotarialDeed
        fields = "__all__"
        


class UserEmailSerializer(serializers.ModelSerializer):
    file = serializers.FileField(required=False)
    class Meta:
        model = UserEmail
        fields = ['recipient', 'message', 'file']
        
    def validate_file(self, value):
        if value:
            max_size = 25 * 1024 * 1024  # 25MB limit
            if value.size > max_size:
                raise serializers.ValidationError('File size exceeds 25MB limit.')
        return value
        



