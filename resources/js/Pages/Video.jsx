import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Video(props) {
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
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <video
                        src={props.video.url}
                        controls
                        className="w-full h-auto"
                    ></video>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
