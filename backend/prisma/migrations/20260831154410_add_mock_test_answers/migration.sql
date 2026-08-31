-- CreateTable
CREATE TABLE "public"."MockTestAnswer" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "selectedAnswer" TEXT,
    "isCorrect" BOOLEAN NOT NULL,

    CONSTRAINT "MockTestAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MockTestAnswer_attemptId_idx" ON "public"."MockTestAnswer"("attemptId");

-- CreateIndex
CREATE INDEX "MockTestAnswer_questionId_idx" ON "public"."MockTestAnswer"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "MockTestAnswer_attemptId_questionId_key" ON "public"."MockTestAnswer"("attemptId", "questionId");

-- AddForeignKey
ALTER TABLE "public"."MockTestAnswer" ADD CONSTRAINT "MockTestAnswer_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "public"."MockTestAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MockTestAnswer" ADD CONSTRAINT "MockTestAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
