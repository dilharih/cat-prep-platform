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
      message: "Internal server error",
    });
  }
}

async function getMockTestsList(req, res) {
  try {
    const result = await getMockTests(req.query);

    res.status(200).json({
      success: true,
      data: result.mockTests,
      pagination: result.pagination,
    });
  } catch (error) {
    if (
      error.message === "Page must be a positive integer" ||
      error.message === "Year must be an integer" ||
      error.message === "Slot must be an integer" ||
      error.message === "Limit must be an integer between 1 and 50"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error(
      "Failed to get mock tests:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = {
  getMockTest,
  getMockTestsList,
};
