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
import { ChartNoAxesGantt, Folders, ChartNoAxesCombined, Layers2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Link } from "@heroui/link"
import { usePathname } from "next/navigation"

export default function SiteDialog() {
    const { toggleSidebar } = useSidebar()

    const corporation = {
        name: "Webesters",
        icon: ChartNoAxesGantt
    }

    const routes = [
        {
            name: "Dashboard",
            icon: ChartNoAxesCombined,
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
        }
    ]

    const path = usePathname()

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
                            <SidebarMenuButton
                                size="lg"
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            >
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src="#" alt="mhmmd" />
                                    <AvatarFallback className="rounded-lg">MH</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">Mhmmd</span>
                                    <span className="truncate text-xs">mhmmd@gmail.com</span>
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>
        </>
    );
}
