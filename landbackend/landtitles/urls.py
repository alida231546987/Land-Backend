from django.urls import include, path

from rest_framework import routers

from rest_framework.routers import DefaultRouter

from django.contrib import admin

from .views import FileUploadViewSet

from . import views  

from .views import AuthViewSet, OwnershipTransferViewSet #, LoginView

from .views import transfer_ownership

urlpatterns = [
    # path('api/transfer-ownership/', transfer_ownership, name='transfer_ownership'),
]

from .views import transfer_ownership

router = routers.DefaultRouter(trailing_slash=False)

authentication_routes = router.register("api/accounts", AuthViewSet, basename='auth')

ownership_transfer_routes = router.register("api/transfer-ownership", OwnershipTransferViewSet, basename='ownership-trans' )

# router = DefaultRouter()

# router.register(r'transfer-ownership', OwnershipTransferViewSet)

# router = DefaultRouter()
router.register(r'file-upload', FileUploadViewSet, basename='file-upload')


urlpatterns = [
    # path('api/accounts/', RegisterView.as_view(), name='register'),
    # path('api/login/', LoginView.as_view(), name='login'),
    path('api-auth/', include('rest_framework.urls')),
    # path('api/accounts/signup/', views.signup, name='signup'),
    path('save-location/', views.save_location, name='save_location'),
    # path('api/transfer-ownership/', transfer_ownership, name='transfer_ownership'),
    path('', views.index, name='index'),
    # path('', FrontendAppView.as_view(), name='home'),
    # path('api/', include(router.urls)),
    # path('', include(router.urls)),
]

urlpatterns += router.urls