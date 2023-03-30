<?php

namespace App\Http\Controllers;

use App\Models\Video;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    //
    public function index()
    {
        $folderNames = Video::select('folder')->distinct()->get();
        return Inertia::render('Dashboard', [
            'folderNames' => $folderNames,
        ]);
    }
}
