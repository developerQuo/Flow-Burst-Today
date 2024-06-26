"use client";

import { type ElementRef, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

export function Modal({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const dialogRef = useRef<ElementRef<"div">>(null);

    useEffect(() => {
        if (dialogRef.current) {
            dialogRef.current.style.display = "block";
        }
    }, []);

    function onDismiss() {
        router.back();
    }

    return createPortal(
        <div
            className="absolute inset-0 z-20 flex items-center justify-center bg-slate-50/[.07]"
            onClick={onDismiss}
        >
            <div
                ref={dialogRef}
                className="relative flex h-96 max-h-[500px] w-5/6 max-w-lg items-center justify-center border-r-[12px] border-none bg-white p-8"
                onClick={(event) => event.stopPropagation()}
            >
                {children}
                <button
                    onClick={onDismiss}
                    className="absolute right-2 top-2 flex h-12 w-12 cursor-pointer items-center justify-center border-r-[15px] border-none bg-transparent text-2xl font-medium after:text-black after:content-['x'] hover:bg-white"
                />
            </div>
        </div>,
        document.getElementById("modal-root")!,
    );
}
