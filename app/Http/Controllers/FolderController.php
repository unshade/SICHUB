<?php

namespace App\Http\Controllers;

use App\Models\Video;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FolderController extends Controller
{
    //
    public function index()
    {
        $videos = Video::all();
        return Inertia::render('Dashboard', [
            'videos' => $videos,
        ]);
    }
}
