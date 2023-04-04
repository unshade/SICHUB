<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Stats;
use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class VideoController extends Controller
{

    function index($folderName, $subfolderName, $id)
    {
        $video = Video::where('folder', $folderName)->where('subfolder', $subfolderName)->where('id', $id)->first();
        $stats = Stats::where('video_id', $id)->first();
        // get comments joined with user (only select name and email)
        $comments = Comment::where('video_id', $id)->with('user:id,name,email')->get();
        return Inertia::render('Video', [
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
            'folder' => 'required|string|max:255',
            'subfolder' => 'required|string|max:255',
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
        $video->folder = $request->folder;
        $video->subfolder = $request->subfolder;
        $video->save();

        $request->session()->flash('success', 'Video has been successfully uploaded.');
        return redirect()->route('upload')->with('notification', 'Video has been successfully uploaded.');

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
        return redirect()->route('video.page', ['folderName' => $video->folder, 'subfolderName' => $video->subfolder, 'id' => $id]);
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
        return redirect()->route('video.page', ['folderName' => $video->folder, 'subfolderName' => $video->subfolder, 'id' => $id]);
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
        return redirect()->route('dashboard');
    }
}
