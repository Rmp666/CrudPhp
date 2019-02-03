<?php
namespace Controllers\errors;
/**
 *  Фатальные ошибки перехватывает функция exceptionHandler. Объекты классов Error, Exception (интерфейс Throwable для PHP7) + PDO_Exception. 
 */
class ErrorsHand 
{
    public function __construct() 
    {
        if (DEBUG['show_errors'])
        {
            ini_set('display_errors', 'on');
            error_reporting(-1);
        } else 
        {
            ini_set('display_errors', 'off');
            error_reporting(0);
        }
        set_exception_handler([$this, 'exceptionHandler']);
        set_error_handler([$this, 'errorHandler']);
    }
    // Если код ответа сервера не задан в выброшенном нами исключении в качестве 2го аргумента, то используем 500.
    public function exceptionHandler($e) 
    {   
        $this->errorsShowLog(get_class($e), $e->getMessage(), $e->getFile(), $e->getLine(), ($e->getCode() === 0)? 500: $e->getCode(), $e->getTraceAsString());
        exit();
    }
    
    public function errorHandler($errno, $errmsg, $errfile, $errline) 
    {
        $this->errorsShowLog($errno, $errmsg, $errfile, $errline);
        exit();
    }
    // Отображаем информацию в зависимости от настроек в app.php.
    public function errorsShowLog($errno, $errmsg, $errfile, $errline, $resp=500, $stack ='unknown') 
    {
        if (DEBUG['show_errors'])
        {
            is_numeric($resp)?  http_response_code($resp) : http_response_code(500);
            echo json_encode(['errors' => 
                    [   
                        'Код ошибки(Класс): '.$errno, 
                        'Текст ошибки: '.$errmsg, 
                        'Файл c ошибкой: '.$errfile, 
                        'Строка: '.$errline, 
                        'Код ответа сервера: '.$resp,
                        'Стек вызова: '.$stack
                    ] 
                ]);  
        }else 
        { 
            http_response_code($resp);  
            echo json_encode(['errors' => ['Текст ошибки: '.$errmsg, 'Код ответа сервера: '.$resp] ]);  
        }
            
        if (DEBUG['log_errors'])
            error_log ("(".date('Y-m-d H:i:s').");\nТекст ошибки: {$errmsg};\nФайл: {$errfile};\nСтрока: {$errline};\n***\n", 3, __DIR__.'/errors.log');
    }
}

