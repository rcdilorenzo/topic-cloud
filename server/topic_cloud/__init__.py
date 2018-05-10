import os
from pyramid.config import Configurator
from pyramid.response import FileResponse

def index_view(request):
    here = os.path.dirname(__file__)
    icon = os.path.join(here, '../../client/build/', 'index.html')
    return FileResponse(icon, request = request)


def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    config = Configurator(settings=settings)
    config.include('pyramid_jinja2')
    config.add_static_view('static', '../../client/build/static',
                           cache_max_age=3600)
    config.add_route('api', '/api')
    config.add_notfound_view(index_view, append_slash=True)

    config.scan()
    return config.make_wsgi_app()
