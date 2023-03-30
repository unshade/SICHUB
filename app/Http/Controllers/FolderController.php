<?php

namespace App\Http\Controllers;

use App\Models\Video;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FolderController extends Controller
{
    //
    public function index($name)
    {
        $videos = Video::where('folder', $name)->get();
        $subFoldersNames = Video::select('subfolder')->where('folder', $name)->distinct()->get();

        return Inertia::render('Folder', [
            'name' => $name,
            'videos' => $videos,
            'subFoldersNames' => $subFoldersNames,
        ]);
    }
}
