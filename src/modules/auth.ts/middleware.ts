import { createMiddleware } from "hono/factory";
import { prisma } from "../../lib/prisma";
import { PrivateUser } from "../user/schema";
import { verifyToken } from "../../lib/token";

type Env = {
  Variables: {
    user: PrivateUser;
  };
};

// Check for header token
export const checkAuthorized = createMiddleware<Env>(async (c, next) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) {
      return c.json({ message: "Authorization header is required" }, 401);
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return c.json({ message: "Token is required" }, 401);
    }

    const decodedToken = verifyToken(token);
    if (!decodedToken) {
      return c.json({ message: "Invalid token" }, 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: decodedToken.sub },
    });
    if (!user) {
      return c.json({ message: "User is no longer available" }, 401);
    }

    c.set("user", user);

    await next();
  } catch (error) {
    return c.json({ message: "Failed to check authorized user" }, 401);
  }
});
