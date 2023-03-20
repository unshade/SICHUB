<?php

namespace App\Http\Controllers;

use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class VideoController extends Controller
{

    function index()
    {

    }

    function update()
    {

    }

    function create(Request $request)
    {
        $this->validate($request, [
            'title' => 'required|string|max:255',
        ]);

        $fileName = $request->title;
        $filePath = 'videos/' . $fileName;

        $isFileUploaded = Storage::disk('public')->put($filePath, file_get_contents($request->video));

        // File URL to access the video in frontend
        $url = Storage::disk('public')->url($filePath);

        if ($isFileUploaded) {
            $video = new Video();
            $video->title = $request->title;
            $video->path = $filePath;
            $video->url = $url;
            $video->description = $request->description;
            $video->save();

            return back()
                ->with('success','Video has been successfully uploaded.');
        }

        return back()
            ->with('error','Unexpected error occured');
    }


    function destroy()
    {

    }
}
