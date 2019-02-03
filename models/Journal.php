<?php 
namespace Models;
use PDO; 

/**
 * Входные параметры из CoreController. Процедура create_table_journals(): автоматически создает таблицу, если необходимо(при отображении главного вида). 
 */
class Journal
{
    protected $pdo_link;
    protected $articles_on_page = 4;

    function __construct()
    {  
        $this->pdo_link = Pdo_link::getConnection();
    }

    public function Create($title, $text)
    {
        $desc = mb_strimwidth($text, 0, 440, "...");
        $query = $this->pdo_link->prepare("INSERT INTO journals(title, text, describle) VALUES (:title,:text,:describle)");
        $query->bindParam("title", $title, PDO::PARAM_STR);
        $query->bindParam("text", $text, PDO::PARAM_STR);
        $query->bindParam("describle",  $desc, PDO::PARAM_STR);
        $result=$query->execute();
        return $this->pdo_link->lastInsertId();
    }

    /*
     * Отображение всех статей из БД
     * */
    public function Read($page)
    {
        $count = $this->count('journals');
        $offset = ($page-1)*$this->articles_on_page;
        $query = $this->pdo_link->prepare("SELECT title, describle, id FROM journals LIMIT $this->articles_on_page OFFSET $offset");
        $query->execute();
        $data = array();
        while ($row = $query->fetch()) {
            $data[] = $row;
        }
        return 
        [
            'articles' => $data,
            'page' => $page,
            'totalArticles' => $count,
            'articles_on_page' => $this->articles_on_page
        ];
    }

    /*
     *
     * */
    public function Delete($id)
    {
        $query = $this->pdo_link->prepare("DELETE FROM journals WHERE id = :id");
        $query->bindParam("id", $id);
        return $query->execute(); // Возвращает bool true  или  false.
    }

    /*
     * 
     */
    public function Update($title, $text, $id)
    {    
        $desc = mb_strimwidth($text, 0, 440, "...");
        $upd = date('Y-m-d H:i:s');
        $query = $this->pdo_link->prepare("UPDATE journals SET title = :title, text = :text, describle = :describle, updated= :updated WHERE id = :id");
        $query->bindParam("title", $title, PDO::PARAM_STR);
        $query->bindParam("text", $text, PDO::PARAM_STR);
        $query->bindParam("describle", $desc, PDO::PARAM_STR);
        $query->bindParam("updated", $upd);
        $query->bindParam("id", $id, PDO::PARAM_STR);
        return $query->execute(); 
    }

    /*
     *  ++ Количество просмотров статьи - contview при чтении и редактировании. 
     */
    public function ReadOne($id)
    {
        $query = $this->pdo_link->prepare("SELECT title, text, contview FROM journals WHERE id = :id");
        $query->bindParam("id", $id, PDO::PARAM_STR);
        $query->execute();
        $result=$query->fetch(); 
        $result['contview']++;
        $query = $this->pdo_link->prepare("UPDATE journals SET contview = :contview  WHERE id = :id");
        $query->bindParam("contview", $result['contview']);
        $query->bindParam("id", $id, PDO::PARAM_STR);
        $query->execute();
        return $result; // Содержит статью с измененным счетчиком просмотра contview.
    }
    
    /*
     * Количество записей в определенной таблице, относящейся к виду. 
     */
    private function count ($tableName)
    {
        $query = $this->pdo_link->prepare("SELECT count(*) count FROM $tableName");
        $query->execute();
        $articles = $query->fetch();
        return  (int)$articles['count'];
    }
    
    function __destruct() 
    {
       $this->pdo_link= null;
    }
}
?>
