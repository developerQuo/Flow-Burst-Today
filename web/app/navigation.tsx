import { FaRegCalendarCheck } from "react-icons/fa";
import { BsFillSendExclamationFill } from "react-icons/bs";
import { BsQuestionCircle } from "react-icons/bs";

import Link from "next/link";
import { IconType } from "react-icons";
import { ReactElement } from "react";

type Path = {
    href: string;
    name: string;
    icon: ReactElement<IconType>;
};

function NavItem({ href, icon }: Path) {
    return (
        <li>
            <Link href={href} className="text-4xl text-white">
                {icon}
            </Link>
        </li>
    );
}

const paths: Path[] = [
    {
        href: "/guide",
        name: "Guide",
        icon: <BsQuestionCircle className="m-2" data-testid="guide-icon" />,
    },
    {
        href: "/statistic",
        name: "Statistic",
        icon: (
            <FaRegCalendarCheck className="m-2" data-testid="statistic-icon" />
        ),
    },
];

const feedbackPath: Path = {
    href: "/feedback",
    name: "Feedback",
    icon: (
        <BsFillSendExclamationFill
            className="m-2"
            data-testid="feedback-icon"
        />
    ),
};
export default function Navigation() {
    return (
        <>
            <div className="absolute right-4 top-4">
                <ul className="flex flex-col items-center gap-2">
                    {paths.map((path) => (
                        <NavItem key={path.name} {...path} />
                    ))}
                </ul>
            </div>

            <ul className="absolute bottom-4 right-4">
                <NavItem key={feedbackPath.name} {...feedbackPath} />
            </ul>
        </>
    );
}
