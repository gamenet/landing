Что это такое?
===========

Если вы сюда попали скорее всего кто-то из компании GameNet попросил вас сделать для нас новую посадочную страницу. 
Для того, чтобы упростить нам интеграцию вашей работы создан этот шаблонный проект. Это сильно урезанная часть сайта
gamenet.ru, которая позволяет писать html/js/css код так, чтобы создать меньше конфликтов с остальной часть сайта и меньше
повторяться.

До того, как вы начнёте, немного обо всём сразу:

- Сверстанная вами страница должна работать в IE >= 10.0, последних версиях Edge, FF, Chrome/Yandex Browser, Opera
- Если не оговоре иное, полученная страница должна корректно отображаться для разрешения экрана <768px, >= 768px, >= 992px и >=1200px

Есть ограничения по технологиям?
===========

Шаблоны, которые вы напишите загружаются с помощью requirejs. Эти шаблоны - web components реализованные на knockout js.

- HTML5 + CSS доступный для указанной выше линейки браузеров.
- Не используйте полифилы. 
- Пишите ECMAScript 5.1 совместимый код. 
- Отдавайте предпочтение strict mode в JS. 
- Вам доступен jQuery 1.7.х, knockout 3.3. 

Если вы хотите использовать bootstrap для реализации отзывчивого дизайна и сетки - мы не будем против. Используйте 
ветку 3.х для этого. Любые добавляемые вами библиотеки и внешние компоненры должны быть добавлены через bower.
 
После запуска вы можете работать в шаблоне `public/page/landing` - вы найдете там модель, html шаблон и стиль. Изображения,
специфичные для вашей страницы должна быть расположены в `images/landing`. Если вам требуется веб шрифты - разместите их 
в папке `fonts/landing`. Столько заморочек нужно, чтобы наша сборочная машина смогла всё правильно сжать, упаковать и 
выложить на боевые сервера.

Используйте BEM нотацию для именования css классов. 

Сборка проекта
===============

Для начала работы вам потребуется устновленные:

- [PHP >=5.3](http://php.net/downloads.php)
- [composer](https://getcomposer.org/download/)
- [npm](https://nodejs.org/en/download/)
- [bower](http://bower.io/#install-bower)

После чего выполните в консоли:

    composer install
    
Cайт доступен по адресу `http://localhost/`


