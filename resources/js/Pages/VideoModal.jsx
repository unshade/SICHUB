import Modal from "@/Components/Modal";
import { useForm } from "@inertiajs/react";

export default function VideoModal({ open, onClose, props }) {

    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return "0 Bytes";

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return (
            parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
        );
    }

    const {
        data,
        setData,
        post,
        progress,
        reset,
    } = useForm({
        path: props.path,
        title: "",
        description: "",
        video: undefined,
    });

    return (
        <Modal show={open}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Upload a new video
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-300">
                    This information will be displayed publicly so be careful
                    what you share.
                </p>
                <form className="space-y-8 divide-y dark:divide-gray-200 divide-gray-600">
                    <div className="space-y-8 divide-y dark:divide-gray-200 divide-gray-600">
                        <div className="pt-8 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Current folder
                                </label>
                                <div className="mt-1">
                                    <p className="block w-full sm:text-sm border-gray-300 rounded-md dark:text-gray-200">
                                        dashboard/{props.path ?? "/"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-8 divide-y dark:divide-gray-200 divide-gray-600">
                        <div className="pt-8 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Nom de la vidéo
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="folderName"
                                        id="folderName"
                                        autoComplete="given-name"
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        onChange={(e) => {
                                            setData(
                                                "title",
                                                e.target.value
                                            );
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-8 divide-y dark:divide-gray-200 divide-gray-600">
                        <div className="pt-8 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Description
                                </label>
                                <div className="mt-1">
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={3}
                                        className="block w-full max-w-lg rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:py-1.5 sm:text-sm sm:leading-6"
                                        onChange={(e) => {
                                            setData(
                                                "description",
                                                e.target.value
                                            );
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-8 divide-y dark:divide-gray-200 divide-gray-600">
                        <div className="pt-8 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Source de la vidéo
                                </label>
                                <div className="mt-1">
                                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                                        {!data.video ? (
                                            <div className="flex max-w-lg justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                                                <div className="space-y-1 text-center">
                                                    <svg
                                                        className="mx-auto h-12 w-12 text-gray-400"
                                                        stroke="currentColor"
                                                        fill="none"
                                                        viewBox="0 0 48 48"
                                                        aria-hidden="true"
                                                    >
                                                        <path
                                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                            strokeWidth={2}
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                    <div className="flex text-sm text-gray-600">
                                                        <label
                                                            htmlFor="video"
                                                            className="relative cursor-pointer rounded-md bg-white font-medium text-gray-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-gray-500 focus-within:ring-offset-2 hover:text-gray-500"
                                                        >
                                                            <span>
                                                                Upload a file
                                                            </span>
                                                            <input
                                                                id="video"
                                                                name="video"
                                                                type="file"
                                                                accept="video/mp4"
                                                                className="sr-only"
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    setData(
                                                                        "video",
                                                                        e.target
                                                                            .files[0]
                                                                    );
                                                                }}
                                                            />
                                                        </label>
                                                        <p className="pl-1">
                                                            or drag and drop
                                                        </p>
                                                    </div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-300">
                                                        MP4 UNIQUEMENT !
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex-1">
                                                <p className="text-sm text-green-500">
                                                    {data.video.name}
                                                </p>
                                                <div className="flex items-center gap-1 text-xs text-green-500">
                                                    <span>
                                                        {formatBytes(
                                                            data.video.size
                                                        )}
                                                    </span>
                                                    <span>
                                                        {data.video.type}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-5">
                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-700 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                onClick={() => {
                                    onClose();
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onClick={(e) => {
                                    e.preventDefault();
                                    post(route("video.store"), {
                                        onSuccess: () => {
                                            setData("video", null);
                                            onClose();
                                        },
                                    });
                                }}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
