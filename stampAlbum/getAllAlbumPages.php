<?php 

include 'vars.php';

$memkey = 'getAllAlbumPages';

// First we check that our cache server is available
// The $cacheAvailable variable was initialized when we connected to our cache server
if ($cacheAvailable == true)
{
    // Now we get the data from our cache server
    $returnVAR = $memcache->get($memkey);
}

// do we need to access MySQL ?
if (!$returnVAR || isset($_GET["force"])) {
    
    $stmt = $dbh->prepare('select * from albumPages');
    $stmt -> execute();
    
    $returnVAR = array();
    
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