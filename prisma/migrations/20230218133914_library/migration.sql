-- CreateTable
CREATE TABLE "UserPrisma" (
    "id" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" INTEGER NOT NULL,
    "updatedAt" INTEGER NOT NULL,

    CONSTRAINT "UserPrisma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtistPrisma" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "grammy" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ArtistPrisma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlbumPrisma" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "artistId" TEXT NOT NULL,

    CONSTRAINT "AlbumPrisma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackPrisma" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,

    CONSTRAINT "TrackPrisma_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPrisma_id_key" ON "UserPrisma"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ArtistPrisma_id_key" ON "ArtistPrisma"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AlbumPrisma_id_key" ON "AlbumPrisma"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TrackPrisma_id_key" ON "TrackPrisma"("id");
