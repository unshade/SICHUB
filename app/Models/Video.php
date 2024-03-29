<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'url',
        'thumbnail',
        'path',
        'id_folder',
        'is_public',
    ];

    public function folder()
    {
        return $this->belongsTo(Folders::class, 'id_folder');
    }
}
