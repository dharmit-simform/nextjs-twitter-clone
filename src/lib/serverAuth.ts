import { auth } from "./auth";
import prisma from "./prismadb";

const serverAuth = async () => {
  const session = await auth();

  if (!session?.user?.email) {
    throw Error('Not Signed In')
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      email: session.user.email
    }
  })

  if (!currentUser) {
    throw Error("Not Signed In");
  }

  return { currentUser }
}

export default serverAuth;