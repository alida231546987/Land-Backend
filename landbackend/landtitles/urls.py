from django.urls import include, path

from rest_framework import routers

from rest_framework.routers import DefaultRouter

from django.contrib import admin

# from .views import FileUploadViewSet

from . import views  
from django.conf import settings
from django.conf.urls.static import static

from .views import AuthViewSet, OwnershipTransferViewSet, LandTitleViewSet, PDFFileViewSet, UserViewSet
from .views import transfer_ownership

urlpatterns = [
    # path('api/transfer-ownership/', transfer_ownership, name='transfer_ownership'),
]

from .views import transfer_ownership

router = routers.DefaultRouter(trailing_slash=False)

authentication_routes = router.register("api/accounts", AuthViewSet, basename='auth')

ownership_transfer_routes = router.register("api/transfer-ownership", OwnershipTransferViewSet, basename='ownership-transfer' )

landtitle_routes = router.register("api/landtitles", LandTitleViewSet, basename='landtitles')

router.register("api/pdfs/", PDFFileViewSet, basename='pdf-files')

user_routes = router.register("api/users", UserViewSet, basename='users')

# router.register(r'file-upload', FileUploadViewSet, basename='file-upload')

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)



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
    # path('upload_pdf/', views.upload_pdf, name='upload_pdf'),
    # path('fetch_pdfs/<str:dashboard>/', views.fetch_pdfs, name='fetch_pdfs'),
]

urlpatterns += router.urls
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)