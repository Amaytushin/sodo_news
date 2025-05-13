import os
from django.shortcuts import render
from django.http.response import JsonResponse
from django.http import JsonResponse
import json
from sodo_news.settings import connectDB, sendResponse, resultMessages, disconnectDB, sendMail
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password, check_password
from datetime import datetime, timezone
import uuid


@csrf_exempt
def checkService(request):
    if request.method == 'POST':
        if request.content_type.startswith("multipart/form-data"):
            action = "add_news"
            try:
                news_title = request.POST.get('news_title')
                content = request.POST.get('content')
                huraangvi = request.POST.get('huraangvi')
                category_id = request.POST.get('category_id')

                # if not all([news_title, content, huraangvi, category_id]):
                #     return JsonResponse(sendResponse(4002, action, [{"aldaa":"hooson bn"}]))
                image_url = None
                if 'image_url' in request.FILES:
                    image = request.FILES['image_url']
                    filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{image.name}"
                    save_path = os.path.join('media/news', filename)

                    os.makedirs(os.path.dirname(save_path), exist_ok=True)

                    with open(save_path, 'wb+') as dest:
                        for chunk in image.chunks():
                            dest.write(chunk)

                    image_url = f"http://127.0.0.1:8000/media/news/{filename}"

            except Exception as e:
                return JsonResponse(sendResponse(4003, action,  [{"aldaa": e}]))

            try:
                with connectDB() as con:
                    cur = con.cursor()
                    query = '''
                        INSERT INTO t_amay_news 
                            (news_title, content, huraangvi, published_at, image_url, category_id)
                        VALUES (%s, %s, %s, NOW(), %s, %s)
                        RETURNING nid
                    '''
                    cur.execute(query, (news_title, content,
                                huraangvi, image_url, category_id))
                    result = cur.fetchone()
                    con.commit()

                    if result:
                        return JsonResponse(sendResponse(200, action, []))
                    else:
                        return JsonResponse(sendResponse(501, action,  []))

            except Exception as e:
                print(f"Error adding news: {e}")
                return JsonResponse(sendResponse(5000, action, [{"Системийн алдаа: {e}", }]))
        else:
            try:
                data = json.loads(request.body)
            except Exception as e:
                res = sendResponse(4001)
                return JsonResponse(res)

            if 'action' not in data:
                res = sendResponse(4002)
                return JsonResponse(res)

            if data['action'] == 'register':
                res = register(request)
                return JsonResponse(res)
            elif data['action'] == 'login':
                res = login(request)
                return JsonResponse(res)
            elif data['action'] == 'search_news':
                res = search_news(request)
                return JsonResponse(res)
            elif data['action'] == 'getnews':
                res = getnews(request)
                return JsonResponse(res)
            elif data['action'] == 'getcategory':
                res = getcategory(request)
                return JsonResponse(res)
            else:
                res = sendResponse(4003)
                return JsonResponse(res)

    elif request.method == 'GET':
        with connectDB() as con:
            try:
                token = request.GET.get('token', 'detault_value')

                cur = con.cursor()
                query = f'''SELECT uid FROM public.t_amay_news_token WHERE token='{token}' and tokenenddate > NOW() '''
                cur.execute(query)
                pid = cur.fetchone()
                if pid is None:
                    res = sendResponse(1001, action='register')
                    return JsonResponse(res)

                query = f'''SELECT is_verified FROM public.t_amay_news  WHERE nid='{pid[0]}' '''
                cur.execute(query)
                data = cur.fetchone()[0]

                if data is True:
                    res = sendResponse(1002, action='register')
                    return JsonResponse(res)

                query = f'''UPDATE public.t_amay_news
                            SET is_verified=true
                            WHERE nid={pid[0]}  '''
                cur.execute(query)

                con.commit()
                res = sendResponse(200, action='register')
                return JsonResponse(res)

            except Exception as e:
                res = sendResponse(5004)
                return JsonResponse(res)
    else:
        res = sendResponse(405)
        return JsonResponse(res)


