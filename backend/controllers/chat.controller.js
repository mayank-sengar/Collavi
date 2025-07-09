import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateStreamToken } from "../config/stream.js";

export const getStreamToken = asyncHandler(async (req, res) => {
    try {
        const token = generateStreamToken(req.user.id);
        return res.status(200).json(new ApiResponse(200, { token }, "Stream token generated successfully"));
    } catch (error) {
        throw new ApiError(500, error.message || "Internal Server Error");
    }
});


