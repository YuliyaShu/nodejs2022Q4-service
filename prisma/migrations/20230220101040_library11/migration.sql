-- CreateTable
CREATE TABLE "UserPrisma" (
    "id" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserPrisma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtistPrisma" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "grammy" BOOLEAN NOT NULL DEFAULT false,
    "favoritesId" TEXT,

    CONSTRAINT "ArtistPrisma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlbumPrisma" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "artistId" TEXT,
    "favoritesId" TEXT,

    CONSTRAINT "AlbumPrisma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackPrisma" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "artistId" TEXT,
    "albumId" TEXT,
    "favoritesId" TEXT,

    CONSTRAINT "TrackPrisma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoritesPrisma" (
    "id" TEXT NOT NULL,

    CONSTRAINT "FavoritesPrisma_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AlbumPrisma_id_key" ON "AlbumPrisma"("id");

-- AddForeignKey
ALTER TABLE "ArtistPrisma" ADD CONSTRAINT "ArtistPrisma_favoritesId_fkey" FOREIGN KEY ("favoritesId") REFERENCES "FavoritesPrisma"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlbumPrisma" ADD CONSTRAINT "AlbumPrisma_favoritesId_fkey" FOREIGN KEY ("favoritesId") REFERENCES "FavoritesPrisma"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlbumPrisma" ADD CONSTRAINT "AlbumPrisma_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "ArtistPrisma"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackPrisma" ADD CONSTRAINT "TrackPrisma_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "ArtistPrisma"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackPrisma" ADD CONSTRAINT "TrackPrisma_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "AlbumPrisma"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackPrisma" ADD CONSTRAINT "TrackPrisma_favoritesId_fkey" FOREIGN KEY ("favoritesId") REFERENCES "FavoritesPrisma"("id") ON DELETE SET NULL ON UPDATE CASCADE;
