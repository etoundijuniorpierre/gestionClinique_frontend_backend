package com.example.GestionClinique.service.photoService;

import com.example.GestionClinique.model.entity.Utilisateur;
import com.example.GestionClinique.repository.UtilisateurRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;

@Service
public class DatabasePhotoService {

    private final UtilisateurRepository utilisateurRepository;
    private final long maxFileSize = 1048576;

    public DatabasePhotoService(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }

    public Utilisateur savePhotoProfil(Long userId, MultipartFile photoProfil) {
        if (photoProfil == null || photoProfil.isEmpty()) {
            throw new RuntimeException("Aucun fichier fourni");
        }

        if (photoProfil.getSize() > maxFileSize) {
            throw new RuntimeException("La photo ne doit pas dépasser 1MB");
        }

        String originalFilename = photoProfil.getOriginalFilename();
        if (originalFilename == null || !isValidImageExtension(originalFilename)) {
            throw new RuntimeException("Extension de fichier non autorisée. Utilisez: .jpg, .jpeg, .png, .gif");
        }

        try {
            byte[] imageBytes = photoProfil.getBytes();
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
            String mimeType = photoProfil.getContentType();
            String dataUri = "data:" + mimeType + ";base64," + base64Image;

            Utilisateur utilisateur = utilisateurRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

            utilisateur.setPhotoProfil(dataUri);
            return utilisateurRepository.save(utilisateur);

        } catch (IOException e) {
            throw new RuntimeException("Erreur lors du traitement de l'image", e);
        }
    }

    public Utilisateur deletePhotoProfil(Long userId) {
        Utilisateur utilisateur = utilisateurRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        utilisateur.setPhotoProfil(null);
        return utilisateurRepository.save(utilisateur);
    }

    public String getPhotoProfil(Long userId) {
        Utilisateur utilisateur = utilisateurRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        return utilisateur.getPhotoProfil();
    }

    private boolean isValidImageExtension(String filename) {
        String extension = filename.substring(filename.lastIndexOf(".")).toLowerCase();
        return extension.equals(".jpg") || 
               extension.equals(".jpeg") || 
               extension.equals(".png") || 
               extension.equals(".gif");
    }

    public String extractBase64FromDataUri(String dataUri) {
        if (dataUri == null || !dataUri.startsWith("data:")) {
            return dataUri;
        }
        
        int commaIndex = dataUri.indexOf(",");
        return commaIndex != -1 ? dataUri.substring(commaIndex + 1) : dataUri;
    }

    public String extractMimeTypeFromDataUri(String dataUri) {
        if (dataUri == null || !dataUri.startsWith("data:")) {
            return "image/jpeg";
        }
        
        int semicolonIndex = dataUri.indexOf(";");
        return semicolonIndex != -1 ? dataUri.substring(5, semicolonIndex) : "image/jpeg";
    }
}
