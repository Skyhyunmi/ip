from Crypto.PublicKey import RSA
from Crypto.Hash import SHA256 as SHA
from Crypto.Signature import pkcs1_15

def createPEM():

    try:
        f = open("test_prkey.pem","r")
        p = open("test_pubkey.pem","r")
    except:
        prkey = RSA.generate(2048)
        pbkey = prkey.publickey()
        f = open("test_prkey.pem","wb+")
        f.write(prkey.export_key('PEM'))
        p = open("test_pubkey.pem","wb+")
        p.write(pbkey.export_key('PEM'))
    p.close()
    f.close()

def ReadPEM():
    # h = open("test_prkey.pem","r")
    h = open("client.key","r")
    key = RSA.import_key(h.read())
    h.close()
    return key

def rsa_sign(msg):
    prkey = ReadPEM()
    pubkey = prkey.publickey()
    hash = SHA.new(msg)
    signature = pkcs1_15.new(prkey).sign(hash)
    # Test 인증서(CA의 개인키로 암호화한 인증서)로 해시값을 암호화 했다!
    return pubkey, signature

def rsa_verify(pubkey, msg, signature):
    hash = SHA.new(msg)
    # pbkey는 위에서 root ca의 공개키다!
    try:
        # Root CA 인증서의 공개키로 복호화했더니 같다!
        pkcs1_15.new(pubkey).verify(hash,signature)
        return True
    except:
        return False

if __name__ == '__main__':
    # createPEM()
    msg = "My"
    msg = bytes(msg, "utf8")
    pubkey, signature = rsa_sign(msg)
    print(rsa_verify(pubkey, msg, signature))
