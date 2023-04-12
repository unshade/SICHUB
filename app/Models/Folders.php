<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Folders extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'id_folder_parent',
        'is_public',
    ];

    public function folder()
    {
        return $this->belongsTo(Folders::class, 'id_folder_parent');
    }
}
