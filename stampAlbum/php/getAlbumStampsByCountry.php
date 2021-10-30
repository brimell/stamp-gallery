<?php


header("Content-Type: application/json", true);
header("Access-Control-Allow-Origin: *", true);

include 'vars.php';

$stmt = $dbh->prepare('select * from stamps s  join country c on (s.Country = c.name)  left outer join albumPages a on (s.id = a.stampid) where c.id = :countryid');
$stmt->bindParam(':countryid', $_GET["countryid"]);
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
echo json_encode($returnVAR,128);




?>
