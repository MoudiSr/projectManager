"use client"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar
} from "@/components/ui/sidebar"
import { ChartNoAxesGantt, Folders, ChartNoAxesCombined, Layers2, User, LogOut, BadgeDollarSign, LayoutPanelLeft, LayoutDashboard } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Link } from "@heroui/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"

export default function SiteDialog() {
    const { toggleSidebar } = useSidebar()
    const { data: session } = useSession()

    const corporation = {
        name: "Webesters",
        icon: ChartNoAxesGantt
    }

    const routes = [
        {
            name: "Dashboard",
            icon: LayoutDashboard,
            url: "/"
        },
        {
            name: "Projects",
            icon: Folders,
            url: "/projects"
        },
        {
            name: "Categories",
            icon: Layers2,
            url: "/categories"
        },
        {
            name: "Accounts",
            icon: User,
            url: "/accounts"
        },
        {
            name: "Sales",
            icon: ChartNoAxesCombined,
            url: "/sales"
        }
    ]

    const path = usePathname()

    const username = session?.user?.username || "Guest"

    return (
        <>
            <Sidebar collapsible="icon">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                size="lg"
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            >
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <corporation.icon className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        {corporation.name}
                                    </span>
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Routes</SidebarGroupLabel>
                        <SidebarMenu>
                            {routes.map(route => (
                                <SidebarMenuItem key={route.name}>
                                    <SidebarMenuButton asChild className={
                                        (path === "/" && route.url === "/") ? "bg-secondary text-white hover:bg-secondary hover:text-white active:bg-secondary active:text-white"
                                            : (path === "/projects" && route.url === "/projects") ? "bg-secondary text-white hover:bg-secondary hover:text-white active:bg-secondary active:text-white"
                                                : (path === "/categories" && route.url === "/categories") ? "bg-secondary text-white hover:bg-secondary hover:text-white active:bg-secondary active:text-white"
                                                    : (path === "/accounts" && route.url === "/accounts") ? "bg-secondary text-white hover:bg-secondary hover:text-white active:bg-secondary active:text-white"
                                                        : (path === "/sales" && route.url === "/sales") ? "bg-secondary text-white hover:bg-secondary hover:text-white active:bg-secondary active:text-white"
                                                            : ""} onClick={() => toggleSidebar()}>
                                        <Link href={route.url}>
                                            <route.icon className="size-4 mr-1" />
                                            <span className="text-sm">{route.name}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton
                                        size="lg"
                                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                    >
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarImage src="#" alt="mhmmd" />
                                            <AvatarFallback className="rounded-lg">{(username.substring(0, 2)).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">{username}</span>
                                        </div>
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="z-[999]">
                                    <DropdownMenuItem onClick={() => signOut()}><LogOut className="size-4" /> Logout</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>
        </>
    );
}
