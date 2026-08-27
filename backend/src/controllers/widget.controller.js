import {
  identifyWidgetVisitor,
  verifyWidgetSession,
} from "../services/widget.service.js";

import { widgetIdentifyValidation } from "../validators/widget.validation.js";

export const identifyWidgetVisitorController = async (req, res, next) => {
  try {
    const { error } = widgetIdentifyValidation.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const result = await identifyWidgetVisitor(req.body);

    return res.status(200).json({
      success: true,
      message: "Visitor identified successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyWidgetSessionController = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Session token is required",
      });
    }

    const [type, token] = authHeader.split(" ");

    if (type !== "Bearer" || !token) {
      return res.status(401).json({
        success: false,
        message: "Invalid session token",
      });
    }

    const result = await verifyWidgetSession(token);

    if (!result.valid) {
      return res.status(401).json({
        success: false,
        message: "Session expired or invalid",
        data: {
          valid: false,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Session is valid",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
