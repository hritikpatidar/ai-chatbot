import {
  getClientConfigService,
  getClientByIdService,
  updateClientService,
} from "../services/client.service.js";
import { createClientValidation } from "../validators/client.validation.js";

export const getClientConfig = async (req, res, next) => {
  try {
    const { clientKey } = req.params;

    const config = await getClientConfigService(clientKey);

    return res.status(200).json({
      success: true,
      message: "Client configuration fetched successfully",
      config,
    });
  } catch (error) {
    next(error);
  }
};

export const getClientById = async (req, res, next) => {
  try {
    const { clientId } = req.params;

    const client = await getClientByIdService(clientId);

    return res.status(200).json({
      success: true,
      message: "Client fetched successfully",
      client,
    });
  } catch (error) {
    next(error);
  }
};

export const updateClient = async (req, res, next) => {
  try {
    const { clientId } = req.params;

    const client = await updateClientService(clientId, req.body);

    return res.status(200).json({
      success: true,
      message: "Client updated successfully",
      client,
    });
  } catch (error) {
    next(error);
  }
};
