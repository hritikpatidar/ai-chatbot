import { getChatbotStats, getClientActivity, getDashboardStats, getRecentClients, getSubscriptionStats } from "../repositories/admin.repository.js";


export const getAdminDashboardService = async () => {
  const [stats, activity, recentClients, chatbotStats, subscriptionStats,] = await Promise.all([
    getDashboardStats(),
    getClientActivity(),
    getRecentClients(),
    getChatbotStats(),
    getSubscriptionStats(),
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
      chatbotsOnlinePercentage: null,
      subscriptionsActivePercentage: null,
    },
    systemOverview: {
      activeClients: stats.activeClients,
      totalClients: stats.totalClients,
      activeClientsPercentage,
      inactiveClientsPercentage,

      totalChatbots: chatbotStats.totalChatbots,
      onlineChatbots: chatbotStats.onlineChatbots,
      offlineChatbots: chatbotStats.offlineChatbots,
      chatbotsOnlinePercentage:
        chatbotStats.chatbotsOnlinePercentage,

      totalSubscriptions: subscriptionStats.totalSubscriptions,
      activeSubscriptions: subscriptionStats.activeSubscriptions,
      inactiveSubscriptions: subscriptionStats.inactiveSubscriptions,
      subscriptionsActivePercentage:
        subscriptionStats.subscriptionsActivePercentage,
    },

    recentClients,
  };
};
