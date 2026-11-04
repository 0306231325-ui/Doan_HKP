<?php

namespace App\Console\Commands;

use Illuminate\Foundation\Console\ServeCommand;

class ServeWithUploads extends ServeCommand
{
    protected $name = 'serve:uploads';

    protected $description = 'Chạy máy chủ local hỗ trợ 5 ảnh, tối đa 5 MB mỗi ảnh';

    protected function serverCommand(): array
    {
        $lenh = parent::serverCommand();
        array_splice($lenh, 1, 0, ['-d', 'upload_max_filesize=5M', '-d', 'post_max_size=30M']);

        return $lenh;
    }
}
