<?php 

header("Content-Type: application/json", true);
header("Access-Control-Allow-Origin: *", true);
include 'vars.php';

$stmt = $dbh->prepare('update albumPages set stampid = :stampid where albumPageRegionId = :regionid and pageid = :pageid');
$stmt->bindParam(':pageid', $_GET["pageid"]);
$stmt->bindParam(':regionid', $_GET["regionid"]);
$stmt->bindParam(':stampid', $_GET["stampid"]);
$passed = $stmt -> execute();


$jsonStr = json_encode($passed,128);
//unicode

echo $jsonStr;
?>
