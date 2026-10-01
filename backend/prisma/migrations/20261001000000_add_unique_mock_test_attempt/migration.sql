-- Prevent a user from submitting the same mock test more than once.
CREATE UNIQUE INDEX "MockTestAttempt_userId_mockTestId_key"
ON "MockTestAttempt"("userId", "mockTestId");
