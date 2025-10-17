-- AlterTable
ALTER TABLE "Destination" ADD COLUMN     "photos" JSONB[] DEFAULT ARRAY[]::JSONB[];
