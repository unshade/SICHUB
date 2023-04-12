import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Square2StackIcon, Squares2X2Icon, TrashIcon } from "@heroicons/react/20/solid";

export default function Draggable(props) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: props.id,
    });
    const style = {
        // Outputs `translate3d(x, y, 0)`
        transform: CSS.Translate.toString(transform),
    };

    return (
        <div ref={setNodeRef} style={style}>
            <button
                {...listeners}
                {...attributes}
                className="absolute top-0 left-0 -mt-2 -ml-2 z-10 bg-white rounded-full p-1 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500"
                type="button"
            >
                <span className="sr-only">Delete</span>
                                <Squares2X2Icon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                />
            </button>
            {props.children}
        </div>
    );
}
