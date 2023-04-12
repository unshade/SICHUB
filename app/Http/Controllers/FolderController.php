<?php

namespace App\Http\Controllers;

use App\Models\Folders;
use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class FolderController extends Controller
{
    //
    public function index(Request $request, $path)
    {

        $parentId = $this->getFolderIdFromPath($path);

        $user = $request->user();
        if ($user->role != 'admin') {

            $currentFolder = Folders::where('id', $parentId)->first();
            if ($currentFolder->is_public == false) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }

            $folders = Folders::where('id_folder_parent', $parentId)->where('is_public', true)->get();
            $videos = Video::where('id_folder', $parentId)->where('is_public', true)->get();
        } else {
            $folders = Folders::where('id_folder_parent', $parentId)->get();
            $videos = Video::where('id_folder', $parentId)->get();
        }


        return Inertia::render('Dashboard', [
            'path' => $path,
            'videos' => $videos,    
            'folders' => $folders,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
        ]);

        $user = $request->user();
        if ($user->role != 'admin') {
            return response()->json(['message' => 'Unauthorized'], 401);
        }


        $parentId = $this->getFolderIdFromPath($request->path);

        $folder = new Folders();
        $folder->name = $request->name;
        $folder->id_folder_parent = $parentId;
        $folder->save();

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

        $folder = Folders::where('id', $request->id)->first();
        $folder->is_public = $request->is_public;
        $folder->save();
        
        $this->handlePrivacy($folder, $request->is_public);

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
            foreach ($folders as $temp) {
                $temp->is_public = false;
                $temp->save();
                $this->handlePrivacy($temp, false);
            }
            $videos = Video::where('id_folder', $folder->id)->get();
            foreach ($videos as $video) {
                $video->is_public = false;
                $video->save();
            }
        }
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        if ($user->role != 'admin') {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $videos = Video::where('id_folder', $id)->get();
        foreach ($videos as $video) {
            $video->delete();
        }

        

        $folder = Folders::where('id', $id)->first();
        $folder->delete();

        return;
    }



    private function getFolderIdFromPath($path)
    {   
        if ($path == null) {
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
