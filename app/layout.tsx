import type { Metadata } from "next";
import "./globals.css";
import Navigation from "./navigation";

export const metadata: Metadata = {
    title: "Pomodoro",
    description: "Focus on your task now and do your best",
};

export default function RootLayout({
    modal,
    children,
}: Readonly<{
    modal: React.ReactNode;
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <body className="overscroll-contain">
                {children}
                <Navigation />
                {modal}
                <div id="modal-root" />
            </body>
        </html>
    );
}
