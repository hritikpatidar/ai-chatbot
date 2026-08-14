import { createClientService } from "../services/admin.service.js";
import { createClientValidation } from "../validators/client.validation.js";


export const createClientUser = async (req, res, next) => {
  try {
    const { error } = createClientValidation.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const result = await createClientService(req.body);

    return res.status(201).json({
      success: true,
      message: "Client created successfully",
      data: {
        client: result.client,
        user: {
          _id: result.user._id,
          fullName: result.user.fullName,
          email: result.user.email,
          role: result.user.role,
          clientId: result.user.clientId,
        },
      },
    });
  } catch (error) {
    console.error("Create Client Error:", error);

    if (error.message === "USER_ALREADY_EXISTS") {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    if (error.message === "CLIENT_KEY_ALREADY_EXISTS") {
      return res.status(409).json({
        success: false,
        message: "Client key already exists",
      });
    }

    if (error.message === "CLIENT_SLUG_ALREADY_EXISTS") {
      return res.status(409).json({
        success: false,
        message: "Client slug already exists",
      });
    }

    next(error);
  }
};