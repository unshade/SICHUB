<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Stats;
use App\Models\Video;
use App\Models\Folders;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class VideoController extends Controller
{

    function index($path)
    {

        $videoTitle = basename($path);

        $parentFolderId = $this->getFolderIdFromPath(dirname($path));

        $video = Video::where('title', $videoTitle)->where('id_folder', $parentFolderId)->first();
        $stats = Stats::where('video_id', $video->id)->first();
        // get comments joined with user (only select name and email)
        $comments = Comment::where('video_id', $video->id)->with('user:id,name,email')->get();
        return Inertia::render('Video', [
            'path' => $path,
            'video' => $video,
            'stats' => $stats,
            'comments' => $comments,
        ]);
    }

    function serve(Request $request, $id)
    {
        $user = $request->user();
        Log::log('info', 'User ' . $user->name . ' is watching video ' . $id);
        $video = Video::where('id', $id)->first();

        $path = Storage::path($video->path);
        $size = Storage::size($video->path);
        $handle = fopen($path, 'rb');
        $start = 0;
        $length = $size;
        $end = $size - 1;

        $headers = [
            'Content-Type' => 'video/mp4',
            'Content-Disposition' => 'inline; filename="' . $video->title . '"',
            'Connection' => 'keep-alive',
            'Accept-Ranges' => 'bytes',
        ];

        if ($request->headers->has('Range')) {
            $range = $request->headers->get('Range');
            list(, $range) = explode('=', $range, 2);

            if (strpos($range, ',') !== false) {
                return response(null, 416, ['Content-Range' => sprintf('bytes */%d', $size)]);
            }

            list($start, $range_end) = explode('-', $range);
            $start = max(intval($start), 0);
            $range_end = intval($range_end);

            if ($range_end) {
                $end = min($range_end, $end);
            }

            if ($start > $end || $start > $size - 1 || $end >= $size) {
                return response(null, 416, ['Content-Range' => sprintf('bytes */%d', $size)]);
            }

            $length = $end - $start + 1;
            fseek($handle, $start);

            $headers['Content-Length'] = $length;
            $headers['Content-Range'] = sprintf('bytes %d-%d/%d', $start, $end, $size);
        } else {
            $headers['Content-Length'] = $size;
        }

        $stream = function () use ($handle, $length) {
            $bytes_to_send = $length;
            $buffer_size = 1024;

            while ($bytes_to_send > 0) {
                $buffer = fread($handle, min($buffer_size, $bytes_to_send));
                echo $buffer;
                ob_flush();
                flush();

                $bytes_to_send -= strlen($buffer);
            }

            fclose($handle);
        };
        $userId = $user->id;
        $videoId = $video->id;
        Stats::updateOrCreate(
            ['user_id' => $userId, 'video_id' => $videoId],
            ['watched' => true]
        );
        return response()->stream($stream, 206, $headers);
    }


    function store(Request $request)
    {
        $user = $request->user();
        if ($user->role != 'admin') {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $this->validate($request, [
            'title' => 'required|string|max:255',
            'video' => 'required|mimes:mp4',
        ]);
        // if description is not provided, set it to null
        if ($request->description == null) {
            $request->description = '';
        }

        $pathFile = Storage::putFile('public', $request->file('video'));


        $video = new Video();
        $video->title = $request->title;
        $video->path = $pathFile;
        $video->url = Storage::url($pathFile);
        $video->description = $request->description;
        $video->thumbnail = 'https://i.ytimg.com/vi/N9uTi3R4jlo/maxresdefault.jpg';
        $video->id_folder = $this->getFolderIdFromPath($request->path);
        $video->save();

        $request->session()->flash('success', 'Video has been successfully uploaded.');
        return;

    }


    function like(Request $request, $id)
    {
        $body = $request->all();
        $like = $body['like'];
        $dislike = $body['dislike'];
        $user = $request->user();
        $video = Video::where('id', $id)->first();
        $userId = $user->id;
        $videoId = $video->id;
        Stats::updateOrCreate(
            ['user_id' => $userId, 'video_id' => $videoId],
            ['liked' => $like, 'disliked' => $dislike]
        );
        return;
    }

    function commentStore(Request $request, $id)
    {
        $request->validate([
            'comment' => 'required|string|max:255',
        ]);
        $body = $request->all();
        $comment = $body['comment'];
        $user = $request->user();
        $video = Video::where('id', $id)->first();
        $userId = $user->id;
        $videoId = $video->id;
        Comment::create([
            'user_id' => $userId,
            'video_id' => $videoId,
            'content' => $comment,
        ]);
        return;
    }

    function destroy(Request $request, $id)
    {
        $user = $request->user();
        if ($user->role != 'admin') {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $video = Video::where('id', $id)->first();
        Storage::delete($video->path);
        $video->delete();
        return;
    }

    public function setPrivacy(Request $request)
    {
        $request->validate([
            'id' => 'required',
            'is_public' => 'required',
        ]);

        $user = $request->user();
        if ($user->role != 'admin') {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $video = Video::where('id', $request->id)->first();
        $video->is_public = $request->is_public;
        $video->save();

        $folder = Folders::where('id', $video->id_folder)->first();
        if ($request->is_public && $folder != null && $folder->is_public == false) {
            $folder->is_public = true;
            $folder->save();
            $this->handlePrivacy($folder, true);
        }

        return;
    }

    private function handlePrivacy($folder, $is_public)
    {
        if($is_public){
            $parentFolder = Folders::where('id', $folder->id_folder_parent)->first();
            if($parentFolder != null && $parentFolder->is_public == false){
                $parentFolder->is_public = true;
                $parentFolder->save();
                $this->handlePrivacy($parentFolder, true);
            }
        }else {
            $folders = Folders::where('id_folder_parent', $folder->id)->get();
            foreach ($folders as $folder) {
                $folder->is_public = false;
                $folder->save();
                $this->handlePrivacy($folder, false);
            }
            $videos = Video::where('id_folder', $folder->id)->get();
            foreach ($videos as $video) {
                $video->is_public = false;
                $video->save();
            }
        }
    }

    public function move(Request $request)
    {

        $request->validate([
            'id' => 'required',
            'id_folder' => 'required',
        ]);

        $user = $request->user();
        if ($user->role != 'admin') {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $video = Video::where('id', $request->id)->first();
        $video->id_folder = $request->id_folder;
        $video->save();

        return;
    }

    public function getFolderIdFromPath($path)
    {   

        if ($path == null || $path == '.') {
            return null;
        }

        $subfolderNames = explode('/', $path);

        $parentId = null;
        foreach ($subfolderNames as $subfolderName) {
            $folder = Folders::where('name', $subfolderName)->where('id_folder_parent', $parentId)->first();
            if (!$folder) {
                abort(404, "Le dossier '$subfolderName' n'existe pas dans le chemin '$path'.");
            }
            $parentId = $folder->id;
        }

        return $parentId;
    }
}
