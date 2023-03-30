import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import { FolderIcon } from "@heroicons/react/24/outline";

export default function Subfolder(props) {
    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    {`${props.folderName} / ${props.subFolderName}`}
                </h2>
            }
        >
            <Head title={props.folderName} />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <ul
                        role="list"
                        className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
                    >
                        {props.videos.map((file, index) => (
                            <li key={index} className="relative">
                                <Link href={`/dashboard/${props.folderName}/${props.subFolderName}/${file.id}`}>
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
                                    <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900 dark:text-gray-200">
                                        {file.title}
                                    </p>
                                    <p className="pointer-events-none block text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {file.folder}
                                    </p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
