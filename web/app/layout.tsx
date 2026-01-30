import type { Metadata } from "next";
import "./globals.css";
import Navigation from "./navigation";

export const metadata: Metadata = {
    title: "Flow Burst Today",
    description: "몰입하는 시간을 보내는 방법",
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
