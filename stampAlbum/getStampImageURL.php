<?php 

function downloadImage ($inputurl, $destFileName) {

  
  $curl_handle=curl_init();
  curl_setopt($curl_handle, CURLOPT_URL,$inputurl);
  curl_setopt($curl_handle, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($curl_handle, CURLOPT_USERAGENT, 'Your application name');
      $config['useragent'] = 'Mozilla/5.0 (Windows NT 6.2; WOW64; rv:17.0) Gecko/20100101 Firefox/17.0';

      curl_setopt($curl_handle, CURLOPT_USERAGENT, $config['useragent']);
      curl_setopt($curl_handle, CURLOPT_REFERER, 'https://www.domain.com/');
       curl_setopt($curl_handle, CURLOPT_COOKIEJAR, dirname(__FILE__) . '/tmp/cookies.txt');
      $output['realpath'] =  dirname(__FILE__) . '/tmp/cookies.txt';
     curl_setopt($curl_handle, CURLOPT_COOKIEFILE, dirname(__FILE__) . '/tmp/cookies.txt');
  
  
      curl_setopt($curl_handle, CURLOPT_SSL_VERIFYPEER, 0);
      curl_setopt($curl_handle, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);

      $file_path = '../img/colnect/' . $destFileName;
      $file = fopen($file_path, 'w+');

      curl_setopt($curl_handle, CURLOPT_FILE, $file);

  $file_data = curl_exec($curl_handle);
  $st_code = curl_getinfo($curl_handle, CURLINFO_HTTP_CODE);


  curl_close($curl_handle);
  fclose($file);

  return $file_path . $filename;
}

function getStampImage($inputurl) {
	$output['input'] = $inputurl; 

 preg_match('/stamps\/stamp\/.*/i', $inputurl, $parturl);
$output['input2'] = 'https://colnect.com/en/' . $parturl[0];
$cookiesIn = '';
$curl_handle=curl_init();
curl_setopt($curl_handle, CURLOPT_URL,$output['input2']);
curl_setopt($curl_handle, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($curl_handle, CURLOPT_HEADER, 1);
curl_setopt($curl_handle, CURLOPT_USERAGENT, 'Your application name');
    $config['useragent'] = 'Mozilla/5.0 (Windows NT 6.2; WOW64; rv:17.0) Gecko/20100101 Firefox/17.0';

    curl_setopt($curl_handle, CURLOPT_USERAGENT, $config['useragent']);
    curl_setopt($curl_handle, CURLOPT_REFERER, 'https://www.domain.com/');
     curl_setopt($curl_handle, CURLOPT_COOKIEJAR, dirname(__FILE__) . '/tmp/cookies.txt');
    $output['realpath'] =  dirname(__FILE__) . '/tmp/cookies.txt';
   curl_setopt($curl_handle, CURLOPT_COOKIEFILE, dirname(__FILE__) . '/tmp/cookies.txt');


    curl_setopt($curl_handle, CURLOPT_SSL_VERIFYPEER, 0);
    curl_setopt($curl_handle, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);


$query = curl_exec($curl_handle);
if (strlen($query)==0) {
} else {
  preg_match('/(https:\/\/colnect\.com\/en\/stamps\/stamp.*)"/i', $query, $urlmatches);

	$output['firstinfo']= curl_getinfo( $curl_handle );
	$output['firstdata']= $query;
	$output['urlmatches'] = $urlmatches; 
}
$header  = curl_getinfo( $curl_handle );
$header_content = substr($query, 0, $header['header_size']);
$pattern = "#Set-Cookie:\\s+(?<cookie>[^=]+=[^;]+)#m";
preg_match_all($pattern, $header_content, $matches);
$cookiesOut = implode("; ", $matches['cookie']);
curl_close($curl_handle);

$curl_handle=curl_init();
curl_setopt($curl_handle, CURLOPT_URL,$urlmatches[1]);
curl_setopt($curl_handle, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($curl_handle, CURLOPT_USERAGENT, 'Your application name');
    $config['useragent'] = 'Mozilla/5.0 (Windows NT 6.2; WOW64; rv:17.0) Gecko/20100101 Firefox/17.0';

    curl_setopt($curl_handle, CURLOPT_USERAGENT, $config['useragent']);
    curl_setopt($curl_handle, CURLOPT_REFERER, 'https://www.domain.com/');
   curl_setopt($curl_handle, CURLOPT_COOKIEFILE, dirname(__FILE__) . '/tmp/cookies.txt');

    curl_setopt($curl_handle, CURLOPT_COOKIE,$cookiesOut);

    curl_setopt($curl_handle, CURLOPT_SSL_VERIFYPEER, 0);
    curl_setopt($curl_handle, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);


$query = curl_exec($curl_handle);
if (strlen($query)==0) {
	$output['seconderror']= curl_getinfo( $curl_handle );

} else {
  preg_match('/\/\/i\.colnect\.net.*\.jpg/i', $query, $matches);
	$output['seconddata'] = 'https:'.$matches[0];
curl_close($curl_handle);
}
 return $output;
}

function isCacheImagePresent ($filename) {
  return file_exists('../img/colnect/' .$filename);
}


function getColnectStampId($url) {
  preg_match('/\d*$/i', $url, $urlmatches);
  return $urlmatches[0];
}

$colnectid = getColnectStampId($_GET["stamppage"]);

if (isCacheImagePresent($colnectid . '.jpg')) {
  $data = [];
  $data['seconddata'] = 'img/colnect/'.$colnectid . '.jpg';
  $data['status'] = 'Retreived from cache';
} else {

  $data = getStampImage($_GET["stamppage"]);
  //$data = getStampImage('https://colnect.com/stamps/stamp/535233');
  $cachedURI = downloadImage ($data['seconddata'], $colnectid. '.jpg');
  $data['seconddata'] = 'img/colnect/'.$colnectid . '.jpg';
  $data['status'] = 'Cache populated';
}
//unicode
header("Content-Type: application/json", true);
header("Access-Control-Allow-Origin: *", true);
echo json_encode($data,128);


?>
