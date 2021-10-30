<?php

include 'vars.php';

header("Content-Type: application/json", true);
header("Access-Control-Allow-Origin: *", true);



$stmt = $dbh->prepare('select s.Series, c.id as "countryid", min(year) as "min_year", max(year) as "max_year", count(s.Series) as "count" from stamps s  join country c on (s.Country = c.name) where c.id = :countryid group by Series, c.id order by Series');
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
