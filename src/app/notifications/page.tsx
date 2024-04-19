import Header from "@/components/Header";
import NotificationsFeed from "@/components/notification/NotificationsFeed";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const Notification = async () => {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (
    <>
      <Header label="Notifications" showBackArrow />
      <NotificationsFeed />
    </>
  );
};

export default Notification;
