import Client from "../models/Client.js";
import User from "../models/User.js";

/* =========================================================
   DASHBOARD STATS
========================================================= */

export const getDashboardStats = async () => {
  const startOfMonth = new Date();

  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    totalClients,
    activeClients,
    inactiveClients,
    newClients,
  ] = await Promise.all([
    Client.countDocuments(),

    Client.countDocuments({
      status: "active",
    }),

    Client.countDocuments({
      status: "inactive",
    }),

    Client.countDocuments({
      createdAt: {
        $gte: startOfMonth,
      },
    }),
  ]);

  return {
    totalClients,
    activeClients,
    inactiveClients,
    newClients,
  };
};

/* =========================================================
   CLIENT ACTIVITY
========================================================= */

export const getClientActivity = async () => {
  const now = new Date();

  const startDate = new Date(
    now.getFullYear(),
    now.getMonth() - 7,
    1,
  );

  const activity = await Client.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
        },
      },
    },

    {
      $group: {
        _id: {
          year: {
            $year: "$createdAt",
          },

          month: {
            $month: "$createdAt",
          },
        },

        count: {
          $sum: 1,
        },
      },
    },

    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
  ]);

  const result = [];

  for (let i = 7; i >= 0; i--) {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - i,
      1,
    );

    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const found = activity.find(
      (item) =>
        item._id.year === year &&
        item._id.month === month,
    );

    result.push({
      month: date.toLocaleString("en-US", {
        month: "short",
      }),

      year,

      count: found?.count || 0,
    });
  }

  return result;
};

/* =========================================================
   RECENT CLIENTS
========================================================= */

export const getRecentClients = async () => {
  const clients = await Client.find({})
    .sort({
      createdAt: -1,
    })
    .limit(5)
    .lean();

  const clientIds = clients.map(
    (client) => client._id,
  );

  const users = await User.find({
    clientId: {
      $in: clientIds,
    },

    role: "client",
  })
    .select(
      "_id fullName email profileImage clientId lastLogin",
    )
    .lean();

  const userMap = new Map(
    users.map((user) => [
      String(user.clientId),
      user,
    ]),
  );

  return clients.map((client) => {
    const user = userMap.get(
      String(client._id),
    );

    return {
      _id: client._id,

      businessName: client.businessName,

      businessType: client.businessType,

      status: client.status,

      clientKey: client.clientKey,

      slug: client.slug,

      createdAt: client.createdAt,

      updatedAt: client.updatedAt,

      user: user
        ? {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profileImage: user.profileImage,
            lastLogin: user.lastLogin,
          }
        : null,
    };
  });
};