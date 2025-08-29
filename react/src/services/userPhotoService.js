import { API_BASE } from '../composants/config/apiconfig';
import imgprofilDefault from '../assets/photoDoc.png';

class UserPhotoService {

    static getUserPhotoUrl(userId, photoProfil = null) {
        if (!userId) {
            return imgprofilDefault;
        }

        // Si l'utilisateur a une photo de profil, utiliser l'API
        if (photoProfil) {
            return `${API_BASE}/utilisateurs/${userId}/photo`;
        }

        // Sinon, retourner l'image par défaut
        return imgprofilDefault;
    }

   
    static async getUserPhotoBlob(userId, photoProfil = null) {
        if (!userId) {
            return imgprofilDefault;
        }

        // Si pas de photo de profil, retourner l'image par défaut
        if (!photoProfil) {
            return imgprofilDefault;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return imgprofilDefault;
            }

            const response = await fetch(`${API_BASE}/utilisateurs/${userId}/photo`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.ok) {
                const blob = await response.blob();
                return URL.createObjectURL(blob);
            } else {
                return imgprofilDefault;
            }
        } catch (error) {
            console.warn(`Impossible de récupérer la photo pour l'utilisateur ${userId}:`, error);
            return imgprofilDefault;
        }
    }


    static async getUserPhotoWithFallback(userId, photoProfil = null) {
        if (!userId) {
            return imgprofilDefault;
        }

        // Si pas de photo de profil, retourner l'image par défaut
        if (!photoProfil) {
            return imgprofilDefault;
        }

        try {
            // Vérifier si la photo existe en faisant une requête HEAD
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/utilisateurs/${userId}/photo`, {
                method: 'HEAD',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.ok) {
                return `${API_BASE}/utilisateurs/${userId}/photo`;
            } else {
                return imgprofilDefault;
            }
        } catch (error) {
            console.warn(`Impossible de récupérer la photo pour l'utilisateur ${userId}:`, error);
            return imgprofilDefault;
        }
    }


    static async getUsersPhotos(users) {
        if (!Array.isArray(users)) {
            return users;
        }

        return users.map(user => ({
            ...user,
            photoUrl: this.getUserPhotoUrl(user.id, user.photoProfil)
        }));
    }


    static handleImageError(event, fallbackSrc = imgprofilDefault) {
        event.target.src = fallbackSrc;
        event.target.onerror = null; // Éviter les boucles infinies
    }

 
    static revokeBlobUrl(blobUrl) {
        if (blobUrl && blobUrl.startsWith('blob:')) {
            URL.revokeObjectURL(blobUrl);
        }
    }

 
    static revokeBlobUrls(blobUrls) {
        if (Array.isArray(blobUrls)) {
            blobUrls.forEach(url => this.revokeBlobUrl(url));
        }
    }
}

export default UserPhotoService;
