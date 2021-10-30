<?php 
include 'vars.php';


$stmt = $dbh->prepare('select s.ID, s.stamp_name, s.catalog_codes, s1.ID, s1.stamp_name, s1.catalog_codes ' .
    ' from stamps s join stamps s1 on (left(s.catalog_codes,20) = left(s1.catalog_codes,20) and s.ID != s1.ID)' .
    ' order by s.catalog_codes');
$passed = $stmt -> execute();


$pairs = array();

//MYSQLI_NUM = Array items will use a numerical index key.
//MYSQLI_ASSOC = Array items will use the column name as an index key.
//MYSQLI_BOTH = [default] Array items will be duplicated, with one having a numerical index key and one having the column name as an index key.
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $pairs[] = $row;
}
//var_dump($pairs);
for ($i = 0; $i < count($pairs); $i++) {
    echo $pairs[$i]['ID'] . ':' . $pairs[$i+1]['ID']."\r\n";
    $i = $i + 1;
}
//header("Access-Control-Allow-Origin: *", true);

?>