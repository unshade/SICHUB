<?php

namespace App\Http\Controllers;

use App\Models\Stats;
use App\Models\User;
use App\Models\Video;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StatsController extends Controller
{
    //

    public function index(Request $request)
    {
        $user = $request->user();
        if ($user->role != 'admin') {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $userStats = Stats::with(['user', 'video'])->get();
        $userStatsGrouped = $userStats->groupBy('user_id')->map(function ($stats) {
            return $stats->map(function ($stat) {
                return [
                    'video_id' => $stat->video_id,
                    'video_title' => $stat->video->title, // Ajoutez le nom de la vidéo ici
                    'watched' => $stat->watched,
                    'liked' => $stat->liked,
                    'disliked' => $stat->disliked,
                    'user_name' => $stat->user->name,
                ];
            });
        });

        $allVideos = Video::all();
        // every user select name and email and id
        $allUsers = User::select('name', 'email', 'id')->get();

        return Inertia::render('Stats', [
                'userStats' => $userStatsGrouped,
                'allVideos' => $allVideos,
                'allUsers' => $allUsers,
            ]
        );
    }





    public function videoStats(Request $request)
    {
        $user = $request->user();

    }
}
