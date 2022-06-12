from faker import Faker
import random
import string

fakeNick = Faker()
fakeName = Faker('ru_RU')
# for i in range(100):
#     letters = string.ascii_lowercase
#     address = ''.join(random.choice(letters) for i in range(25)) + '@mail.ru';
#     name = (fakeName.name().split(' ')[:2])
#     nick = fakeNick.name().replace(' ', '_').replace('.', '')
#     print("INSERT INTO Users (nick, mail, firstName, lastName, photoName,createdAt, updatedAt) VALUES ('"+nick+"','"+address+"','"+name[1]+"','"+name[0]+"','"+nick+".png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);");
    
