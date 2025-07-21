import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateStreamToken } from "../config/stream.js";

export const getStreamToken = asyncHandler(async (req, res) => {
    try {
        console.log("Generating stream token for user:", req.user._id);
        const token = generateStreamToken(req.user._id);
        console.log("Generated token:", token);
        return res.status(200).json(new ApiResponse(200, { token }, "Stream token generated successfully"));
    } catch (error) {
        console.error("Stream token generation error:", error);
        throw new ApiError(500, error.message || "Internal Server Error");
    }
});


