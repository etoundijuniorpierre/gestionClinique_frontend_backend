// src/components/pdf/ReceiptPDF.jsx
import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Image,
  Font
} from "@react-pdf/renderer";

// Enregistrer une police moderne si disponible
// Font.register({ family: 'Inter', src: '/fonts/Inter-Regular.ttf' });

const styles = StyleSheet.create({
  page: { 
    padding: 25, 
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    fontSize: 10
  },
  container: { 
    flex: 1,
    backgroundColor: "#ffffff",
    border: "2px solid #1e40af",
    borderRadius: 8,
    padding: 20
  },
  
  // Header moderne avec logo bien positionné
  header: { 
    backgroundColor: "#f8fafc",
    padding: 15,
    borderBottom: "2px solid #1e40af",
    marginBottom: 15,
    borderRadius: 8,
    position: "relative",
    overflow: "hidden",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  headerBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
    opacity: 0.05
  },
  headermessage: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    zIndex: 2
  },
  logoSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    gap: 120,
    marginBottom: 20
  },
  logo: { 
    width: 200, 
    height: "auto", 
    // borderRadius: 8,
    // border: "2px solid #1e40af"
  },
  clinicInfo: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  clinicDetails: {
    fontSize: 9,
    color: "#64748b",
    lineHeight: 1.3,
    marginBottom: 2
  },
  factureInfo: {
    alignItems: "center",
    textAlign: "center",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  factureTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 1
  },
  factureNumber: {
    fontSize: 12,
    color: "#ffffff",
    backgroundColor: "#1e40af",
    padding: "5px 10px",
    borderRadius: 5,
    marginBottom: 5,
    fontWeight: "bold"
  },
  factureDate: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "medium"
  },
  
  // Section patient avec design amélioré
  patientSection: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)"
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
    borderBottom: "1px solid #1e40af",
    paddingBottom: 4
  },
  patientGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  patientItem: {
    width: "100%",
    marginBottom: 8
  },
  patientLabel: {
    fontSize: 9,
    color: "#64748b",
    fontWeight: "medium",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  patientValue: {
    fontSize: 10,
    color: "#1e293b",
    fontWeight: "bold",
    padding: "4px 8px",
    backgroundColor: "#f8fafc",
    borderRadius: 3,
    border: "1px solid #e2e8f0"
  },
  
  // Section services avec design moderne
  servicesSection: {
    marginBottom: 15
  },
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#1e40af",
    borderRadius: 5,
    marginBottom: 10
  },
  serviceHeaderText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#ffffff",
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  serviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#ffffff",
    borderRadius: 5,
    marginBottom: 6,
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
  },
  serviceName: {
    fontSize: 10,
    color: "#1e293b",
    fontWeight: "medium",
    flex: 1
  },
  serviceAmount: {
    fontSize: 11,
    color: "#1e40af",
    fontWeight: "bold"
  },
  
  // Section paiement avec design professionnel
  paymentSection: {
    backgroundColor: "#f0f9ff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    border: "1px solid #bae6fd"
  },
  paymentGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12
  },
  paymentItem: {
    width: "48%"
  },
  paymentLabel: {
    fontSize: 11,
    color: "#0369a1",
    fontWeight: "medium",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  paymentValue: {
    fontSize: 13,
    color: "#1e293b",
    fontWeight: "bold",
    padding: "4px 8px",
    backgroundColor: "#ffffff",
    borderRadius: 3,
    border: "1px solid #bae6fd"
  },
  totalSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTop: "1px solid #bae6fd",
    marginTop: 12
  },
  totalLabel: {
    fontSize: 13,
    color: "#1e40af",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1
  },
  totalAmount: {
    fontSize: 16,
    color: "red",
    fontWeight: "bold",
    padding: "6px 12px",
    backgroundColor: "#ffffff",
    borderRadius: 4,
    border: "1px solid #1e40af"
  },

  dateHeure: {
    display: "flex",
    textAlign: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 10,
    color: "#64748b",
    lineHeight: 1.4,
    marginTop: 20,
    marginBottom: -30,
  },
  
  // Footer professionnel avec informations complètes
  footer: {
    marginTop: 30,
    paddingTop: 15,
    borderTop: "1px solid #e2e8f0",
    textAlign: "center"
  },

  footerText: {
    fontSize: 8,
    color: "#64748b",
    lineHeight: 1.4,
    marginBottom: 10
  },
  footerContact: {
    fontSize: 9,
    color: "#1e40af",
    fontWeight: "medium",
    marginBottom: 5
  },
  footerInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
    borderTop: "1px solid #e2e8f0"
  },
  footerInfoItem: {
    width: "30%",
    textAlign: "center"
  },
  footerInfoTitle: {
    fontSize: 8,
    color: "#64748b",
    fontWeight: "medium",
    marginBottom: 2
  },
  footerInfoValue: {
    fontSize: 9,
    color: "#1e293b",
    fontWeight: "bold"
  },
  
  // Éléments décoratifs
  badge: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    padding: "3px 6px",
    borderRadius: 3,
    fontSize: 8,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  divider: {
    height: 1,
    backgroundColor: "#1e40af",
    marginVertical: 10,
    borderRadius: 1
  }
});

