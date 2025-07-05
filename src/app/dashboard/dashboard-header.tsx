import Link from "next/link";
import ProfileButton from "~/components/ProfileButton";
import { auth } from "~/server/auth";
import { Button } from "../../components/ui/button";
import { Home } from "lucide-react";
import { cn } from "~/lib/utils";

export async function DashboardHeader() {
	const session = await auth();

	return (
		<header className="fixed left-0 right-0 top-0 z-10 flex h-16 items-center justify-between bg-transparent  px-6">
			<Link href="/dashboard" className="flex items-center space-x-2">
				<svg
					height="42"
					viewBox="0 0 53 58"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M20.5889 2.3455C24.2562 0.269783 28.7438 0.269784 32.4111 2.3455L46.9111 10.5535C50.6739 12.6834 53 16.6731 53 20.9969V37.0037C52.9999 41.3273 50.6737 45.3162 46.9111 47.4461L32.4111 55.6541C28.7438 57.73 24.2562 57.7299 20.5889 55.6541L6.08887 47.4461C2.32625 45.3162 0.000102674 41.3273 0 37.0037V20.9969C0 16.6731 2.32609 12.6834 6.08887 10.5535L20.5889 2.3455ZM10 19.4891L22.4463 41.6893H31.1006L43.5469 19.4891H34.1035L26.7812 35.3572L19.4434 19.4891H10Z"
						fill="black"
					/>
				</svg>
			</Link>
			<div className="flex flex-1 justify-center">
				<div
					className="flex items-center rounded-xl px-2 py-1 gap-2 bg-white"
					style={{
						boxShadow:
							"rgba(68, 68, 70, 0.1) 0px 8px 12px 0px, rgba(68, 68, 70, 0.05) 0px 2px 8px -2px, rgba(68, 68, 70, 0.05) 0px 1px 4px -1px",
					}}
				>
					{/* Home Icon */}
					<Link href="/dashboard">
						<Button
							variant="ghost"
							size="sm"
							className="h-8 w-8 p-0 bg-[#119F52]/10 text-[#119F52]"
						>
							<Home className="h-4 w-4" />
						</Button>
					</Link>

					{/* Navigation Tabs */}
					<div className="flex items-center">
						<Button
							key={"folder"}
							variant="ghost"
							size="sm"
							className={cn(
								"rounded-md px-2 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900",
							)}
						>
							{"Folders"}
						</Button>
						<Button
							key={"settings"}
							variant="ghost"
							size="sm"
							className={cn(
								"rounded-md px-2 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900",
							)}
						>
							{"Settings"}
						</Button>
					</div>
				</div>
			</div>
			{session ? (
				<ProfileButton
					user={session.user}
					image={session.user.image ?? "/favicon.ico"}
				/>
			) : (
				<Link href="/sign-in">
					<Button>Sign In</Button>
				</Link>
			)}
		</header>
	);
}
