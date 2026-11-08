<?php

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '');
$thuMucTin = __DIR__.'/public/tin';
$tep = realpath(__DIR__.'/public'.$uri);
if ($tep !== false && ($tep === $thuMucTin || str_starts_with($tep, $thuMucTin.DIRECTORY_SEPARATOR))) {
    http_response_code(404);

    return true;
}

return require __DIR__.'/vendor/laravel/framework/src/Illuminate/Foundation/resources/server.php';
