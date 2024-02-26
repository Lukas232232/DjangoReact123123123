from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import JsonResponse
from rest_framework.response import Response
from django.core.serializers import serialize
import json

User = get_user_model()

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework_simplejwt.tokens import AccessToken, SlidingToken

from django.contrib.auth import authenticate, login, logout

from datetime import timedelta
from datetime import datetime


class LoginView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, *args, **kwargs):
        if request.data.get('email') or request.data.get('password'):
            username = request.data.get('email')
            password = request.data.get('password')

            user = authenticate(email=username, password=password)
            if user is not None:
                refresh_token = RefreshToken.for_user(user)
                access_token = refresh_token.access_token
                # получаем токен объект что бы достать из него id пользоватя и передать в Response
                token_obj = AccessToken(str(access_token))
                user_id = token_obj.payload[
                    'user_id']  # Извлекаем id из токена
                user_id = User.objects.get(id=user_id)
                user_info = user_id if user_id else None
                # возрат и превращение в json
                dict_data = json.loads(serialize('json', [user_info]))
                response = Response(
                    {
                        'access_token': str(access_token),
                        'refresh_token': str(refresh_token),
                        'datetime': datetime.now().timestamp(),
                        'user': serialize('json', [user_info]),
                    },
                    status=200)
                response.set_cookie(
                    key='access_token',
                    value=str(access_token),
                )
                return response
            else:
                return Response({'message': 'Неверные данные'}, status=403)
        elif request.data.get('token'):
            try:
                token = request.data.get('token')
                refresh_token = RefreshToken(token)
                access_token = refresh_token.access_token
                # преобразуем токен в объект с данными
                token_obj = AccessToken(str(access_token))
                user_id = token_obj.payload[
                    'user_id']  # Извлекаем id из токена
                user_id = User.objects.get(id=user_id)
                user_info = user_id if user_id else None
                if access_token is not None:
                    response = Response(
                        {
                            'access_token': str(access_token),
                            'refresh_token': str(refresh_token),
                            'datetime': datetime.now().timestamp(),
                            'user': serialize('json', [user_info]),
                        },
                        status=200)
                    response.set_cookie(
                        key='access_token',
                        value=str(access_token),
                    )
                    # # Сохранение access token в куке
                    # response.set_cookie(key='access_token',
                    #                     value=str(access_token),
                    #                     max_age=int(60 * 60),
                    #                     httponly=True)
                    return response
            except Exception as e:
                return Response({'message': str(e)}, status=500)


class SignupView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        data = self.request.data

        name = data['name']
        email = data['email']
        password = data['password']
        password2 = data['password2']
        try:
            User = get_user_model()
            user = User(name=name, email=email, password=password)
            if password == password2:
                if User.objects.filter(email=email).exists():
                    return Response({'error': 'Email already exists'})
                else:
                    if len(password) < 6:
                        return Response({
                            'error':
                            'Password must be at least 6 characters'
                        })
                    else:
                        user = User.objects.create_user(email=email,
                                                        password=password,
                                                        name=name)

                        # user.save()
                        return Response(
                            {'success': 'User created successfully'})
            else:
                return Response({'error': 'Пароли должны совпадать'})
        except Exception as e:
            error = e.message_dict
            return Response({'error': error})
