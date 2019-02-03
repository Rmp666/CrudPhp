import 'bootstrap'; // Подключаем bootstrap.js
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/my.css';

import crud from './crudController'; 

var app = function () {
    //Вход в приложение. Привязка событий, отображение страницы в зависимости от URL
    function start()
    {
        window.onpopstate = popState; // Обработка back\forward
        $('body').on('click', 'a[link="ajax"]', navigate); // Клик только по ссылкам link="ajax"
        $('body').on('click', '.back', function () {history.back(); });
        var hash = (location.hash == '') ? '#all'  : location.hash;
        init({target:{hash:hash} });
    }

    function popState(e) 
    {   
        // Если объект истории пуст(зашли на сайт) или содержит переход на модальное окно переходим на главную страницу
        var hash = ((e.state && e.state.hash) && (e.state.hash.indexOf('#showModal') === -1) )? e.state.hash :  '#all'; 
        var param = {target:{hash:hash}};
        init(param);
    }

    function navigate(e) 
    {
        e.stopPropagation();
        e.preventDefault();
        var hash = e.target.hash;
        init (e);
        history.pushState({hash: hash}, '', hash); // Заполняем объект истории. 
    }

    function init (e) 
    {
        var hash = e.target.hash;

        if (hash.indexOf('#all') === 0) 
        {
            $('#divContent').empty();
            crud.get(hash.substr(11)? hash.substr(11) : 1);
        } 

        if (hash.indexOf('#create') === 0 && hash.indexOf('#create/?id=') === -1) 
        {
            crud.create();
        }

        if (hash.indexOf('#read/?id=') === 0) 
        {
            var id = hash.substr(10);
            crud.read(id);
        }

        if (hash.indexOf('#create/?id=') === 0) 
        {
            var id = hash.substr(12);
            crud.create(id);
        }

        if (hash.indexOf('#showModal') === 0) 
        {   
            var arr = decodeURI(hash).substr(12).split('|');
            var idTitlePage =[];
            for (var i = 0; i < arr.length; i++)
            {
                idTitlePage.push(arr[i].split('='));
            }

            crud.showModal(idTitlePage[0][1], idTitlePage[1][1], idTitlePage[2][1]);
        }
    }
    return {
       start: start
    }
}();

$(document).ready(function () {
    app.start();
    crud.bind();
});