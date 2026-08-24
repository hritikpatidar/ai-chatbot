import mongoose from "mongoose";
import {
  createClientService,
  deleteClientService,
  getAllClientsService,
  getClientByIdService,
  updateAdminClientService,
} from "../services/admin.service.js";
import { createClientValidation, updateClientValidation } from "../validators/client.validation.js";
import Joi from "joi";

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

export const getAllClients = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = "", status = "" } = req.query;

    const result = await getAllClientsService({
      page,
      limit,
      search,
      status,
    });

    return res.status(200).json({
      success: true,
      message: "Clients fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("Get All Clients Error:", error);

    next(error);
  }
};

export const getClientById = async (req, res, next) => {
  try {
    const { clientId } = req.params;

    const result = await getClientByIdService(clientId);

    return res.status(200).json({
      success: true,
      message: "Client fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("Get Client Error:", error);

    if (error.message === "INVALID_CLIENT_ID") {
      return res.status(400).json({
        success: false,
        message: "Invalid client ID",
      });
    }

    if (error.message === "CLIENT_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    next(error);
  }
};

export const deleteClient = async (req, res) => {
  try {
    const { clientId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid client ID",
      });
    }

    await deleteClientService(clientId);

    return res.status(200).json({
      success: true,
      message: "Client deleted successfully",
    });
  } catch (error) {
    console.error("Delete client error:", error);

    return res.status(error.message === "Client not found" ? 404 : 500).json({
      success: false,
      message: error.message || "Failed to delete client",
    });
  }
};

export const updateAdminClient = async (req, res) => {
  try {
    const { clientId } = req.params;

    const { error } = updateClientValidation.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // Client ID check
    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "Client ID is required",
      });
    }

    const data = await updateAdminClientService(clientId, req.body);

    return res.status(200).json({
      success: true,
      message: "Client updated successfully",
      data,
    });
  } catch (error) {
    console.error("Update admin client error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to update client",
    });
  }
};
