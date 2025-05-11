import * as jwt from "jsonwebtoken";

const tokenSecretKey = String(process.env.TOKEN_SECRET_KEY);

interface JWTPayload {
  sub: string;
}

export function generateToken(userId: string) {
  const payload = { sub: userId };
  const token = jwt.sign(payload, tokenSecretKey, { expiresIn: "24h" });
  return token;
}

export function verifyToken(token: string): JWTPayload {
  const decodedToken = jwt.verify(token, tokenSecretKey);
  return decodedToken as JWTPayload;
}
