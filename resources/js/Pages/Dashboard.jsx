import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { FolderIcon } from "@heroicons/react/24/outline";

export default function Dashboard(props) {
    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <ul
                        role="list"
                        className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
                    >
                        {props.folderNames.map((folder, index) => (

                                <li key={index} className="relative">
                                    <Link href={`/dashboard/${folder.folder}`}>
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
                                                View details for {folder.folder}
                                            </span>
                                        </button>
                                    </div>
                                    <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900 dark:text-gray-200">
                                        {folder.folder}
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
