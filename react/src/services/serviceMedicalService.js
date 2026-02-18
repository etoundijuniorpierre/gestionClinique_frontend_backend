// src/services/serviceMedicalService.js
import axiosInstance from '../composants/config/axiosConfig';

const serviceMedicalService = {
  // Créer un service médical
  createServiceMedical: async (serviceMedicalData) => {
    try {
      const response = await axiosInstance.post('services-medicaux', serviceMedicalData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du service médical:', error);
      throw error;
    }
  },

  // Récupérer tous les services médicaux (pour les select/dropdown)
  getAllServicesMedicauxForSelect: async () => {
    try {
      const response = await axiosInstance.get('services-medicaux');
      return response.data.map(service => ({
        id: service.id,
        nomService: service.nomService,
        medecinResponsable: service.medecinResponsable
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des services médicaux:', error);
      throw error;
    }
  },

  // Récupérer tous les services médicaux avec IDs pour les formulaires
  getAllServicesMedicauxWithIds: async () => {
    try {
      const response = await axiosInstance.get('services-medicaux');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des services médicaux:', error);
      throw error;
    }
  },

  // Récupérer tous les services médicaux
  getAllServicesMedicaux: async () => {
    try {
      const response = await axiosInstance.get('services-medicaux');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des services médicaux:', error);
      throw error;
    }
  },

  // Récupérer un service médical par ID
  getServiceMedicalById: async (id) => {
    try {
      const response = await axiosInstance.get(`services-medicaux/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du service médical ${id}:`, error);
      throw error;
    }
  },

  // Mettre à jour un service médical
  updateServiceMedical: async (id, serviceMedicalData) => {
    try {
      const response = await axiosInstance.put(`services-medicaux/${id}`, serviceMedicalData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du service médical ${id}:`, error);
      throw error;
    }
  },

  // Supprimer un service médical
  deleteServiceMedical: async (id) => {
    try {
      await axiosInstance.delete(`services-medicaux/${id}`);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression du service médical ${id}:`, error);
      throw error;
    }
  },

  // Récupérer les services par médecin responsable
  getServicesByMedecinResponsable: async (medecinId) => {
    try {
      const response = await axiosInstance.get(`services-medicaux/medecin-responsable/${medecinId}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des services du médecin ${medecinId}:`, error);
      throw error;
    }
  },

  // Récupérer les médecins d'un service médical
  getMedecinsByServiceMedicalId: async (serviceId) => {
    try {
      const response = await axiosInstance.get(`services-medicaux/${serviceId}/medecins`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des médecins du service ${serviceId}:`, error);
      throw error;
    }
  },

  // Récupérer tous les responsables de services médicaux
  getAllResponsablesServicesMedicaux: async () => {
    try {
      const response = await axiosInstance.get('services-medicaux/responsables');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des responsables de services médicaux:', error);
      throw error;
    }
  }
};

export default serviceMedicalService;
