import pagination from './pagination';

var crud = (function() {

    function bind () 
    {
        $("#footer").text("Журнал "+new Date().getFullYear());
        // Привязываем click к кнопке del модального окна и считываем из нее id, передаваемое функции remove(id);
        $('#del').click(function() {remove($('#del').data()); });
        $('body').on('keyup', '#title, #text', validity);
        $('body').on('click', '#res', function () {setTimeout(validity, 100);} );
        $('body').on('click', '#save', function() {$('#save').data('id')? edit($('#save').data('id')) : store(); });
    }

    function get(page) {
        var name = 'get';
        $.ajax({
            url:'../controllers/AjaxController.php',
            type:'GET',
            cache:false,
            data:{'name':name, 'page':page},
            dataType:'html',
            success: function(data) {
                var correct_data = JSON.parse(data);
                if (correct_data.errors === false) {
                    // Приходит массив correct_data.articles, где каждая строка содержит одну статью.
                    // Формируем massive, где каждая строка содержит 4 статьи.
                    var massive =[ ];
                    var j = 0;
                    for(var i = 0; i<correct_data.articles.length; i++) {
                        if (typeof massive[j] == 'undefined') {
                            massive[j] = [];
                        }
                        massive[j].push(correct_data.articles[i]);
                            if(massive[j].length == 4) {
                                j++;
                            }
                    }

                    for (var i = 0; i < massive.length; i++) {
                        // Формируем строку
                        var div_row = $('<div>',{class:"row divrow"});
                        // Добавляем в строку 4 колонки
                        for (var j = 0; j < massive[i].length; j++) {    // massive[i].length == 4
                            // Формируем колонку в функции htmlTag.
                            var div_col = htmlTag(massive[i][j]);
                            div_row.append(div_col);
                        }
                        // Добавляем строку в наш divContent.
                        $('#divContent').append(div_row);
                    }  
                    
                    pagination.init(+correct_data.page, +correct_data.totalArticles, +correct_data.articles_on_page, $('#divContent'));
                }else {
                    alert(correct_data.errors);
                }
            },
            error: function(err) {
                // Получаем корректный массив ошибок с сервера
                var err_text = JSON.parse(err.responseText);
                // Форматируем и выводим ошибку пользователю
                var errorsHtml='';
                for (var i = 0; i < err_text.errors.length; i++) {
                    errorsHtml += err_text.errors[i] + '<br>';
                }
                $("#divContent").html(errorsHtml);
            }
       });
    }

    function htmlTag(massive) {
        var div_col = $('<div>',{class:"col-6 col-sm-6 col-lg-3 divcol"});
            var div_panel = $('<div>',{class:"panel panel-default"});
                var div_head = $('<div>',{class:"panel-heading font-weight-bold"});
                    var a = $('<a>');
                    a.html(massive['title']);
                    div_head.append(a);
                var div_body = $('<div>',{class:"panel-body bw"});
                div_body.html(massive['describle']);
                    var button1 = $('<a>',{class:"text-muted", id:"read", link:"ajax", href:"#read/?id="+massive['id'], text: "Подробнее"});
                    div_body.append('<br>', button1);
                var div_footer = $('<div>',{class:"panel-footer"});
                    var button2 = $('<a>',{class:"default btn black", id:"update", link:"ajax", href:"#create/?id="+massive['id'], text: "Редактировать"});
                    // Считываем страницу на которой находимся из location.hash. На первой странице якоря нет.
                    var page = (location.hash.substr(location.hash.indexOf('page=')) ) ? location.hash.substr(location.hash.indexOf('page=')) : "page=1";
                    var button3 = $('<a>',{class:"del btn black", id:"delete", link:"ajax", href:"#showModal/?id="+massive['id']+"|title="+massive['title'] +"|"+page, text: "Удалить"});
                    div_footer.append(button2, button3);
            div_panel.append(div_head, div_body, div_footer);
        div_col.append(div_panel);
        
        return(div_col);
    }               

    function read(id) {
        $('body').scrollTop(0);
        var name = 'read';
        var id = id;
        
        $.ajax({
            url:'../controllers/AjaxController.php', 
            type:'GET',
            cache:false,
            data:{'name':name, 'id':id},
            dataType:'html',
            success: function(data) {
                var correct_data = JSON.parse(data);
                if (correct_data.view && correct_data.article) {
                    console.log($('#textfull').text);
                    $('#divContent').html(correct_data.view); 
                    $('#titlefull').html (correct_data.article.title);
                    $('#textfull').html (correct_data.article.text);
                    $('#contview').html ('Количество просмотров данной статьи '+correct_data.article.contview);
                }else alert(correct_data.errors);
            },
            error: function(err) {
                // Получаем корректный массив ошибок с сервера
                var err_text = JSON.parse(err.responseText);
                // Форматируем и выводим ошибку пользователю
                var errorsHtml='';

                for (var i = 0; i < err_text.errors.length; i++) {
                    errorsHtml += err_text.errors[i] + '<br>';
                }
                $("#divContent").html(errorsHtml);
            }
       });
    }

    function create(id) {
       $('body').scrollTop(0);
       var id = (id)? id : null;
       var name = 'create';
       
       $.ajax({
            url:'../controllers/AjaxController.php',
            type:'GET',
            cache:false,
            data:{'name':name, 'id':id},
            dataType:'html',
            success: function(data) {
                var correct_data = JSON.parse(data);
                // Если нам необходимо создать статью, то с сервера пришел шаблон view без данных.
                if (correct_data.view && correct_data.article === undefined) {
                    $('#divContent').html(correct_data.view); 
                // Если нам необходимо обновить статью, то с сервера пришел шаблон view с данными.
                }else if (correct_data.view && correct_data.article) {
                    $('#divContent').html(correct_data.view);
                    $('#title').val(correct_data.article.title);
                    $('#text').html(correct_data.article.text);
                    // Сохраняем id обновляемой статьи.
                    $('#save').data("id", id); 
                }else alert(correct_data.errors);  
                validity(); // Валидация данных после отрисовки шаблона correct_data.view 
            },
            error: function(err) {
                // Получаем корректный массив ошибок с сервера
                var err_text = JSON.parse(err.responseText);
                // Форматируем и выводим ошибку пользователю
                var errorsHtml='';
                for (var i = 0; i < err_text.errors.length; i++) {
                    errorsHtml += err_text.errors[i] + '<br>';
                }
                $("#divContent").html(errorsHtml);
            }
       });
    }

    function edit(id) {
        var id = id;
        var name = 'update';
        var title = $('#title').val();
        var text = $('#text').val();
        
        $.ajax({
            url:'../controllers/AjaxController.php',
            type:'PUT',
            cache:false,
            data:{'name':name, 'title':title, 'text':text, 'id':id},
            dataType:'html',
            success: function(data) {
                $("#errors").css("display", 'none');//Скрываем span с ошибками
                $("#errors").html(""); // Очишаем span с ошибками
                var correct_data = JSON.parse(data);
                if (correct_data.result === 'updated') {
                    alert('Cтатья отредактированна успешно'); 
                    $('#divContent').empty();
                    location.hash ="#all/page=1";
                }else {
                    $("#errors").css("display", 'flex');//Оторбражаем span с ошибками
                    for(var i = 0; i < correct_data.errors.length; i++) {
                        $("#errors").html($("#errors").html() + correct_data.errors[i]+'<br />'); // Заполняем span ошибками с сервера
                    }
                }
            },
            error: function(err) {
                // Получаем корректный массив ошибок с сервера
                var err_text = JSON.parse(err.responseText);
                // Форматируем и выводим ошибку пользователю
                var errorsHtml='';
                for (var i = 0; i < err_text.errors.length; i++) {
                    errorsHtml += err_text.errors[i] + '<br>';
                }
                $("#divContent").html(errorsHtml);
            }
       });
    }

    function store() {
        var name = 'store';
        var title = $('#title').val();
        var text = $('#text').val();
        
        $.ajax({
            url:'../controllers/AjaxController.php',
            type:'POST',
            cache:false,
            data:{'name':name, 'title':title, 'text':text},
            dataType:'html',
            success: function(data) {
                $("#errors").css("display", 'none');//Скрываем span с ошибками
                $("#errors").html(""); // Очишаем span с ошибками
                var correct_data = JSON.parse(data);
                if(typeof correct_data.id !== "undefined") {
                    alert('Cтатья добавлена успешно'); 
                    $('#divContent').empty();
                    location.hash ="#all/page=1";
                }else {
                    var formErrors= '';
                    for(var i = 0; i < correct_data.errors.length; i++) {
                        formErrors += correct_data.errors[i]+ '<br>'; // Заполняем span ошибками с сервера
                    }
                    $("#errors").html(formErrors).css("display", 'flex');//Оторбражаем span с ошибками
                }
            },
            error: function(err){
                // Получаем корректный массив ошибок с сервера
                var err_text = JSON.parse(err.responseText);
                // Форматируем и выводим ошибку пользователю
                var errorsHtml='';
                for (var i = 0; i< err_text.errors.length; i++){
                    errorsHtml += err_text.errors[i] + '<br>';
                }
                $("#divContent").html(errorsHtml);
            }
       });
    }

    function remove(id_on_page) {
        var name = 'delete';
        
        $.ajax({
            url:'../controllers/AjaxController.php',
            type:'DELETE',
            cache:false,
            data:{'name':name, 'id':id_on_page.data.id},
            dataType:'html',
            success: function(data) {
                var correct_data = JSON.parse(data);
                if (correct_data.result === true) {
                    // Если статья удалена успешно то скрываем окно и отображаем обновленный список всех статей.
                    $('#modal').modal('hide');
                    $('#divContent').empty();
                    get(id_on_page.data.at_page);
                }else {
                    $('#modal').modal('hide');
                    alert(correct_data.errors);
                }
            },
            error: function(err) {
                // Получаем корректный массив ошибок с сервера
                var err_text = JSON.parse(err.responseText);
                // Форматируем и выводим ошибку пользователю
                var errorsHtml='';
                for (var i=0; i<err_text.errors.length; i++) {
                    errorsHtml += err_text.errors[i] + '<br>';
                }
                $("#divContent").html(errorsHtml);
            }
       });
    }

    function showModal(id, title, page) {
        $("#modal").modal('show');
        $("#titleMod").html (title);
        // Записываем id удаляемой статьи.
        $('#del').data("data", { id: id, at_page: page}); 
    }

    function validity() {
        var title= $('#title').val().trim();
        var text= $('#text').val().trim();
        $("#errors").html(""); // Очишаем span с ошибками
        // Если пустой title и text деактивируем кнопку save
        if(title == '' || text == '') {
            $('#save').prop('disabled', true);
            var formErrors= '';
            if(title === '') {
                formErrors= 'Введите название статьи <br>';
            } 
            if(text === '') {
                formErrors+= 'Текст статьи не должен быть пустым';
            }
            $("#errors").html(formErrors).css("display", 'flex'); //Отображаем span с ошибками
        }else {
           $("#errors").css("display", 'none');//Скрываем span с ошибками
           $('#save').prop('disabled', false); // Отображаем кнопку save
       }
    }
    
    return {
        bind: bind,
        get: get,
        read: read,
        create: create,
        showModal: showModal
    }
})();

export default crud;
