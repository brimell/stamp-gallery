<?php

error_reporting(E_ERROR);

// Connection constants
define('MEMCACHED_HOST', '127.0.0.1');
define('MEMCACHED_PORT', '11211');

$dbh = new PDO('mysql:host=www.rimell.cc;dbname=stamps', 'stamps', 'stamps123', array(
    PDO::ATTR_PERSISTENT => true, PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"
));



// Connection creation
$memcache = new Memcache;
$cacheAvailable = $memcache->connect(MEMCACHED_HOST, MEMCACHED_PORT);

?>