def login(request):
    try:
        jsons = json.loads(request.body)
        email = jsons['email']
        password = jsons['password']
    except Exception as e:
        res = sendResponse(4006)
        return res

    try:
        with connectDB() as con:
            cur = con.cursor()

            query = f'''SELECT email FROM public.t_amay_news
                        WHERE email='{email}' '''
            cur.execute(query)
            data = cur.fetchone()

            if not data:
                res = sendResponse(1004)
                return res

            query = f'''SELECT password, author_name, nid,email  FROM public.t_amay_news
                        WHERE email='{email}' and is_verified=true '''
            cur.execute(query)
            data = cur.fetchone()

            if not data:
                res = sendResponse(4008)
                return res

            if not check_password(password, data[0]):
                res = sendResponse(4007)
                return res

            resJson = {
                'nid': data[2],
                'author_name': data[1],
                'email': data[3]
            }
            res = sendResponse(200, [resJson])
            return res
    except Exception as e:
        print(f'###################{e}')
        res = sendResponse(5001)
        return res
# login


def register(request):

    data = json.loads(request.body)
    try:
        email = data['email']
        password = data['password']
    except:
        return sendResponse(4004)
    try:
        with connectDB() as con:
            cur = con.cursor()
            query = f'''SELECT COUNT(*) FROM public.t_amay_news WHERE email='{email}' '''
            cur.execute(query)
            dataFromDb = cur.fetchone()[0]

            if dataFromDb != 0:
                return sendResponse(1000, action="register", data=[])

            query = f'''INSERT INTO public.t_amay_news(
                            email, password, is_verified, created_date)
                            VALUES ( '{email}', '{make_password(password)}', false, NOW() )
                            RETURNING nid;'''
            cur.execute(query)
            nid = cur.fetchone()[0]

            token = str(uuid.uuid4())
            query = f'''INSERT INTO public.t_amay_news_token(
                             uid, token, tokentype, tokenenddate, createddate)
                            VALUES ( {nid}, '{token}', 'register', NOW() + interval '1 day', NOW() );'''
            cur.execute(query)

            bodyHTML = F"""<a target='_blank' href=http://127.0.0.1:8000/user?token={token}>CLICK ME</a>"""
            sendMail(email, 'Баталгаажуулах код', bodyHTML)
            con.commit()

            print(f"##################11 юу хийгээд байгааг ойлгоу байнуу")
            return sendResponse(200, action='register', data=[])

    except Exception as e:
        print(f'###############################: {e}')
        return sendResponse(5004)


def getnews(request):

    jsons = json.loads(request.body)
    action = jsons['action']

    try:
        with connectDB() as con:
            cur = con.cursor()
            query = '''SELECT n.nid, news_title, n.content, huraangvi, published_at, c.cat_id, c.category_name , image_url
           FROM t_amay_news n
           LEFT JOIN t_amay_news_category c on n.category_id=c.cat_id
           ORDER BY n.nid ASC'''

            cur.execute(query)
            columns = cur.description
            rest = [{columns[index][0]: column
                     for index, column in enumerate(value)} for value in cur.fetchall()]

            resp = sendResponse(action=action, data=rest, resultCode=200)
            return resp

    except Exception as e:
        print(f"############################ {e}")
        return sendResponse(5000)


def getcategory(request):

    jsons = json.loads(request.body)
    action = jsons['action']

    try:
        with connectDB() as con:
            cur = con.cursor()
            query = '''SELECT * FROM t_amay_news_category'''
            cur.execute(query)
            columns = cur.description
            rest = [{columns[index][0]: column
                     for index, column in enumerate(value)} for value in cur.fetchall()]

            resp = sendResponse(action=action, data=rest, resultCode=200)
            return resp

    except Exception as e:
        # print(f"############################ {e}")
        return sendResponse(5000)


def search_news(request):
    jsons = json.loads(request.body)
    action = jsons['action']

    try:
        with connectDB() as conn:
            cur = conn.cursor()
            query = '''select news_title, content, huraangvi  from t_amay_news'''
            cur.execute(query)
            columns = cur.description
            rest = [{columns[index][0]: column
                     for index, column in enumerate(value)} for value in cur.fetchall()]

            resp = sendResponse(action=action, data=rest, resultCode=200)
            return resp

    except Exception as e:
        print(f"############################ {e}")
        return sendResponse(5000)
