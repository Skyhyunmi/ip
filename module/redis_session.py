from redis import Redis,StrictRedis
from uuid import uuid4

class redis_session:
    prefix = 'was:session_key:' # Redis key 앞에 넣을 값
    server_ip = 'localhost' # Redis ip
    port = 6379

    def __init__(self):
        self.db = StrictRedis(host=self.server_ip, port=self.port,db=0)


    # 세션이 있으면 타임아웃 만큼 다시 연장해주고 없으면 False 있으면 사용자id 리턴
    def open_session(self, session_key):
        user_name = self.db.get(self.prefix+session_key)
        return user_name

    # 신규 세션 요청 시 세션 값을 만들어서 리턴
    def save_session(self, user_name):
        session_key = str(uuid4())
        try:
            self.db.set(self.prefix+session_key, user_name)
        except:
            print('error')
        return session_key
