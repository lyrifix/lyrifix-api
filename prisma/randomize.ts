import { User } from "../src/generated/prisma/client";

export function getRandomizedUserId(userA: User, userB: User) {
  const randomizedUserId = Math.random() < 0.5 ? userA.id : userB.id;
  return randomizedUserId;
}
