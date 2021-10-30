<?php 

for ($x=1; $x<200;$x++) {
    $url = "https://i.colnect.net/flags/32/" . $x . ".png";

    //PHP download file from url using curl example
    $curlCh = curl_init();


    $config['useragent'] = 'Mozilla/5.0 (Windows NT 6.2; WOW64; rv:17.0) Gecko/20100101 Firefox/17.0';

    curl_setopt($curlCh, CURLOPT_USERAGENT, $config['useragent']);
    curl_setopt($curlCh, CURLOPT_REFERER, 'https://www.domain.com/');
    curl_setopt($curlCh, CURLOPT_COOKIE,$cookiesIn);
    curl_setopt($curlCh, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
    curl_setopt($curlCh, CURLOPT_URL, $url);
    curl_setopt($curlCh, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curlCh, CURLOPT_SSL_VERIFYPEER, 0);
    $curlrequestData = curl_exec ($curlCh);

    if(curl_errno($ch)) {
        echo 'Error: '.curl_error($ch);
    } else {
        echo $result;
    }


    $download_live_Path = $x . ".png";
    $file = fopen($download_live_Path, "w+");
    fputs($file, $curlrequestData);
    fclose($file);
    echo $x . "n";
    
    
    curl_close ($curlCh);
}

?>sed -ne 's/.*\(/en/stamps/years/country[^"]*\).*/\1/p'

grep -o '"/en/stamps/years/country/[^"]*"'