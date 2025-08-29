import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import logo from '../assets/logo.png';
const styles = StyleSheet.create({
    page: {
        padding: 15,
        fontFamily: "Helvetica",
        backgroundColor: "#ffffff",
        fontSize: 9
    },
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        border: "1px solid #1e40af",
        borderRadius: 3,
        padding: 12
    },

    // Header simplifié
    header: {
        backgroundColor: "#f8fafc",
        padding: 10,
        borderBottom: "1px solid #1e40af",
        marginBottom: 10,
        borderRadius: 3,
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center"
    },
    logoSection: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        gap: 180,
        marginBottom: 15,
        marginTop: -18
    },
    logo: {
        width: 200,
        height: "auto",

    },
    clinicDetails: {
        fontSize: 10,
        color: "#64748b",
        lineHeight: 1.1,
        marginBottom: 1,
        textAlign: "center"
    },
    prescriptionInfo: {
        alignItems: "center",
        textAlign: "center"
    },
    prescriptionTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#1e40af",
        marginBottom: 3,
        textTransform: "uppercase",
        letterSpacing: 0.3
    },
    prescriptionNumber: {
        fontSize: 12,
        color: "#ffffff",
        backgroundColor: "#1e40af",
        padding: "2px 6px",
        borderRadius: 2,
        marginBottom: 2,
        fontWeight: "bold"
    },
    prescriptionDate: {
        fontSize: 10,
        color: "#64748b"
    },

    // Section médecin simplifiée
    doctorSection: {
        backgroundColor: "#f8fafc",
        padding: 8,
        borderRadius: 3,
        marginBottom: 10,
        border: "1px solid #e2e8f0"
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: "bold",
        color: "#1e40af",
        marginBottom: 6,
        textTransform: "uppercase",
        letterSpacing: 0.3,
        borderBottom: "1px solid #1e40af",
        paddingBottom: 4
    },
    doctorInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    doctorName: {
        fontSize: 16,
        color: "#1e293b",
        fontWeight: "bold"
    },
    doctorBadge: {
        backgroundColor: "#1e40af",
        color: "#ffffff",
        padding: "2px 5px",
        borderRadius: 2,
        fontSize: 7,
        fontWeight: "bold",
        textTransform: "uppercase"
    },

    // Section patient simplifiée
    patientSection: {
        backgroundColor: "#ffffff",
        padding: 8,
        borderRadius: 3,
        marginBottom: 8,
        border: "1px solid #e2e8f0"
    },
    patientGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8
    },
    patientItem: {
        width: "48%",
        marginBottom: 5
    },
    patientLabel: {
        fontSize: 7,
        color: "#64748b",
        fontWeight: "medium",
        marginBottom: 1,
        textTransform: "uppercase",
        letterSpacing: 0.2
    },
    patientValue: {
        fontSize: 12,
        color: "#1e293b",
        fontWeight: "bold",
        padding: "3px 5px",
        backgroundColor: "#f8fafc",
        borderRadius: 2,
        border: "1px solid #e2e8f0"
    },

    // Section médicaments et instructions fusionnées
    prescriptionSection: {
        backgroundColor: "#f8fafc",
        padding: 8,
        borderRadius: 3,
        marginBottom: 8,
        border: "1px solid #e2e8f0"
    },
    medicationHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 5,
        paddingHorizontal: 6,
        backgroundColor: "#1e40af",
        borderRadius: 2,
        marginBottom: 6
    },
    medicationHeaderText: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#ffffff",
        textTransform: "uppercase",
        letterSpacing: 0.2
    },
    medicationItem: {
        backgroundColor: "#ffffff",
        padding: 6,
        borderRadius: 2,
        marginBottom: 5,
        border: "1px solid #e2e8f0"
    },
    medicationName: {
        fontSize: 12,
        color: "#1e293b",
        fontWeight: "bold",
        marginBottom: 3
    },
    medicationDetails: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 3,
        marginBottom: 5
    },
    medicationDetail: {
        fontSize: 10,
        color: "#64748b"
    },
    instructions: {
        marginTop: 6,
        paddingTop: 5,
        borderTop: "1px solid #e2e8f0"
    },
    instructionText: {
        fontSize: 10,
        color: "#1e293b",
        lineHeight: 1.2
    },

    // Section consultation simplifiée
    consultationSection: {
        backgroundColor: "#f8fafc",
        padding: 8,
        borderRadius: 3,
        marginBottom: 8,
        border: "1px solid #e2e8f0"
    },
    consultationGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8
    },
    consultationItem: {
        width: "48%",
        marginBottom: 5
    },
    consultationLabel: {
        fontSize: 10,
        color: "#1e40af",
        fontWeight: "medium",
        marginBottom: 1,
        textTransform: "uppercase"
    },
    consultationValue: {
        fontSize: 10,
        color: "#1e293b",
        fontWeight: "bold",
        padding: "2px 5px",
        backgroundColor: "#ffffff",
        borderRadius: 2,
        border: "1px solid #e2e8f0"
    },

    // Section signature simplifiée
    signatureSection: {
        backgroundColor: "#f8fafc",
        padding: 8,
        borderRadius: 3,
        marginBottom: 8,
        border: "1px solid #e2e8f0"
    },
 
    signatureText: {
        fontSize: 10,
        color: "#1e40af",
        fontWeight: "bold",
        textAlign: "center",
        paddingTop: 30,

    },

    // Date et heure d'émission simplifiées
    dateHeure: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: 10,
        color: "#64748b",
        marginTop: 12,
        paddingTop: 8,
        borderTop: "1px solid #e2e8f0"
    },

    // Footer simplifié
    footer: {
        marginTop: 12,
        paddingTop: 8,
        borderTop: "1px solid #e2e8f0",
        textAlign: "center"
    },
    footerText: {
        fontSize: 8,
        color: "#64748b",
        lineHeight: 1.2,
        marginBottom: 6
    },
    footerContact: {
        fontSize: 8,
        color: "#1e40af",
        fontWeight: "medium",
        marginBottom: 3
    },
    footerInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 3,
        paddingTop: 3,
        borderTop: "1px solid #e2e8f0"
    },
    footerInfoItem: {
        width: "30%",
        textAlign: "center"
    },
    footerInfoTitle: {
        fontSize: 9,
        color: "#64748b",
        fontWeight: "medium",
        marginBottom: 1
    },
    footerInfoValue: {
        fontSize: 9,
        color: "#1e293b",
        fontWeight: "bold"
    }
});

