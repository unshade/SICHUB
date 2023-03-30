<?php

namespace App\Http\Controllers;

use App\Models\Video;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubfolderController extends Controller
{
    //
    public function index($folderName, $subfolderName)
    {
        //
        $videos = Video::where('folder', $folderName)->where('subfolder', $subfolderName)->get();
        return Inertia::render('Subfolder', [
            'folderName' => $folderName,
            'videos' => $videos,
            'subFolderName' => $subfolderName,
        ]);
    }
}
