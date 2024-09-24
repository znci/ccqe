import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    players: () => prisma.player.findMany(),
    player: (_: any, args: { id?: number; username?: string; uuid?: string }) => {
      const { id, username, uuid } = args;
      if (id) return prisma.player.findUnique({ where: { id } });
      if (username) return prisma.player.findFirst({ where: { username } });
      if (uuid) return prisma.player.findFirst({ where: { uuid } });
      return null;
    },
    ranks: () => prisma.rank.findMany(),
    rank: (_: any, { id }: { id: number }) => prisma.rank.findUnique({ where: { id } }),
    versions: () => prisma.version.findMany(),
    version: (_: any, { id }: { id: number }) => prisma.version.findUnique({ where: { id } }),
    activities: () => prisma.activity.findMany(),
    activity: (_: any, { id }: { id: number }) => prisma.activity.findUnique({ where: { id } }),
  },
  Player: {
    ranks: (parent: any) => prisma.rank.findMany({ where: { players: { some: { id: parent.id } } } }),
    version: (parent: any) => prisma.version.findUnique({ where: { id: parent.versionId } }),
    activity: (parent: any) => prisma.activity.findUnique({ where: { playerId: parent.id } }),
  },
  Rank: {
    players: (parent: any) => prisma.player.findMany({ where: { ranks: { some: { id: parent.id } } } }),
  },
  Version: {
    players: (parent: any) => prisma.player.findMany({ where: { versionId: parent.id } }),
  },
  Activity: {
    player: (parent: any) => prisma.player.findUnique({ where: { id: parent.playerId } }),
  },
};
