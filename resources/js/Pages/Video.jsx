import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import React, { useState } from "react";
import ReactPlayer from "react-player";
import {
    HandThumbUpIcon,
    HandThumbDownIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";

export default function Video(props) {
    const [like, setLike] = useState(
        props.stats?.liked ? props.stats.liked : false
    );
    const [dislike, setDislike] = useState(
        props.stats?.disliked ? props.stats.disliked : false
    );
    console.log(props.comments);
    const { data, setData, post, processing, errors, reset } = useForm({
        comment: "",
    });
    const comments = props.comments.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
    });
    const handleCommentSubmit = (e) => {
        e.preventDefault();
        post(`/video/${props.video.id}/comment`, {
            id: props.video.id,
            preserveScroll: true,
            onSuccess: () => {
                reset("comment");
            },
        });
    };

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    {`${props.video.folder} / ${props.video.subfolder} / ${props.video.title}`}
                </h2>
            }
        >
            <Head title={props.folderName} />
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div
                        className="relative h-0"
                        style={{ paddingBottom: "56.25%" }}
                    >
                        <ReactPlayer
                            url={`/video/${props.video.id}`}
                            width="100%"
                            height="100%"
                            controls
                            className="absolute top-0 left-0"
                        />
                    </div>
                    <div className="flex justify-between mt-4">
                        <div className="dark:text-stone-200">
                            <button
                                className={`mr-4 ${
                                    like
                                        ? "text-blue-500 font-bold"
                                        : "text-gray-500"
                                }`}
                                onClick={() => {
                                    setLike(true);
                                    setDislike(false);
                                    router.post(
                                        `/video/${props.video.id}/like`,
                                        { like: true, dislike: false }
                                    );
                                }}
                            >
                                <span className="flex items-center">
                                    <HandThumbUpIcon className="h-5 w-5 mr-1" />
                                    {like ? "Liked" : "Like"}
                                </span>
                                <span
                                    className={`ml-1 ${
                                        like
                                            ? "text-blue-500 font-bold"
                                            : "text-gray-500"
                                    }`}
                                >
                                    {props.video.likes}
                                </span>
                            </button>
                            <button
                                className={`mr-4 ${
                                    dislike
                                        ? "text-red-500 font-bold"
                                        : "text-gray-500"
                                }`}
                                onClick={() => {
                                    setLike(false);
                                    setDislike(true);
                                    router.post(
                                        `/video/${props.video.id}/like`,
                                        { like: false, dislike: true }
                                    );
                                }}
                            >
                                <span className="flex items-center">
                                    <HandThumbDownIcon className="h-5 w-5 mr-1" />
                                    {dislike ? "Disliked" : "Dislike"}
                                </span>
                                <span
                                    className={`ml-1 ${
                                        dislike
                                            ? "text-red-500 font-bold"
                                            : "text-gray-500"
                                    }`}
                                >
                                    {props.video.dislikes}
                                </span>
                            </button>
                            {props.auth.user.role == "admin" && (
                                <>
                                    <button
                                        onClick={() => {
                                            router.delete(
                                                `/video/${props.video.id}`,
                                            );
                                        }}
                                    >
                                        <span className="flex items-center text-red-600">
                                            <TrashIcon className="h-5 w-5 mr-" />
                                            Delete
                                        </span>
                                    </button>
                                </>
                            )}
                        </div>

                        <div className="dark:text-stone-200">
                            {props.comments.length} Comment
                            {props.comments.length !== 1 && "s"}
                        </div>
                    </div>
                    <div className="mt-4">
                        <form onSubmit={handleCommentSubmit}>
                            <textarea
                                className="w-full h-20 p-2 border rounded"
                                value={data.comment}
                                onChange={(e) =>
                                    setData("comment", e.target.value)
                                }
                                placeholder="Add a comment..."
                            />
                            <button className="mt-2 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700">
                                Comment
                            </button>
                        </form>
                        <div className="mt-4">
                            {comments.map((comment, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-100 rounded-lg p-4 mb-4 shadow-md"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="text-gray-800 font-bold">
                                            {comment.user.name} (
                                            {comment.user.email})
                                        </div>
                                        <div className="text-gray-600 text-sm">
                                            {new Date(
                                                comment.created_at
                                            ).toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="mt-2 text-gray-700">
                                        {comment.content}
                                    </div>
                                    <div className="mt-3 flex items-center space-x-2">
                                        <button className="text-blue-600 hover:underline">
                                            Reply
                                        </button>
                                        {/* {currentUser &&
                                            currentUser.id ===
                                                comment.user.id && (
                                                <button className="text-red-600 hover:underline">
                                                    Supprimer
                                                </button>
                                            )} */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
