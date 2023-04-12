<?php

namespace App\Http\Controllers;

use App\Models\Folders;
use App\Models\Video;
use App\Models\LinkFolders;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    
    public function index(Request $request)
    {
        $user = $request->user();
        if ($user->role != 'admin') {
            $folders = Folders::where('id_folder_parent', null)->where('is_public', true)->get();
            $videos = Video::where('id_folder', null)->where('is_public', true)->get();
        } else {
            $folders = Folders::where('id_folder_parent', null)->get();
            $videos = Video::where('id_folder', null)->get();
        }
                               
        return Inertia::render('Dashboard', [
            'path' => null,
            'folders' => $folders,
            'videos' => $videos,
        ]);
    }
    
}
