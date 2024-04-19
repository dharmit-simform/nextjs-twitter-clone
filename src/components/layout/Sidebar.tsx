"use client";

import { handleLogout } from "@/lib/action";
import { Session } from "next-auth";
import { BsBellFill, BsHouseFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import SidebarItem from "./SidebarItem";
import SidebarLogo from "./SidebarLogo";
import SidebarTweetButton from "./SidebarTweetButton";
import { BiLogOut } from "react-icons/bi";
import useCurrentUser from "@/hooks/useCurrentUser";

const Sidebar = () => {
  const { data: currentUser } = useCurrentUser();

  const items = [
    {
      label: "Home",
      href: "/",
      icon: BsHouseFill,
    },
    {
      label: "Notifications",
      href: "/notifications",
      icon: BsBellFill,
      authorized: true,
      alert: currentUser?.hasNotification,
    },
    {
      label: "Profile",
      href: `/users/${currentUser?.id}`,
      icon: FaUser,
      authorized: true,
    },
  ];
  return (
    <div className="col-span-1 h-full pr-4 md:pr-6">
      <div className="flex flex-col items-end">
        <div className="space-y-2 lg:w-[230px]">
          <SidebarLogo />
          {items.map((item) => (
            <SidebarItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              authorized={item.authorized}
              alert={item.alert}
            />
          ))}
          {currentUser && (
            <form action={handleLogout}>
              <button className="relative hidden lg:flex gap-4 p-4 rounded-full hover:bg-slate-300 hover:bg-opacity-10 cursor-pointer items-center">
                <BiLogOut size={24} />
                <p className="hidden lg:block text-white text-xl">Logout</p>
              </button>
              <button className="relative rounded-full h-14 w-14 flex items-center justify-center p-4 hover:bg-slate-400 hover:bg-opacity-10 cursor-pointer lg:hidden">
                <BiLogOut size={28} color="white" />
              </button>
            </form>
            // <SidebarItem
            //   onClick={() => signOut()}
            //   icon={BiLogOut}
            //   label="Logout"
            // />
          )}
          <SidebarTweetButton />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
