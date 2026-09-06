const {
  getAdminMockTests,
  getAdminMockTestById,
  createMockTest,
  updateMockTest,
  deleteMockTest,
} = require("../services/admin-mockTest.service");

function sendError(res, error) {
  const status = error.statusCode || 500;

  if (status >= 500) {
    console.error("Admin mock test operation failed:", error);
  }

  return res.status(status).json({
    success: false,
    message: status >= 500 ? "Unable to complete mock test operation" : error.message,
  });
}

async function listMockTests(req, res) {
  try {
    const mockTests = await getAdminMockTests();
    return res.status(200).json({ success: true, data: mockTests });
  } catch (error) {
    return sendError(res, error);
  }
}

async function getMockTest(req, res) {
  try {
    const mockTest = await getAdminMockTestById(req.params.id);

    if (!mockTest) {
      return res.status(404).json({
        success: false,
        message: "Mock test not found",
      });
    }

    return res.status(200).json({ success: true, data: mockTest });
  } catch (error) {
    return sendError(res, error);
  }
}

async function create(req, res) {
  try {
    const mockTest = await createMockTest(req.body || {});
    return res.status(201).json({
      success: true,
      message: "Mock test created successfully",
      data: mockTest,
    });
  } catch (error) {
    return sendError(res, error);
  }
}

async function update(req, res) {
  try {
    const mockTest = await updateMockTest(req.params.id, req.body || {});
    return res.status(200).json({
      success: true,
      message: "Mock test updated successfully",
      data: mockTest,
    });
  } catch (error) {
    return sendError(res, error);
  }
}

async function remove(req, res) {
  try {
    await deleteMockTest(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Mock test deleted successfully",
    });
  } catch (error) {
    return sendError(res, error);
  }
}

module.exports = {
  listMockTests,
  getMockTest,
  create,
  update,
  remove,
};
