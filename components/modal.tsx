"use client";

import { type ElementRef, useRef, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

type InputProps = {
    title: string;
    children: React.ReactNode;
};

export function Modal({ children, title }: InputProps) {
    const router = useRouter();

    function onDismiss() {
        router.back();
    }

    return createPortal(
        <div
            className="absolute inset-0 z-20 flex items-center justify-center bg-slate-50/40"
            onClick={onDismiss}
        >
            <div
                className="relative flex h-full max-h-[640px] w-5/6 max-w-xl flex-col items-center justify-center rounded-xl border-none bg-white px-8 pb-20 pt-8 drop-shadow-md"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="h-12 w-full text-center text-2xl font-semibold">
                    {title}
                </div>
                <div className="h-full w-full overflow-y-auto">{children}</div>
                <button
                    onClick={onDismiss}
                    className="absolute right-2 top-2 flex h-12 w-12 cursor-pointer items-center justify-center border-r-[15px] border-none bg-transparent text-2xl font-medium after:text-black after:content-['x'] hover:bg-gray-100"
                />
            </div>
        </div>,
        document.getElementById("modal-root")!,
    );
}
