from django.urls import path, include

from . import views


urlpatterns = [
    path('rest-auth/', include('rest_auth.urls')),
    path('rest-auth/registration/', include('rest_auth.registration.urls')),
    path('user/', views.UserView.as_view()),
    path('profile/<int:pk>/', views.ProfileView.as_view()),
    path('profile/<int:pk>/hire-freelancer/<int:id>/', views.HireFreelancerView.as_view()),
    path('freelancers/', views.FreelancerListView.as_view()),
    path('become-freelancer/', views.BecomeFreelancerView.as_view()),
    path('unbecome-freelancer/', views.UnbecomeFreelancerView.as_view()),
    path('languages/', views.LanguageListView.as_view()),
    path('technologies/', views.TechnologyListView.as_view()),
    path('time-zones/', views.TimeZoneListView.as_view())
]
