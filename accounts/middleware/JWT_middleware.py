from django.utils.deprecation import MiddlewareMixin


class JWT_middleware(MiddlewareMixin):
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        # Получение JWT-токена из куки

        token = request.COOKIES.get('access_token')
        if token:
            # Добавляем токен в заголовок каждого запроса
            response['Created-By'] = "Chris111"
        else:
            response['Created-By'] = "Not"

        return response
