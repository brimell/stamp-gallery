<?php


include 'vars.php';

$stmt = $dbh->prepare('select c.id, country, flag_image, image_x, image_y, count(country) as count from stamps s   join country c on s.Country = c.name join albumPages a on (s.id = a.stampid) group by c.id, country, flag_image, image_x, image_y order by country');
$stmt -> execute();

$returnVAR = array();

//MYSQLI_NUM = Array items will use a numerical index key.
//MYSQLI_ASSOC = Array items will use the column name as an index key.
//MYSQLI_BOTH = [default] Array items will be duplicated, with one having a numerical index key and one having the column name as an index key.
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $returnVAR[] = $row;
}

$jsonStr = json_encode($returnVAR,128);
//unicode
header("Content-Type: application/json", true);
header("Access-Control-Allow-Origin: *", true);
echo json_encode($returnVAR,128);


?>