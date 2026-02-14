import { API_BASE } from '../composants/config/apiconfig';
import imgprofilDefault from '../assets/photoDoc.png';

class UserPhotoService {

    static getUserPhotoUrl(userId, photoProfil = null) {
        if (!userId) {
            return imgprofilDefault;
        }

        if (photoProfil) {
            return photoProfil;
        }

        return imgprofilDefault;
    }

    static async getUserPhoto(userId, photoProfil = null) {
        if (!userId) {
            return imgprofilDefault;
        }

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
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const dataUri = await response.text();
                return dataUri;
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

        if (!photoProfil) {
            return imgprofilDefault;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/utilisateurs/${userId}/photo`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const dataUri = await response.text();
                return dataUri;
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
        event.target.onerror = null;
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