export default function ReceiptPDF({
  patientName,
  amount,
  date,
  paymentMethod,
  serviceMedicalName,
  factureId,
  logo
}) {
  // Fonction pour récupérer la date actuelle
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Fonction pour récupérer l'heure actuelle
  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Formater la date
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Formater l'heure
  const formatTime = (dateStr) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Formater le montant
  const formatAmount = (amount) => {
    if (!amount) return "0,00 XAF";
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `${num.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} XAF`;
  };

  // Traduire le mode de paiement
  const translatePaymentMethod = (method) => {
    const methods = {
      'ESPECES': 'Espèces',
      'CARTE_BANCAIRE': 'Carte Bancaire',
      'VIREMENT': 'Virement',
      'CHEQUE': 'Chèque',
      'MOBILE_MONEY': 'Mobile Money'
    };
    return methods[method] || method;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* Header moderne avec logo bien positionné */}
          <View style={styles.header}>
            <View style={styles.headerBackground} />
            <View style={styles.headerContent}>
              <View style={styles.logoSection}>
                {logo && <Image style={styles.logo} src={logo} />}
                <View style={styles.clinicInfo}>
                  <Text style={styles.clinicDetails}>
                    123 Avenue de la Santé, Douala{'\n'}
                    Cameroun • Tél: +237 677 850 000{'\n'}
                    Email: admin@gmail.com
                  </Text>
                </View>
          </View>

              <View style={styles.factureInfo}>
                <Text style={styles.factureTitle}>FACTURE</Text>
                <Text style={styles.factureNumber}>
                  N° {factureId ? factureId.toString().padStart(6, '0') : '000000'}
                </Text>
                <Text style={styles.factureDate}>
                  {formatDate(date)}
                </Text>
              </View>
            </View>
            </View>

          {/* Informations patient avec design amélioré */}
          <View style={styles.patientSection}>
            <Text style={styles.sectionTitle}>Informations Patient</Text>
            <View style={styles.patientGrid}>
              <View style={styles.patientItem}>
                <Text style={styles.patientLabel}>Nom et Prénom</Text>
                <Text style={styles.patientValue}>{patientName || "—"}</Text>
              </View>
            </View>
          </View>

          {/* Services médicaux avec design moderne */}
          <View style={styles.servicesSection}>
            <View style={styles.serviceHeader}>
              <Text style={styles.serviceHeaderText}>Services Médicaux</Text>
              <Text style={styles.serviceHeaderText}>Montant</Text>
            </View>
            <View style={styles.serviceItem}>
              <Text style={styles.serviceName}>{serviceMedicalName || "Consultation médicale générale"}</Text>
              <Text style={styles.serviceAmount}>{amount}</Text>
            </View>
          </View>

          {/* Section paiement avec design professionnel */}
          <View style={styles.paymentSection}>
            <Text style={styles.sectionTitle}>Détails du Paiement</Text>
            <View style={styles.paymentGrid}>
              <View style={styles.paymentItem}>
                <Text style={styles.paymentLabel}>Mode de paiement</Text>
                <Text style={styles.paymentValue}>{translatePaymentMethod(paymentMethod)}</Text>
              </View>
              <View style={styles.paymentItem}>
                <Text style={styles.paymentLabel}>Statut du paiement</Text>
                <Text style={[styles.badge, { marginTop: 4 }]}>
                  PAYÉ
                </Text>
              </View>
            </View>
            <View style={styles.totalSection}>
              <Text style={styles.totalLabel}>Total à Payer</Text>
              <Text style={styles.totalAmount}>{amount}</Text>
            </View>
            </View>

          <View style={styles.dateHeure}>
            <Text >
              date émission : {formatDate(getCurrentDate())}
            </Text> 
            <Text >
              heure émission : {formatTime(getCurrentTime())}
            </Text>
          </View>
          {/* Footer professionnel avec informations complètes */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Merci de votre confiance. Cette facture est un document officiel.{'\n'}
              Pour toute question concernant cette facture, veuillez nous contacter.
            </Text>
            <Text style={styles.footerContact}>
              admin@gmail.com • +237 677 850 000
            </Text>
            
            <View style={styles.footerInfo}>
              <View style={styles.footerInfoItem}>
                <Text style={styles.footerInfoTitle}>Horaires</Text>
                <Text style={styles.footerInfoValue}>7j/7, 7h-20h</Text>
              </View>
              <View style={styles.footerInfoItem}>
                <Text style={styles.footerInfoTitle}>Adresse</Text>
                <Text style={styles.footerInfoValue}>Terminus Mimboman</Text>
              </View>
              <View style={styles.footerInfoItem}>
                <Text style={styles.footerInfoTitle}>Ville</Text>
                <Text style={styles.footerInfoValue}>Douala, Cameroun</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

