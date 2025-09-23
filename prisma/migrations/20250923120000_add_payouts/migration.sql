-- Create Payout table
CREATE TABLE "Payout" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "amountCents" INTEGER NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PAID',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "paidAt" TIMESTAMP(3),
  CONSTRAINT "Payout_pkey" PRIMARY KEY ("id")
);

-- Add foreign key
ALTER TABLE "Payout" ADD CONSTRAINT "Payout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