const PrescriptionPDF = ({ prescription }) => {
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

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.container}>
                    {/* Header simplifié avec logo */}
                    <View style={styles.header}>
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
                        <View style={styles.prescriptionInfo}>
                            <Text style={styles.prescriptionTitle}>PRESCRIPTION MÉDICALE</Text>
                            <Text style={styles.prescriptionNumber}>
                                N° {prescription.id ? prescription.id.toString().padStart(6, '0') : '000000'}
                            </Text>
                            <Text style={styles.prescriptionDate}>
                                {formatDate(prescription.creationDate) || formatDate(getCurrentDate())}
                            </Text>
                        </View>
                    </View>

                    {/* Section médecin */}
                    <View style={styles.doctorSection}>
                        <Text style={styles.sectionTitle}>Médecin Prescripteur</Text>
                        <View style={styles.doctorInfo}>
                            <Text style={styles.doctorName}>
                                {prescription.medecinNomComplet ? (prescription.medecinNomComplet.startsWith('Dr.') ? prescription.medecinNomComplet : `Dr. ${prescription.medecinNomComplet}`) : 'Dr. Médecin'}
                            </Text>
                            <Text style={styles.doctorBadge}>
                                {prescription.serviceMedical || 'Médecin'}
                            </Text>
                        </View>
                    </View>

                    {/* Section patient */}
                    <View style={styles.patientSection}>
                        <Text style={styles.sectionTitle}>Informations Patient</Text>
                        <View style={styles.patientGrid}>
                            <View style={styles.patientItem}>
                                <Text style={styles.patientLabel}>Nom et Prénom</Text>
                                <Text style={styles.patientValue}>{prescription.patientNomComplet || "—"}</Text>
                            </View>
                            <View style={styles.patientItem}>
                                <Text style={styles.patientLabel}>Type de Prescription</Text>
                                <Text style={styles.patientValue}>{prescription.typePrescription || "—"}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Section médicaments et instructions fusionnées */}
                    <View style={styles.prescriptionSection}>
                        <Text style={styles.sectionTitle}>Médicaments et Instructions</Text>
                        <View style={styles.medicationHeader}>
                            <Text style={styles.medicationHeaderText}>Médicament</Text>
                            <Text style={styles.medicationHeaderText}>Détails</Text>
                        </View>
                        <View style={styles.medicationItem}>
                            <Text style={styles.medicationName}>
                                {prescription.medicaments || "Aucun médicament prescrit"}
                            </Text>
                            <View style={styles.medicationDetails}>
                                <Text style={styles.medicationDetail}>
                                    Quantité: {prescription.quantite || "—"}
                                </Text>
                                <Text style={styles.medicationDetail}>
                                    Durée: {prescription.dureePrescription || "—"}
                                </Text>
                            </View>
                            <View style={styles.instructions}>
                                <Text style={styles.instructionText}>
                                    <Text style={{ fontWeight: 'bold' }}>Instructions : </Text>
                                    {prescription.instructions || "Aucune instruction spécifique"}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Section consultation (si disponible) */}
                    {prescription.consultationDescription && (
                        <View style={styles.consultationSection}>
                            <Text style={styles.sectionTitle}>Notes de Consultation</Text>
                            <View style={styles.consultationGrid}>
                                <View style={styles.consultationItem}>
                                    <Text style={styles.consultationLabel}>Motifs</Text>
                                    <Text style={styles.consultationValue}>
                                        {prescription.consultationDescription || "—"}
                                    </Text>
                                </View>
                                <View style={styles.consultationItem}>
                                    <Text style={styles.consultationLabel}>Date Consultation</Text>
                                    <Text style={styles.consultationValue}>
                                        {formatDate(prescription.creationDate) || formatDate(getCurrentDate())}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* Section signature */}
                    <View style={styles.signatureSection}>
                        <Text style={styles.sectionTitle}>Validation Médicale</Text>
                        <Text style={styles.signatureText}>
                            Signature et Cachet du Médecin
                        </Text>
                    </View>

                    {/* Date et heure d'émission */}
                    <View style={styles.dateHeure}>
                        <Text>
                            Date d'émission : {formatDate(getCurrentDate())}
                        </Text>
                        <Text>
                            Heure d'émission : {getCurrentTime()}
                        </Text>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            Cette prescription est un document médical officiel.{'\n'}
                            Veuillez la conserver précieusement et respecter scrupuleusement les instructions.{'\n'}
                            Pour toute question, consultez votre médecin.
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
};

export default PrescriptionPDF;
