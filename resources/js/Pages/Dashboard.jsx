import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { FolderIcon } from "@heroicons/react/24/outline";
import Modal from "@/Components/Modal";
import { useState } from "react";
import {
    ArrowLeftIcon,
    EyeIcon,
    EyeSlashIcon,
    TrashIcon,
} from "@heroicons/react/20/solid";
import FolderModal from "./FolderModal";
import VideoModal from "./VideoModal";
import {
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { Droppable } from "@/Components/Droppable";
import Draggable from "@/Components/Draggable";

export default function Dashboard(props) {
    const userRole = props.auth.user.role;

    const [open, setOpen] = useState(false);
    const [openVideo, setOpenVideo] = useState(false);

    const previousPath = props.path
        ? route("folder.page", {
              path: props.path.split("/").slice(0, -1).join("/"),
          })
        : route("dashboard");

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={
                <div className="flex justify-between">
                    <div className="flex items-center space-x-4">
                        {props.path && (
                            <Link href={previousPath}>
                                <ArrowLeftIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                            </Link>
                        )}

                        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                            Dashboard/{props.path}
                        </h2>
                    </div>
                    {userRole === "admin" && (
                        <div>
                            <button
                                type="button"
                                className="rounded bg-white/10 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-white/20 mx-4"
                                onClick={() => {
                                    setOpen(true);
                                }}
                            >
                                + Folder
                            </button>
                            <button
                                type="button"
                                className="rounded bg-white/10 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
                                onClick={() => {
                                    setOpenVideo(true);
                                }}
                            >
                                + Video
                            </button>
                        </div>
                    )}
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <ul
                        role="list"
                        className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
                    >
                        <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
                            <DisplayFolders
                                folders={props.folders}
                                path={props.path}
                                userRole={userRole}
                            />

                            <DisplayVideos
                                videos={props.videos}
                                path={props.path}
                                userRole={userRole}
                            />
                        </DndContext>
                    </ul>
                </div>
            </div>
            <FolderModal
                open={open}
                onClose={() => setOpen(false)}
                props={props}
            />
            <VideoModal
                open={openVideo}
                onClose={() => setOpenVideo(false)}
                props={props}
            />
        </AuthenticatedLayout>
    );

    function handleDragEnd(event) {
        const { over } = event;
        console.log({ event });

        if (over) {
            router.post(route("video.move"), {
                id: event.active.id,
                id_folder: over.id,
            });
        }
    }
}

function DisplayFolders({ folders, path, userRole }) {
    return (
        <>
            {folders.map((folder, index) => (
                <Droppable key={folder.id} id={folder.id}>
                    <li key={index} className="relative">
                        <Link
                            href={route("folder.page", {
                                path: path
                                    ? `${path}/${folder.name}`
                                    : folder.name,
                            })}
                        >
                            <div className="group aspect-w-10 aspect-h-7 block w-full overflow-hidden rounded-lg bg-slate-700 focus-within:ring-2 focus-within:ring-gray-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                                <FolderIcon
                                    className="pointer-events-none object-cover group-hover:opacity-75 text-white"
                                    aria-hidden="true"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-0 focus:outline-none "
                                >
                                    <span className="sr-only">
                                        View details for {folder.name}
                                    </span>
                                </button>
                            </div>
                        </Link>
                        <div className="flex justify-between items-center mt-2">
                            <p className="mt-2 block text-sm font-medium text-white truncate pointer-events-none">
                                {folder.name}
                            </p>
                            {userRole === "admin" && (
                                <button
                                    type="button"
                                    className="p-1 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500"
                                    onClick={() => {
                                        router.post(route("folder.privacy"), {
                                            id: folder.id,
                                            is_public: !folder.is_public,
                                        });
                                    }}
                                >
                                    <span className="sr-only">is public</span>
                                    {folder.is_public ? (
                                        <EyeIcon className="h-5 w-5" />
                                    ) : (
                                        <EyeSlashIcon className="h-5 w-5" />
                                    )}
                                </button>
                            )}
                        </div>

                        {userRole === "admin" && (
                            <button
                                type="button"
                                className="absolute top-0 right-0 -mt-2 -mr-2 bg-white rounded-full p-1 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500"
                                onClick={() => {
                                    router.delete(
                                        route("folder.destroy", {
                                            id: folder.id,
                                        })
                                    );
                                }}
                            >
                                <span className="sr-only">Delete</span>
                                <TrashIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                />
                            </button>
                        )}
                    </li>
                </Droppable>
            ))}
        </>
    );
}

function DisplayVideos({ videos, path, userRole }) {
    return (
        <>
            {videos.map((file, index) => (
                <li key={index} className="relative">
                    <Draggable id={file.id} key={file.id}>
                        <Link
                            href={route("video.page", {
                                path: path
                                    ? `${path}/${file.title}`
                                    : file.title,
                            })}
                        >
                            <div className="group aspect-w-10 aspect-h-7 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-gray-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                                <img
                                    src={file.thumbnail}
                                    alt=""
                                    className="pointer-events-none object-cover group-hover:opacity-75"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-0 focus:outline-none"
                                >
                                    <span className="sr-only">
                                        View details for {file.title}
                                    </span>
                                </button>
                            </div>
                        </Link>

                        <div className="flex justify-between items-center mt-2">
                            <p className="mt-2 block text-sm font-medium text-white truncate pointer-events-none">
                                {file.title}
                            </p>
                            {userRole === "admin" && (
                                <button
                                    type="button"
                                    className="p-1 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500"
                                    onClick={() => {
                                        router.post(route("video.privacy"), {
                                            id: file.id,
                                            is_public: !file.is_public,
                                        });
                                    }}
                                >
                                    <span className="sr-only">is public</span>
                                    {file.is_public ? (
                                        <EyeIcon className="h-5 w-5" />
                                    ) : (
                                        <EyeSlashIcon className="h-5 w-5" />
                                    )}
                                </button>
                            )}
                        </div>

                        {userRole === "admin" && (
                            <button
                                type="button"
                                className="absolute top-0 right-0 -mt-2 -mr-2 bg-white rounded-full p-1 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500"
                                onClick={() => {
                                    router.delete(
                                        route("video.destroy", {
                                            id: file.id,
                                        })
                                    );
                                }}
                            >
                                <span className="sr-only">Delete</span>
                                <TrashIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                />
                            </button>
                        )}
                    </Draggable>
                </li>
            ))}
        </>
    );
}
