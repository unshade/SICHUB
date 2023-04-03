import Toast from "@/Components/Toast";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export default function Upload(props) {
    console.log(props);
    const { data, setData, post, progress, reset } = useForm({
        folder: "SIC1",
        subfolder: "",
        title: "",
        description: "",
        video: undefined,
    });

    return !progress ? (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Upload
                </h2>
            }
        >
            <Head title="Upload" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Toast message={props.flash.notification} />
                    <form className="space-y-8 divide-y dark:divide-gray-200 divide-gray-600">
                        <div className="space-y-8 divide-y dark:divide-gray-200 divide-gray-600 sm:space-y-5">
                            <div className="space-y-6 sm:space-y-5">
                                <div>
                                    <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-200">
                                        Video infos
                                    </h3>
                                    <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-300">
                                        This information will be displayed
                                        publicly so be careful what you share.
                                    </p>
                                </div>

                                <div className="space-y-6 sm:space-y-5">
                                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                        <label
                                            htmlFor="country"
                                            className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200 sm:pt-1.5"
                                        >
                                            Module
                                        </label>
                                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                                            <select
                                                id="folder"
                                                name="folder"
                                                autoComplete="folder"
                                                onChange={(e) => {
                                                    setData(
                                                        "folder",
                                                        e.target.value
                                                    );
                                                }}
                                                className="block w-full max-w-lg rounded-md border-0 py-1.5 text-gray-900  shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                            >
                                                <option>SIC1</option>
                                                <option>SIC2</option>
                                                <option>AUTO</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                        <label
                                            htmlFor="dossier"
                                            className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200 sm:pt-1.5"
                                        >
                                            Dossier
                                        </label>
                                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                                            <div className="flex max-w-lg rounded-md shadow-sm">
                                                <span
                                                    className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 px-3 dark:text-gray-300 text-gray-500
                                                sm:text-sm"
                                                >
                                                    {data.folder}/
                                                </span>
                                                <input
                                                    type="text"
                                                    name="subfolder"
                                                    id="subfolder"
                                                    autoComplete="subfolder"
                                                    className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                                                    onChange={(e) => {
                                                        setData(
                                                            "subfolder",
                                                            e.target.value
                                                        );
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                        <label
                                            htmlFor="vidname"
                                            className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200 sm:pt-1.5"
                                        >
                                            Nom de la vidéo
                                        </label>
                                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                                            <div className="flex max-w-lg rounded-md shadow-sm">
                                                <span
                                                    className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 px-3 dark:text-gray-300 text-gray-500
                                                sm:text-sm"
                                                >
                                                    {data.folder}/
                                                    {data.subfolder}/
                                                </span>
                                                <input
                                                    type="text"
                                                    name="title"
                                                    id="title"
                                                    autoComplete="title"
                                                    className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
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

                                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                        <label
                                            htmlFor="about"
                                            className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200 sm:pt-1.5"
                                        >
                                            Description
                                        </label>
                                        <div className="mt-2 sm:col-span-2 sm:mt-0">
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
                                            <p className="mt-2 text-sm text-gray-500">
                                                De quoi parle cette vidéo
                                            </p>
                                        </div>
                                    </div>

                                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                                        <label
                                            htmlFor="cover-photo"
                                            className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200 sm:pt-1.5"
                                        >
                                            Source de la vidéo
                                        </label>
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
                                                                    Upload a
                                                                    file
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
                                                                            e
                                                                                .target
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
                            <div className="flex justify-end gap-x-3">
                                <Link
                                    href="/upload"
                                    className="rounded-md bg-white py-2 px-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    className="inline-flex justify-center rounded-md bg-gray-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        post("/upload", {
                                            onSuccess: () => {
                                                setData("video", null);
                                            }
                                        });
                                    }}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    ) : (

        <div className="flex items-center justify-center flex-col max-w-xs h-screen w-full mx-auto font-semibold text-lg">
            {progress.percentage != 100 ? (
                <div className="mx-auto">{progress.percentage} %</div>
            ) : (
                <div className="mx-auto">Finishing...</div>
            )}
        </div>
    );
}
