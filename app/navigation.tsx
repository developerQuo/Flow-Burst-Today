import Link from "next/link";

type Path = {
    href: string;
    name: string;
};

function NavItem({ href, name }: Path) {
    return (
        <li>
            <Link
                href={href}
                prefetch
                className="text-2xl font-semibold text-white"
            >
                {name}
            </Link>
        </li>
    );
}

const paths: Path[] = [
    {
        href: "/",
        name: "Pomodoro",
    },
    {
        href: "/guide",
        name: "Guide",
    },
    {
        href: "/statistic",
        name: "Statistic",
    },
];

export default function Navigation() {
    return (
        <div className="fixed bottom-0 w-full py-12">
            <ul className="flex justify-evenly">
                {paths.map((path) => (
                    <NavItem key={path.name} {...path} />
                ))}
            </ul>
        </div>
    );
}
