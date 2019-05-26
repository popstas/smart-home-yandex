Цель проекта: подключить устройства Sonoff с прошивкой Tasmota к умному дому Яндекса через приватный навык. Подходит для других устройств с управлением по MQTT.

## Особенности
- Устройства добавляются через конфиг
- Поддерживаются только устройства типа On_off
- Статус устройства обновляется в Яндексе при переключении устройства извне (с ограничениями, см. баги)
- В коде части auth и provider разделены по файлам

Предполагается, что вы умеете настраивать https перед сервером, например, через nginx и letsencrypt.

Также, тут не написано, как поднять MQTT брокер, научить устройства понимать MQTT команды.

## Использование

1. Скопируйте config.exemple.js в config.js, пропишите ваши доступы к MQTT и устройства. Пример объявления устройства:

2. Запустите сервер (npm start), он поднимется на порту 5554.

3. Опубликуйте сервер на общедоступном домене через https, например, https://myhome.ru

4. Создайте связку на https://dialogs.yandex.ru/developer/settings/oauth  
4.1. URL авторизации: https://myhome.ru/auth/auth  
4.2. URL для получения токена: https://myhome.ru/auth/token  
4.3. Название, идентификатор и секрет приложения могут быть любыми, остальные поля оставьте пустыми.

5. Создайте навык типа "Умный дом" на https://dialogs.yandex.ru/developer  
5.1. Endpoint URL: https://myhome.ru/provider  
5.2. Название и иконка будут отображаться в списке провайдеров при подключении устройств.  
5.3. Навык должен быть приватным, для публичных провайдеров это не подойдёт.

6. Отправьте навык на модерацию и опубликуйте. Модерация и публикация не настоящие, проходят мгновенно и автоматически.

7. Подключите провайдера к своему аккаунту  
7.1. В приложении Яндекс зайдите в Устройства - Умный дом - Добавить - Устройство, пролистайте вниз, там должен быть ваш провайдер.
Нажимте "Объединить аккаунты".  
7.2. На открывшейся странице нажмите "Подключить умный дом"  
7.3. Вас должно вернуть в приложение, нажмите там "Обновить список устройств"

После этого у вас всё должно заработать.

## Запуск через Docker
Для постоянного использования я запускаю сервер под Docker, можно сделать это так:

1. Скачать docker-compose.yml и config.js (проще склонировать проект).

2. Настроить конфиг под себя (не забудьте, что если MQTT брокер крутился просто на localhost, внутри Docker уже не прокатит localhost).

3. Запустить `docker-compose up -d` в папке с docker-compose.yml

Если всё пройдет нормально, сервер будет автозапускаться, логи можно посмотреть через docker-compose logs или docker logs.


## Найденные баги

1. Состояния устройств плохо считываются.  
1.1. Если включить свет мимо Алисы, но при этом обновить статус устройства в /v1.0/user/devices, в приложении он не появится.  
1.2. Если включить свет через Алису, выключатель в приложении переключится, но после обновления списка устройств перейдет в выключенный режим, хотя /v1.0/user/devices говорит, что он включен.  
1.3. Если зайти внутрь устройства, то только тогда его статус в списке обновится до актуального.

2. Список устройств плохо обновляется  
2.1. Жест обновления в списке устройств не отправляет запрос на получение списка устройств.  
2.2. Если добавить устройство с новым id, оно не появится, пока не зайти в добавление устройства и не нажать Обновить список устройств.  
2.3. Если изменить существующее устройство (без изменения id), оно не обновится, пока не перепривязать аккаунт провайдера.  
2.4. Если удалить устройство, оно не пропадет до перепривязки аккаунта провайдера.
