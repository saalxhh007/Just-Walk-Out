from django.shortcuts import render
from django.http import JsonResponse
from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User

from .models import Attendance

import json
# Create your views here.

def storeIn(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_id = data.get('user_id')
            name = data.get('name')
            if not user_id or not name:
                    return JsonResponse({'error': 'Missing user_id or name.'}, status=400)
            
            today = timezone.now().date()
            attendance = Attendance.objects.filter(user_id=user_id, check_in_time__date=today).first()
            if attendance:
                return JsonResponse({'message': 'Client already in today.'}, status=400)
            
            Attendance.objects.create(user_id=user_id, name=name, check_in_time=timezone.now())
            return JsonResponse({'message': 'Client is in of store'})
        
        except json.JSONDecodeError:
                return JsonResponse({'error': 'Invalid JSON.'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid Method.'}, status=400)

def storeOut(request):
    try:
        data = json.loads(request.body)
        user_id = data.get('user_id')
        user = get_object_or_404(User, id=user_id)
        Attendance.objects.create(user=user, action='check_out')

        return JsonResponse({'message': 'Client is out of store'})
    
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON.'}, status=400)