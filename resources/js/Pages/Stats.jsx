import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React, { useState } from "react";

function UserModal({ userName, userId, userStats, onClose }) {
    if (!userStats) {
        userStats = [];
    }
    return (
        <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 transition-opacity"
                    aria-hidden="true"
                >
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <span
                    className="hidden sm:inline-block sm:align-middle sm:h-screen"
                    aria-hidden="true"
                >
                    &#8203;
                </span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            {userName} | id : {userId}
                        </h3>
                        <div className="mt-5">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Video
                                        </th>
                                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Watched
                                        </th>
                                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Liked
                                        </th>
                                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Disliked
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {userStats.map((stat, idx) => (
                                        <tr key={idx}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {stat.video_title}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${stat.watched && "text-green-600"}`}>
                                                {stat.watched ? "Yes" : "No"}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${stat.liked && "text-green-600"}`}>
                                                {stat.liked ? "Yes" : "No"}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${stat.disliked && "text-red-600"}`}>
                                                {stat.disliked ? "Yes" : "No"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            className="ml-3 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Stats(props) {
    const [selectedUser, setSelectedUser] = useState(null);
    const handleUserClick = (userId) => {
        setSelectedUser(userId);
    };

    const handleCloseModal = () => {
        setSelectedUser(null);
    };

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Stats
                </h2>
            }
        >
            <Head title="Stats" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-700 overflow-hidden shadow-xl sm:rounded-lg p-6">
                        <ul className="divide-y divide-gray-200 dark:divide-gray-600">
                            {props.allUsers.map((user) => (
                                <li
                                    key={user.id}
                                    className="py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-200"
                                    onClick={() => handleUserClick(user.id)}
                                >
                                    {user.name} : {user.email}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {selectedUser && (
                        <UserModal
                            userId={selectedUser}
                            userStats={props.userStats[selectedUser]}
                            onClose={handleCloseModal}
                            userName={
                                props.allUsers.find(
                                    (user) => user.id === selectedUser
                                ).name
                            }
                        />
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
