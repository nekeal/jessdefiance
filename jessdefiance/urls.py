"""jessdefiance URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from drf_yasg import openapi
from rest_framework.routers import DefaultRouter
from drf_yasg.views import get_schema_view

from .blog.urls import router as blog_router

schema_view = get_schema_view(openapi.Info(
      title="Blog API",
      default_version='v1',
      description="API for personal blog",
      license=openapi.License(name="GNU General Public License v3.0"),
   ),)


router = DefaultRouter()
router.registry.extend(blog_router.registry)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include((router.urls, 'api'))),
    path('docs/', schema_view.with_ui('redoc'))
]
