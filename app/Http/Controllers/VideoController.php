<?php

namespace App\Http\Controllers;

use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class VideoController extends Controller
{

    function index()
    {

    }

    function update()
    {

    }

    function store(Request $request)
    {
        Log::log('info', $request->all());
        $this->validate($request, [
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'video' => 'required|mimes:mp4,mov,ogg,qt,webm,avi,wmv,flv,mpg,mpeg,3gp',
            'folder' => 'required|string|max:255',
            'subfolder' => 'required|string|max:255',
        ]);

        $pathFile = Storage::putFile('public', $request->file('video'));

        $video = new Video();
        $video->title = $request->title;
        $video->path = $pathFile;
        $video->url = Storage::url($pathFile);
        $video->description = $request->description;
        $video->thumbnail = 'https://i.ytimg.com/vi/N9uTi3R4jlo/maxresdefault.jpg';
        $video->folder = $request->folder;
        $video->subfolder = $request->subfolder;
        $video->save();

        $request->session()->flash('success', 'Video has been successfully uploaded.');
        return redirect()->route('upload')->with('notification', 'Video has been successfully uploaded.');

    }


    function destroy()
    {

    }
}
