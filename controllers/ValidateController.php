<?php
namespace Controllers;
use Exception;
/*
 * Выполняем валидацию данных пришедших с клиента.
 * Входными параметрами являются метод запроса и данные, переданные из Ajax.
 * Возвращаем название функции, которая выполняет необходимые действия с моделью и передаем в нее отфильтрованные данные(или null).
 */
class ValidateController 
{   
    public  $nameFunc;
    public  $date;
    private $method;
    
    public function __construct() 
    { 
        $this->method = htmlentities($_SERVER['REQUEST_METHOD']);
        switch ($this->method)
        {
            case ('PUT'):
            case ('DELETE'):
                $this->emulateMethod();
                break;
            case ('GET'):
                $this->date = $this->check_arr($_GET);
                $this->getSpecify();
                break;
            case ('POST'):
                $this->date = $this->check_arr($_POST);
                $this->postSpecify();
                break;
            default:
                throw new Exception('Неверный HTTP запрос', 400);
        } 
    }
    
    private function emulateMethod() 
    {
        $rawData= str_ireplace(["<", ">", "/>", "script","?"], "", file_get_contents('php://input')); 
        $data= [];
        // Формируем корректные данные переданные нам из Ajax методом PUT или DELETE (php не создает для них суперглобальных массивов) и записываем в $this->date.
        if (strstr($rawData, '&')) 
        {
            $keyName = explode('&', $rawData);  
            foreach($keyName as $pair) 
            { 
                $item = explode('=', $pair); 
                if(count($item) == 2) 
                { 
                    $data[urldecode($item[0])] = urldecode($item[1]); //Декодировать если используется кирилица в Ajax переменных.
                } 
            } 
        }else 
        { // Если передан один параметр.
            $item = explode('=', $rawData);
            if(count($item) == 2) 
            { 
                $data[urldecode($item[0])] = urldecode($item[1]); 
            }
        }
        
        $this->date = $this->check_arr($data); 
        if($this->method == 'PUT')
        {
            $this->putSpecify();  
        }elseif ($this->method == 'DELETE')
        {
            $this->deleteSpecify();
        }
    }
    
    private function getSpecify()
    {
        if(isset($this->date['name']))
        {
            if($this->date['name'] == 'get')
            {   
                unset($this->date['name']);
                $this->nameFunc = 'get';
                return;
            }
            if($this->date['name'] == 'read' && $this->date['id'])
            {   
                $this->date = $this->date['id'];
                $this->nameFunc= 'read';
                return;
            }
            if($this->date['name'] == 'create')
            {
                if($this->date['id'] === '')
                {
                    $this->date = null;
                }
                unset($this->date['name']);
                $this->nameFunc='create';
                return;
            }
        }throw new Exception('Недостаточно параметров для выполнения запроса', 400);
    }
    
    private function postSpecify() 
    {
        if((isset($this->date['name']) && isset($this->date['title']) && isset($this->date['text'])) AND ($this->date['name'] == 'store'))
        {   
            unset($this->date['name']);
            $this->nameFunc = 'store';
            return;
        }throw new Exception('Недостаточно параметров для выполнения запроса', 400);
    }
    
    private function putSpecify() 
    {
        if((isset($this->date['name']) && isset($this->date['title']) && isset($this->date['text']) && isset($this->date['id']))AND($this->date['name'] == 'update'))
        {   
            unset($this->date['name']);
            $this->nameFunc = 'update';
            return;
        }throw new Exception('Недостаточно параметров для выполнения запроса', 400);
    }
    
    private function deleteSpecify() 
    {
        if((isset($this->date['name']) && isset($this->date['id'])) AND  ($this->date['name'] == 'delete'))
        {    
            unset($this->date['name']);
            $this->nameFunc = 'delete';
            $this->date = $this->date['id'];
            return;
        }throw new Exception('Недостаточно параметров для выполнения запроса', 400);
    }
    
    private function check_arr(array $param): array
    {   
        if(is_array($param) && !empty($param))
        {
            $correct =[];
            foreach ($param as $key => $value)
            {

                if(count ($param[$key]) > 1)
                { 
                    $correct[$key] =[];
                    foreach ($value as $totkey => $totvalue)
                    {
                        $correct[trim(htmlentities($key))][trim(htmlentities($totkey))] = trim(htmlentities($totvalue));
                    }
                }else
                {
                    $correct[trim(htmlentities($key))] = trim(htmlentities($value));
                }
            }
            return $correct;
        }
    }
}