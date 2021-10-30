<?php 
//unicode
header("Content-Type: application/json", true);
header("Access-Control-Allow-Origin: *", true);

include 'vars.php';


    $stmt = $dbh->prepare('select Country, count(Country) as "count" from stamps  group by Country');


$stmt -> execute();

$returnVAR = array();

//MYSQLI_NUM = Array items will use a numerical index key.
//MYSQLI_ASSOC = Array items will use the column name as an index key.
//MYSQLI_BOTH = [default] Array items will be duplicated, with one having a numerical index key and one having the column name as an index key.
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $returnVAR[$row['Country']] = intval($row['count']);
}

$jsonStr = json_encode($returnVAR,128);

echo json_encode($returnVAR,128);
?>