import crypto from "crypto";

import { findClientByKey } from "../repositories/client.repository.js";

import {
  findWidgetVisitorByGuestId,
  findWidgetVisitorByEmail,
  createWidgetVisitor,
  updateWidgetVisitor,
  createWidgetSession,
  findWidgetSessionByHash,
  updateWidgetSessionActivity,
  deleteWidgetSession,
} from "../repositories/widget.repository.js";
import env from "../config/env.js";


const generateSessionToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

const hashSessionToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const identifyWidgetVisitor = async ({
  clientKey,
  guestId,
  fullName,
  email,
  phone,
}) => {
  /* =========================================================
     1. FIND CLIENT
  ========================================================= */

  const client = await findClientByKey(clientKey);

  if (!client) {
    throw new Error("Invalid or inactive client key");
  }

  const clientId = client._id;

  /* =========================================================
     2. FIND EXISTING VISITOR BY GUEST ID
  ========================================================= */

  let visitor = await findWidgetVisitorByGuestId({
    clientId,
    guestId,
  });

  /* =========================================================
     3. IF GUEST NOT FOUND, CHECK EMAIL
  ========================================================= */

  if (!visitor) {
    visitor = await findWidgetVisitorByEmail({
      clientId,
      email,
    });
  }

  /* =========================================================
     4. CREATE / UPDATE VISITOR
  ========================================================= */

  if (visitor) {
    visitor = await updateWidgetVisitor(visitor._id, {
      fullName,
      email,
      phone,
    });
  } else {
    visitor = await createWidgetVisitor({
      clientId,
      guestId,
      fullName,
      email,
      phone,
    });
  }

  /* =========================================================
     5. CREATE SESSION
  ========================================================= */

  const sessionToken = generateSessionToken();
  const sessionTokenHash = hashSessionToken(sessionToken);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + env.WIDGET_SESSION_DAYS_EXPIRE);

  await createWidgetSession({
    clientId,
    visitorId: visitor._id,
    guestId,
    sessionTokenHash,
    expiresAt,
  });

  /* =========================================================
     6. RESPONSE
  ========================================================= */

  return {
    visitor: {
      _id: visitor._id,
      fullName: visitor.fullName,
      email: visitor.email,
      phone: visitor.phone,
    },

    sessionToken,

    expiresAt,

    client: {
      _id: client._id,
      businessName: client.businessName,
      clientKey: client.clientKey,
    },
  };
};

export const verifyWidgetSession = async (sessionToken) => {
  if (!sessionToken) {
    throw new Error("Session token is required");
  }

  const sessionTokenHash = hashSessionToken(sessionToken);

  const session = await findWidgetSessionByHash(sessionTokenHash);

  if (!session) {
    return {
      valid: false,
      visitor: null,
    };
  }
  // Session expire ho chuki hai
  if (session.expiresAt <= new Date()) {
    await deleteWidgetSession(session._id);
    return {
      valid: false,
      visitor: null,
    };
  }

  await updateWidgetSessionActivity(session._id);

  return {
    valid: true,

    visitor: {
      _id: session.visitorId._id,
      fullName: session.visitorId.fullName,
      email: session.visitorId.email,
      phone: session.visitorId.phone,
    },

    clientId: session.clientId,
    guestId: session.guestId,

    expiresAt: session.expiresAt,
  };
};
