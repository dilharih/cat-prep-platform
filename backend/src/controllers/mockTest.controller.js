const {
  getMockTestById,
  getMockTests,
} = require("../services/mockTest.service");

async function getMockTest(req, res) {
  try {
    const mockTest = await getMockTestById(
      req.params.id
    );

    if (!mockTest) {
      return res.status(404).json({
        success: false,
        message: "Mock test not found",
      });
    }

    res.status(200).json({
      success: true,
      data: mockTest,
    });
  } catch (error) {
    console.error(
      "Failed to get mock test:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function getMockTestsList(req, res) {
  try {
    const mockTests = await getMockTests();

    res.status(200).json({
      success: true,
      data: mockTests,
    });
  } catch (error) {
    console.error(
      "Failed to get mock tests:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  getMockTest,
  getMockTestsList,
};