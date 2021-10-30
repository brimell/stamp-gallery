<?php 

include 'vars.php';

$memkey = 'getStamps_'. $_GET["pageid"] . '_' . $_GET["seriesName"]. '_' . $_GET["countryid"];

// First we check that our cache server is available
// The $cacheAvailable variable was initialized when we connected to our cache server
if ($cacheAvailable == true)
{
    // Now we get the data from our cache server
    $returnVAR = $memcache->get($memkey);
}

// do we need to access MySQL ?
if (!$returnVAR || isset($_GET["force"])) {
    $returnVAR =  array();
    
    
    if (array_key_exists("pageid",$_GET)) {
        $stmt = $dbh->prepare('select s.*,c.id as "country_id", c.country_id as "iso_id",c.flag_image, c.image_x, c.image_y from stamps s inner join country c on s.Country = c.name where Public_Note REGEXP :pubnote');
        $query = $_GET["pageid"] . '[^0-9]';
        $stmt->bindParam(':pubnote', $query);
    } else if (array_key_exists("seriesName",$_GET)) {
        $stmt = $dbh->prepare('select s.*,c.id as "country_id", c.country_id as "iso_id",c.flag_image, c.image_x, c.image_y from stamps s inner join country c on s.Country = c.name where s.series = :seriesName and c.id = :countryid');
        $stmt->bindParam(':seriesName', $_GET["seriesName"]);
        $stmt->bindParam(':countryid', $_GET["countryid"]);
    } else if (array_key_exists("countryid",$_GET)) {
        $stmt = $dbh->prepare('select s.*,c.id as "country_id", c.country_id as "iso_id",c.flag_image, c.image_x, c.image_y from stamps s inner join country c on s.Country = c.name where c.id = :countryid');
        $stmt->bindParam(':countryid', $_GET["countryid"]);
    } else {
        $stmt = $dbh->prepare('select s.*,c.id as "country_id", c.country_id as "iso_id",c.flag_image, c.image_x, c.image_y from stamps s inner join country c on s.Country = c.name where s.public_note != ""');
    }
    
    $stmt -> execute();
    
    
    //MYSQLI_NUM = Array items will use a numerical index key.
    //MYSQLI_ASSOC = Array items will use the column name as an index key.
    //MYSQLI_BOTH = [default] Array items will be duplicated, with one having a numerical index key and one having the column name as an index key.
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $returnVAR[] = $row;
    }
}

//unicode
header("Content-Type: application/json", true);
header("Access-Control-Allow-Origin: *", true);
echo json_encode($returnVAR,128);
?>