import Modal from "@/Components/Modal";
import { useForm } from "@inertiajs/react";

export default function FolderModal({ open, onClose, props }) {
    const { data, setData, post, progress, reset } = useForm({
        name: "",
        path: props.path,
    });
    
    return (
        <Modal show={open}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Create a new folder
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
                                    Folder Name
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="folderName"
                                        id="folderName"
                                        autoComplete="given-name"
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                        onChange={(e) => {
                                            setData("name", e.target.value);
                                        }}
                                    />
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
                                    post(route("folder.store"), {
                                        preserveScroll: true,
                                        onSuccess: () => {
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
