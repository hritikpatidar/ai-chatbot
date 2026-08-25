import { getClientActivity, getDashboardStats, getRecentClients } from "../repositories/admin.repository.js";


export const getAdminDashboardService = async () => {
  const [stats, activity, recentClients] = await Promise.all([
    getDashboardStats(),
    getClientActivity(),
    getRecentClients(),
  ]);

  const activeClientsPercentage =
    stats.totalClients > 0
      ? Math.round((stats.activeClients / stats.totalClients) * 100)
      : 0;

  const inactiveClientsPercentage =
    stats.totalClients > 0
      ? Math.round((stats.inactiveClients / stats.totalClients) * 100)
      : 0;

  return {
    stats,

    activity,

    systemOverview: {
      activeClientsPercentage,

      inactiveClientsPercentage,

      // Abhi actual chatbot/subscription
      // collection available nahi hai.
      chatbotsOnlinePercentage: null,

      subscriptionsActivePercentage: null,
    },

    recentClients,
  };
};
