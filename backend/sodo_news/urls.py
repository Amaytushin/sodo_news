
from django.contrib import admin
from django.urls import path
from news_app import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('user/', views.checkService), 
    path('api/search/', views.search, name='search'), 

]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)