<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['*'], // Ganti jadi bintang
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'], // Ganti jadi bintang
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];