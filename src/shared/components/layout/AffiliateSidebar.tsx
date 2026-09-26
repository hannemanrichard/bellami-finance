"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Receipt } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/shared/components/ui/sidebar";
import { UserNav } from "./UserNav";
import { useLanguage } from "@/shared/hooks/use-language";
import { LanguageSwitcher } from "./language-switcher";

const navigationItems = [
  {
    label: "Add expense",
    href: "/",
    icon: Receipt,
  },
];

export function AffiliateSidebar() {
  const pathname = usePathname();
  const { isRTL } = useLanguage();

  return (
    <Sidebar
      collapsible="icon"
      side={isRTL ? "right" : "left"}
      className="bg-white text-[#222]"
    >
      <SidebarHeader className="border-b border-[#f0f0f0] px-4 py-5">
        <Link href="/" className="flex items-center justify-center">
          <Image src="/logo.svg" alt="bellami-finance" width={52} height={52} className="h-12 w-auto" />
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 pb-4 pt-6">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-[#f5f5f5]"
                    >
                      <Link href={item.href} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-[#f0f0f0] px-3 py-4 space-y-3">
        <div className="rounded-xl border border-[#f0f0f0] px-3 py-2">
          <LanguageSwitcher />
        </div>
        <UserNav />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
