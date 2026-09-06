const {
  getMockTestQuestions,
  createQuestionForMockTest,
  createQuestionsBulk,
  updateQuestion,
  removeQuestionFromMockTest,
} = require("../services/admin-question.service");

function sendError(res, error) {
  const status = error.statusCode || 500;
  if (status >= 500) console.error("Admin question operation failed:", error);
  return res.status(status).json({
    success: false,
    message: status >= 500 ? "Unable to complete question operation" : error.message,
  });
}

async function list(req, res) {
  try {
    return res.status(200).json({ success: true, data: await getMockTestQuestions(req.params.mockTestId) });
  } catch (error) {
    return sendError(res, error);
  }
}

async function create(req, res) {
  try {
    return res.status(201).json({ success: true, message: "Question added successfully", data: await createQuestionForMockTest(req.params.mockTestId, req.body || {}) });
  } catch (error) {
    return sendError(res, error);
  }
}

async function bulkCreate(req, res) {
  try {
    const data = req.body || {};
    const questions = Array.isArray(data) ? data : data.questions;
    const created = await createQuestionsBulk(req.params.mockTestId, questions);
    return res.status(201).json({
      success: true,
      message: `${created.length} questions imported successfully`,
      data: created,
    });
  } catch (error) {
    return sendError(res, error);
  }
}

async function update(req, res) {
  try {
    return res.status(200).json({ success: true, message: "Question updated successfully", data: await updateQuestion(req.params.questionId, req.body || {}) });
  } catch (error) {
    return sendError(res, error);
  }
}

async function remove(req, res) {
  try {
    await removeQuestionFromMockTest(req.params.mockTestId, req.params.questionId);
    return res.status(200).json({ success: true, message: "Question removed from mock test" });
  } catch (error) {
    return sendError(res, error);
  }
}

module.exports = { list, create, bulkCreate, update, remove };
