<?php
namespace Controllers;
use Models\Journal;
/*
 * Входными параметрами являются отфильтрованные данные, переданные из ValidateController.
 * Возвращаем ответ обратно в Ajax, содержащий запрошенный вид(если необходимо) + данные, либо массив с ошибками.
 */
class CoreController 
{
    static function get($position) 
    {   
        header('Content-Type: application/json');
        $model = new Journal();
        $data = $model->Read($position['page']);
        if($data)
        {
            $data['errors'] = false;
            echo json_encode($data);
        }else
        {
            echo json_encode(['errors' => 'Ошибка при обращении к БД']);
        }
    }

    static function read($id)
    {     
        header('Content-Type: application/json');
        $model= new Journal();
        $data=$model->ReadOne($id);
        $data['text'] = nl2br($data['text']);
        $http=file_get_contents("http://".$_SERVER['HTTP_HOST']."/".main_dir."/views/read.php");
        if($data)
        {
            echo json_encode(['view'=>$http,'article'=>$data]);
        }else
        {
            echo json_encode(['errors' => 'Данная статья не найдена в БД']); 
        }
    }

    static function create($data=null)
    {
        header('Content-Type: application/json');
        $http=file_get_contents("http://".$_SERVER['HTTP_HOST']."/".main_dir."/views/createUpdate.php");
        // Зашли в форму create_update.php для создания новой статьи
        if (!$data)
        {
            echo json_encode(['view'=>$http]);
        // Зашли в форму create_update.php для редактирования
        }else
        {
            $model= new Journal();
            $article=$model->ReadOne($data['id']);
            if($data)
            {
                echo json_encode(['view'=>$http,'article'=>$article]);
            }else
            {
                echo json_encode(['errors' => 'Данная статья не найденна в БД']); 
            }
        }
    }

    static function update($data)
    {           
        header('Content-Type: application/json');
        $errors=[];
        $article=[];
        $article['title'] = $data['title'];
        $article['text'] = ($data['text']);
        $article['id'] = $data['id'];
        if(empty($article['title'])) 
        {
            $errors[]= 'Введите название статьи';
        }
        
        if(empty($article['text'])) 
        {
            $errors[]= 'Текст статьи не должен быть пустым';
        }
        if(!$errors && !empty($article['id']))
        {
            $model= new Journal();
            $result=$model->Update($article['title'], $article['text'], $article['id']);
            if($result)
            {
                http_response_code(200);
                echo json_encode(['result'=> 'updated']);
            }else $errors[]= 'Не удалось обновить статью в БД';
        }
        if ($errors) 
        {
            echo json_encode(['errors'=>$errors]);   
        }
    }

    static function store($data)
    {   
        header('Content-Type: application/json');
        $article=[];
        $errors=[];
        $article['title'] = $data['title'];
        $article['text'] = ($data['text']);
        if(empty($article['title'])) 
        {
            $errors[]= 'Введите название статьи';
        }
        
        if(empty($article['text'])) 
        {
            $errors[]= 'Текст статьи не должен быть пустым';
        }
        
        if(!$errors)
        {
            $model= new Journal();
            $result=$model->Create($article['title'], $article['text']); // В случае успеха содержит lastInsertId;
            if($result)
            {
                http_response_code(201);
                echo json_encode(['id'=>$result]);
            }else $errors[]= 'Не удалось создать статью в БД';
        }
        if($errors) 
        {
            echo json_encode(['errors'=>$errors]);
        }
    }

    static function delete($id)
    {
        header('Content-Type: application/json');
        $errors=[];
        if(!$id) 
        {
            $errors= 'Не передан параметр id для удаляемой статьи!';
        }
        if(!$errors)
        {
            $model= new Journal();
            $result=$model->Delete($id);
            if($result)
            { 
                echo json_encode(['result'=>$result]);
            }else $errors[]= 'Не удалось удалить статью из БД';
        }
        if($errors) 
        {
            echo json_encode(['errors'=>$errors]);
        }
    }
}
?>