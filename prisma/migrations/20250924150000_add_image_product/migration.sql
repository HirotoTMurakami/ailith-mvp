-- Create enum for ProductType
DO $$ BEGIN
  CREATE TYPE "ProductType" AS ENUM ('VIDEO','IMAGE');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add columns to Product
ALTER TABLE "Product"
  ADD COLUMN IF NOT EXISTS "productType" "ProductType" NOT NULL DEFAULT 'VIDEO',
  ADD COLUMN IF NOT EXISTS "sampleImageUrls" TEXT[] NOT NULL DEFAULT '{}';

-- Make youtubeUrl optional
ALTER TABLE "Product" ALTER COLUMN "youtubeUrl" DROP NOT NULL;


