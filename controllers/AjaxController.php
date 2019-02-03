<?php
require_once '../vendor/autoload.php';
require_once '../config/app.php';
use Controllers\errors\ErrorsHand;
use Controllers\{ValidateController, CoreController};
// Точка входа приложения.
// Устанавливаем пользовательский обработчик ошибок.
new ErrorsHand();
// Если клиент перешел в скрипт не из Ajax функции направляем на главную страницу.
if(!isset($_SERVER['HTTP_X_REQUESTED_WITH']))
{
    header('HTTP/1.1 301 Moved Permanently');
    header("Location: http://".$_SERVER['HTTP_HOST']."/".main_dir."/layot/index.php");
    exit();
}

$correct_data = new ValidateController();
$func = $correct_data->nameFunc;
CoreController::$func($correct_data->date);
