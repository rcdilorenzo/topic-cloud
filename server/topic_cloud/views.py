import os
from pyramid.view import view_config
from pyramid.response import FileResponse

@view_config(route_name='api', renderer = 'json')
def api_view(request):
    return {'status': 'ok'}
