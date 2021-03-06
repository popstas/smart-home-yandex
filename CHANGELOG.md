# [1.3.0](https://github.com/popstas/yandex-dialogs-smarthome-mqtt/compare/v1.2.0...v1.3.0) (2020-07-17)


### Bug Fixes

* правильное прослушивание изменения состояний разных устройств ([a741c37](https://github.com/popstas/yandex-dialogs-smarthome-mqtt/commit/a741c37))
* сохранение state при обновлении списка устройств ([8f9ddca](https://github.com/popstas/yandex-dialogs-smarthome-mqtt/commit/8f9ddca))


### Features

* поддержка properties (встроенные датчики) ([cabe741](https://github.com/popstas/yandex-dialogs-smarthome-mqtt/commit/cabe741))



# [1.2.0](https://github.com/popstas/yandex-dialogs-smarthome-mqtt/compare/v1.1.1...v1.2.0) (2020-06-28)


### Features

* поддержка разных умений устройств, поддержка одновременного изменения нескольких умений ([6818b23](https://github.com/popstas/yandex-dialogs-smarthome-mqtt/commit/6818b23))



## [1.1.1](https://github.com/popstas/yandex-dialogs-smarthome-mqtt/compare/v1.1.0...v1.1.1) (2020-06-28)


### Bug Fixes

* добавленные без перезапуска устройства теперь сразу работают ([8707247](https://github.com/popstas/yandex-dialogs-smarthome-mqtt/commit/8707247))



# [1.1.0](https://github.com/popstas/yandex-dialogs-smarthome-mqtt/compare/v1.0.0...v1.1.0) (2020-05-11)


### Bug Fixes

*  декларативный конфиг ([6572704](https://github.com/popstas/yandex-dialogs-smarthome-mqtt/commit/6572704))
* add data to docker volumes ([8094e5a](https://github.com/popstas/yandex-dialogs-smarthome-mqtt/commit/8094e5a))
* request_id from X-Request-Id ([e2a91dd](https://github.com/popstas/yandex-dialogs-smarthome-mqtt/commit/e2a91dd))
* исправлена ошибка с ненайденным устройством ([ca82dcd](https://github.com/popstas/yandex-dialogs-smarthome-mqtt/commit/ca82dcd))
* статус DEVICE_NOT_FOUND, если устройство пропало ([b6635a4](https://github.com/popstas/yandex-dialogs-smarthome-mqtt/commit/b6635a4))
* статус не обновлялся через mqtt stat topic ([8438d50](https://github.com/popstas/yandex-dialogs-smarthome-mqtt/commit/8438d50))
* уникальные id устройств по именам и расположению, исправление ошибок, связанных с переключением состояния ([6cec60a](https://github.com/popstas/yandex-dialogs-smarthome-mqtt/commit/6cec60a))


### Features

* /provider/v1.0/user/unlink ([82a2409](https://github.com/popstas/yandex-dialogs-smarthome-mqtt/commit/82a2409))
* route /provider/v1.0 ([245b794](https://github.com/popstas/yandex-dialogs-smarthome-mqtt/commit/245b794))
* добавление новых устройств без перезапуска ([6f71c01](https://github.com/popstas/yandex-dialogs-smarthome-mqtt/commit/6f71c01))



# [1.0.0](https://github.com/popstas/yandex-dialogs-smarthome-mqtt/compare/c5b2154...v1.0.0) (2019-05-26)


### Features

* управление mqtt устройствами, переписан весь код ([c5b2154](https://github.com/popstas/yandex-dialogs-smarthome-mqtt/commit/c5b2154))



