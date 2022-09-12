Чтоб запустить проект надо:
1) Загрузить пакеты:\
npm i
2) Создать .env со следущим содержанием:\
API_PORT=4001 // port\
PG_URI=postgresql://postgres:19981998@localhost:5432/index  // URI для подключения в бд\
TOKEN_KEY=jTZUCb2H193JC7XShK7W // secret для jwt\
FORCE=1 // для создания таблиц при пустой бд, после первого запуска удалите эту строку
3) Запустить проект:\
npm start

Роуты которые сейчас есть:
1) POST /login
2) POST /register
3) GET /welcome