import WidgetVisitor from "../models/WidgetVisitor.js";
import Session from "../models/Session.js";

/* =========================================================
   VISITOR
========================================================= */

export const findWidgetVisitorByGuestId = async ({
  clientId,
  guestId,
}) => {
  return await WidgetVisitor.findOne({
    clientId,
    guestId,
    accountStatus: "active",
  });
};

export const findWidgetVisitorByEmail = async ({
  clientId,
  email,
}) => {
  return await WidgetVisitor.findOne({
    clientId,
    email: email.toLowerCase(),
    accountStatus: "active",
  });
};

export const createWidgetVisitor = async (data) => {
  return await WidgetVisitor.create(data);
};

export const updateWidgetVisitor = async (
  visitorId,
  data,
) => {
  return await WidgetVisitor.findByIdAndUpdate(
    visitorId,
    {
      $set: {
        ...data,
        lastSeenAt: new Date(),
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );
};

/* =========================================================
   SESSION
========================================================= */

export const createWidgetSession = async (data) => {
  console.log("data", data)
  return await Session.create(data);
};

export const updateWidgetSession = async (sessionId, data) => {
  return await Session.findByIdAndUpdate(
    sessionId,
    {
      $set: data,
    },
    {
      new: true,
      runValidators: true,
    }
  );
};


export const updateWidgetSessionActivity = async (
  sessionId,
) => {
  return await Session.findByIdAndUpdate(
    sessionId,
    {
      $set: {
        lastSeenAt: new Date(),
      },
    },
    {
      new: true,
    },
  );
};

export const findWidgetSessionByGuestId = async ({
  clientId,
  visitorId,
}) => {
  return await Session.findOne({
    clientId,
    visitorId,
  });
};

export const findWidgetSessionByHash = async (
  sessionTokenHash,
) => {
  return await Session.findOne({
    sessionTokenHash,
  }).populate("visitorId");
};

export const deleteWidgetSession = async (sessionId) => {
  return await Session.findByIdAndDelete(sessionId);
};