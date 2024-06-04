import Link from 'next/link';

type Path = {
	href: string;
	name: string;
};

function NavItem({ href, name }: Path) {
	return (
		<li>
			<Link href={href}>{name}</Link>
		</li>
	);
}

const paths: Path[] = [
	{
		href: '/',
		name: 'Pomodoro',
	},
	{
		href: '/guide',
		name: 'Guide',
	},
	{
		href: '/statistic',
		name: 'Statistic',
	},
];

export default function Navigation() {
	return (
		<div className="fixed w-full bottom-0 py-12">
			<ul className="flex justify-evenly">
				{paths.map((path) => (
					<NavItem key={path.name} {...path} />
				))}
			</ul>
		</div>
	);
}
