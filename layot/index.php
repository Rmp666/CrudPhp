<html>
    <head>
        <meta charset="utf-8">
        <title>Обзор всех статей</title>
    </head>
    <body>        
        <nav class="navbar navbar-expand-lg navbar-light bg-light navig">
            <a class="navbar-brand">Журнал</a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNavDropdown">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a href="#all/page=1" id ="all" class="nav-link" link="ajax">Главная<span class="sr-only">(current)</span></a>
              </li>
              <li class="nav-item">
                <a href="#create" id ="create" class="nav-link" link="ajax">Написать статью<span class="sr-only">(current)</span></a>
            </ul>
          </div>
        </nav>
        <div class="container col-md-12 divcontainer" id="divContent">   
            <!-- Заполняем первоначальными данными в функции get();-->
        </div>
        <!-- Delete реализован модальным окном-->
        <div id="modal" class="modal fade" data-dismiss="modal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <!-- Заголовок модального окна -->
                    <div class="modal-header">
                        <h4 class="modal-title">Вы уверенны что хотите удалить данную статью?</h4>
                    </div>
                    <!-- Основное содержимое модального окна -->
                    <div class="modal-body" id="titleMod"></div>
                    <!-- Футер модального окна -->
                    <div class="modal-footer">
                        <button type="button" id="cancel" class="btn btn-default" data-dismiss="modal">Отмена</button>
                        <button type="button" id="del" class="btn btn-primary">Удалить</button>
                    </div>
                </div>
            </div>
        </div>
        
        <footer class=" footer text-center" >
            <h6 id="footer"></h6>
        </footer>
        
        <script src="..\dist\bundle.js?t=<?= time(); ?>"></script>
    </body>
</html>   