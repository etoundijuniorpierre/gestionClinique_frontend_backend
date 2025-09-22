
import axiosInstance from '../composants/config/axiosConfig';


const notificationApi = {
  // Récupérer les notifications non lues d'un utilisateur
  async getUnreadNotifications(userId) {
    const res = await axiosInstance.get(`/notifications/utilisateur/${userId}/non-lues`);
    return res.data;
  },

  // Marquer une notification comme lue
  async markAsRead(notificationId) {
    const res = await axiosInstance.post(`/notifications/${notificationId}/marquer-lue`);
    return res.data;
  }
};

export default notificationApi;
