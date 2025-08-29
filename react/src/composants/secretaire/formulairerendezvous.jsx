import React, { useState, useEffect } from 'react';
import { API_BASE } from '../../composants/config/apiconfig'
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../config/axiosConfig';
import Styled from 'styled-components';
import fondImage from '../../assets/backgroundimageuserform.jpg';
import Barrehorizontal1 from '../../composants/barrehorizontal1';
import imgprofil from '../../assets/photoDoc.png'
import FormulaireFacture from './formulairefacture';
import '../../styles/add-buttons.css'
import { ConfirmationModal } from '../shared/UnifiedModal';
import { InfoModal } from '../shared/UnifiedModal';


const SousDiv1Style = Styled.div`
 width: 99%;

`
const Span2 = Styled.span`
    display: ${props => props.$Spandisplay2};
`
const Span1 = Styled.span`
    cursor: pointer;
`
const Span3 = Styled.span`
    display: ${props => props.$Spandisplay3};
`
const Afficheformulaireadd = Styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`
const FormContainer = Styled.div`

  position: relative;
  overflow: hidden;
  background: #fff;
  padding: 30px;
  border-radius: 16px;
  font-family: sans-serif;
  border: 1px solid rgba(217, 217, 217, 1);
  
  &::before {
    message: '';
    position: absolute;
    inset: 0;
    background-image: url(${fondImage});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0.1; /* ⬅️ Réduit l’opacité de l’image seulement */
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }
`;

const Title = Styled.h2`
  margin-bottom: -15px;
  font-size: 24px;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
  padding-bottom: 10px;
  font-family: Roboto;
`;

const TraitHorizontal = Styled.div`
  width: 718px;
  height: 5px;
  angle: 0 deg;
  opacity: 1;
  border-radius: 2.5px;
  background-color: rgba(159, 159, 255, 1);
  margin-bottom: 20px;
`

const FormRow = Styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
`;

const FormGroup = Styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;
const FormGroupvisible = Styled.div`
  flex: 1;
  display: ${props => props.$formgroupdisplay || "flex"};
  flex-direction: column;
`;
const Form = Styled.form`

  margin: 0;
  padding-left:0;
  width: 766px;
`
const Label = Styled.label`
  font-size: 14px;
  margin-bottom: 5px;
  color: #333333;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
`;

const Input = Styled.input`
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  width: 351px;
  color: #333333;
  background-color: #ffffff;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  
  &:focus{
    border: 1px solid #667eea;
    outline: none;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const Select = Styled.select`
  min-width: 351px;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background-color: #ffffff;
  color: #333333;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  
  &:focus {
    border: 1px solid #667eea;
    outline: none;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;
const TextArea = Styled.textarea`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  background-color: #ffffff;
  color: #333333;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  resize: vertical;
  
  &:focus {
    border: 1px solid #667eea;
    outline: none;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;
const ButtonRow = Styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 20px;
  margin: 25px;
`;

// Button styling is now handled by add-buttons.css

const Overlay = Styled.div`
  display: ${props => props.$Overlaydisplay};
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.8);
  z-index: 998;
`
const Popupsuppr = Styled.div`

    display: ${props => props.$Popupsupprdisplay};
    position: fixed;
    top: 20%;
    left: 40%;
    z-index: 10000;
   
`
const FormulaireRendezVous = () => {

  const idUser = localStorage.getItem('id');
  const { nompatient } = useParams();
  const [nomprofil, setnomprofil] = useState('')
  const [idfacture, setidfacture] = useState(0)
  const [Popup, setPopup] = useState(false)
  const [validationPopup, setValidationPopup] = useState(false)
  const [validationMessage, setValidationMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const [patient, setpatient] = useState(null);
  //const [nommedecin, setnommedecin] = useState('mabou')
  const [medecinsdisponible, setmedecindisponible] = useState([])
  //const [medecinid, setmedecinid] = useState(null)
  const [erreur, setErreur] = useState(null);
  const [isloading, setisloading] = useState(true);

  // Fonction pour obtenir la date du jour au format YYYY-MM-DD
  const getCurrentDate = () => {
    const now = new Date();
    const hours = now.getHours();

    // Si l'heure actuelle est entre 20h01 et 23h59, retourner la date du lendemain
    if (hours >= 20) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const year = tomorrow.getFullYear();
      const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const day = String(tomorrow.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    // Sinon retourner la date d'aujourd'hui (pour 0h00 à 19h59)
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Fonction pour obtenir l'heure actuelle au format HH:MM
  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');

    // Si l'heure actuelle est entre 20h01 et 6h59, retourner 7h00
    if (hours >= 20 || hours < 7) {
      return `07:00`;
    }

    // Sinon retourner l'heure actuelle
    const hoursStr = String(hours).padStart(2, '0');
    return `${hoursStr}:${minutes}`;
  };

  // Fonction pour valider l'heure (entre 7h00 et 20h00)
  const validateTime = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    const minMinutes = 7 * 60; // 7h00
    const maxMinutes = 20 * 60; // 20h00
    return totalMinutes >= minMinutes && totalMinutes <= maxMinutes;
  };

  // Fonction pour valider la date (pas de date antérieure à aujourd'hui)
  const validateDate = (date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const nompatient = async () => {
      try {
        const response = await axiosInstance.get(`/utilisateurs/${idUser}`);

        if (response) {
          setnomprofil(response.data.nom)
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des patients:', error);

      } finally {
        console.log('fin')
      }
    }
    nompatient()
  }, [idUser]);


  const [formData, setFormData] = useState({
    patientId: "",
    heure: getCurrentTime(),
    jour: getCurrentDate(),
    note: "",
    serviceMedical: "MEDECINE_GENERALE",
    medecinId: "",
  });



  useEffect(() => {

    const fetchpatients = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axiosInstance.get(`/patients/nom/${nompatient}`);

        const patientTrouve = response.data[0];

        if (patientTrouve) {
          setpatient(patientTrouve);
          setFormData((prev) => ({
            ...prev,
            patientId: patientTrouve.id,
          }));
        } else {
          setErreur('Aucun patient trouvé');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des patients:', error);
        setErreur('Erreur lors du chargement');
      } finally {
        setisloading(false);
      }

    };
    fetchpatients();
  }, [nompatient]);


  useEffect(() => {
    const fetchmedecins = async () => {
      // Ne récupérer les médecins que si on a une date, heure et service médical
      if (!formData.jour || !formData.heure || !formData.serviceMedical) {
        setmedecindisponible([]);
        return;
      }

      const token = localStorage.getItem('token');
      try {
        const response = await axiosInstance.get(`/utilisateurs/available/${formData.serviceMedical}?jour=${formData.jour}&heure=${formData.heure}`);
        const medecins = response.data;
        setmedecindisponible(medecins);
        
        // Notification du nombre de médecins disponibles
        if (window.showNotification) {
          if (medecins.length > 0) {
            window.showNotification(`${medecins.length} médecin(s) disponible(s) pour ce créneau`, "success");
          } else {
            window.showNotification("Aucun médecin disponible pour ce créneau", "warning");
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des médecins disponibles:', error);
        setmedecindisponible([]);
        if (window.showNotification) {
          window.showNotification("Erreur lors de la récupération des médecins disponibles", "error");
        }
      } finally {
        setisloading(false);
      }
    };
    fetchmedecins();
  }, [formData.jour, formData.heure, formData.serviceMedical]);





  const handleChange = e => {
    const { name, value } = e.target;

    // Mettre à jour le formulaire sans validation bloquante
    setFormData(prev => ({ ...prev, [name]: value }));

    // Réinitialiser les erreurs pour ce champ
    setFieldErrors(prev => ({ ...prev, [name]: false }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    if (name === 'jour' && value) {
      if (!validateDate(value)) {
        setFieldErrors(prev => ({ ...prev, [name]: 'La date ne peut pas être antérieure à aujourd\'hui' }));
        if (window.showNotification) {
          window.showNotification("Date invalide : la date ne peut pas être antérieure à aujourd'hui", "error");
        }
      }
    }
    
    if (name === 'heure' && value) {
      if (!validateTime(value)) {
        setFieldErrors(prev => ({ ...prev, [name]: 'L\'heure doit être entre 7h00 et 20h00' }));
        if (window.showNotification) {
          window.showNotification("Heure invalide : l'heure doit être entre 7h00 et 20h00", "error");
        }
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    let hasErrors = false;

    // Validation de la date
    if (!validateDate(formData.jour)) {
      errors.jour = true;
      hasErrors = true;
    }

    // Validation de l'heure
    if (!validateTime(formData.heure)) {
      errors.heure = true;
      hasErrors = true;
    }

    // Validation obligatoire du médecin
    if (!formData.medecinId || formData.medecinId === "") {
      errors.medecinId = true;
      hasErrors = true;
    }

    setFieldErrors(errors);

    if (hasErrors) {
      let errorMessage = 'Veuillez corriger les erreurs dans le formulaire :\n';
      if (errors.jour) errorMessage += '- La date ne peut pas être antérieure à aujourd\'hui\n';
      if (errors.heure) errorMessage += '- L\'heure doit être comprise entre 7h00 et 20h00\n';
      if (errors.medecinId) errorMessage += '- Vous devez sélectionner un médecin';
      
      setValidationMessage(errorMessage);
      setValidationPopup(true);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérifier que la date et l'heure sélectionnées ne sont pas dans le passé
    const selectedDateTime = new Date(`${formData.jour}T${formData.heure}`);
    const now = new Date();
    if (selectedDateTime <= now) {
      setFieldErrors(prev => ({ 
        ...prev, 
        jour: 'la date ne peut pas être inférieur à aujourd\'hui', 
        heure: 'l\'heure ne peut pas être inférieur à l\'heure actuelle' 
      }));
      if (window.showNotification) {
        window.showNotification("La date et l'heure sélectionnées ne peuvent pas être dans le passé", "error");
      }
      return;
    }

    // Valider le formulaire avant soumission
    if (!validateForm()) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await axiosInstance.post(`/rendezvous/createRendezVous`, formData);
             console.log(response.data);
       setidfacture(response.data.factureId)
       setPopup(true)
       
       if (window.showNotification) {
         window.showNotification("Rendez-vous créé avec succès !", "success");
       }
    } catch (error) {
      console.error('Erreur de connexion :', error);
      console.log(token)
      
      // Afficher un message d'erreur à l'utilisateur
      if (window.showNotification) {
        window.showNotification("Erreur lors de la création du rendez-vous. Veuillez réessayer.", "error");
      }
    } finally {
      /*setFormData({
           nom: "",
           prenom: "",
           email: "",
           dateNaissance: "",
           telephone: "",
           adresse: "",
           genre: "m",
           password: "",
           serviceMedicalName: "",
           actif: true,
           role: ""
         });*/
    };
    console.log(formData)
  };
  let navigate = useNavigate();

  const handleClick = () => {
    if (window.showNotification) {
      window.showNotification("Retour à la liste des patients", "info");
    }
    navigate("/secretaire/patient");
  };

  const handleAnnuler = () => {
    if (window.showNotification) {
      window.showNotification("Annulation de la création du rendez-vous", "info");
    }
    navigate("/secretaire/patient");
  };

  if (!patient) {
    return <p style={{ textAlign: 'center' }}>Chargement...</p>;
  }
  if (isloading) return <p>Chargement...</p>;

  if (erreur) return <p style={{ color: 'red' }}>{erreur}</p>;
  return (
    <>
      <Overlay onClick={() => setPopup(false)} $Overlaydisplay={Popup ? 'block' : 'none'} />
      <Popupsuppr $Popupsupprdisplay={Popup ? 'block' : 'none'}>
        <FormulaireFacture id={idfacture} onClick1={() => setPopup(false)} />
      </Popupsuppr>

      {/* Modal de validation */}
      <InfoModal
          isOpen={validationPopup}
          onClose={() => setValidationPopup(false)}
          title="Erreurs de validation"
          message={validationMessage}
          buttonText="OK"
      />

      <SousDiv1Style>
        <Barrehorizontal1 titrepage="Gestion des patients" imgprofil1={imgprofil} nomprofil={nomprofil}>
          <Span1 onClick={handleClick}>Liste des patients</Span1>
          <Span2 > {">"} Creer un rendez-vous </Span2>
        </Barrehorizontal1>
      </SousDiv1Style>
      <Afficheformulaireadd>
        <Form onSubmit={handleSubmit}>
          <FormContainer>
            <Title>Info du patient</Title>
            <TraitHorizontal></TraitHorizontal>
            <FormRow>
              <FormGroup>
                <Label htmlFor="nom">Nom</Label>
                <Input id="nom" name="nom" value={patient.nom} readOnly />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="prenom">Prénom</Label>
                <Input id="prenom" name="prenom" value={patient.prenom} readOnly />
              </FormGroup>
            </FormRow>

            <FormRow>
              
              <FormGroup>
                <Label htmlFor="dateNaissance">Date de naissance</Label>
                <Input id="dateNaissance" name="dateNaissance" type="date" value={patient.dateNaissance} readOnly />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="age">Age</Label>
                <Input id="age" name="age" value={patient.age + " ans"} readOnly>
                </Input>
              </FormGroup>
            </FormRow>

            <FormRow>
            <FormGroup>
                <Label htmlFor="genre">Genre</Label>
                <Input id="genre" name="genre" value={patient.genre} readOnly>
                </Input>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="adresse">Adresse</Label>
                <Input id="adresse" name="adresse" value={patient.adresse} readOnly />
              </FormGroup>
              
            </FormRow>

            
            <FormRow>
            <FormGroup>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={patient.email} readOnly />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="telephone">telephone</Label>
                <Input id="telephone" name="telephone" value={patient.telephone} readOnly />
              </FormGroup>
            </FormRow>

            <Title>Info du rendez-vous</Title>
            <TraitHorizontal></TraitHorizontal>
            <FormRow>
              <FormGroup>
                <Label htmlFor="jour">Date</Label>
                                 <Input
                   id="jour"
                   name="jour"
                   type='date'
                   value={formData.jour}
                   onChange={handleChange}
                   onBlur={handleBlur}
                   min={new Date().toISOString().split('T')[0]}
                   style={{
                     borderColor: fieldErrors.jour ? '#e74c3c' : '#d1d5db',
                     backgroundColor: fieldErrors.jour ? '#fdf2f2' : '#ffffff'
                   }}
                 />
                 {fieldErrors.jour && <span style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px' }}>{fieldErrors.jour}</span>}
                 <span style={{ color: '#3498db', fontSize: '12px', marginTop: '4px', fontStyle: 'italic' }}>Date minimale : aujourd'hui</span>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="heure">Heure</Label>
                                 <Input
                   id="heure"
                   name="heure"
                   type="time"
                   value={formData.heure}
                   onChange={handleChange}
                   onBlur={handleBlur}
                   step={1}
                   min="07:00"
                   max="20:00"
                   style={{
                     borderColor: fieldErrors.heure ? '#e74c3c' : '#d1d5db',
                     backgroundColor: fieldErrors.heure ? '#fdf2f2' : '#ffffff'
                   }}
                 />
                 {fieldErrors.heure && <span style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px' }}>{fieldErrors.heure}</span>}
                 <span style={{ color: '#3498db', fontSize: '12px', marginTop: '4px', fontStyle: 'italic' }}>Heures autorisées : de 7h00 à 20h00</span>
              </FormGroup>
            </FormRow>

            <FormRow>

              <FormGroupvisible >
              <Label htmlFor="serviceMedical">Service médical *</Label>
                <Select id="servicemedical" name="serviceMedical" value={formData.serviceMedical} onChange={handleChange} >
                  <option value="">Sélectionner un service</option>
                  <option value="MEDECINE_GENERALE">Médecine Générale</option>
                  <option value="CARDIOLOGIE">Cardiologie</option>
                  <option value="PEDIATRIE">Pédiatrie</option>
                  <option value="GYNECOLOGIE">Gynécologie</option>
                  <option value="CARDIOLOGIE">Cardiologie</option>
                  <option value="DERMATOLOGIE">Dermatologie</option>
                  <option value="OPHTALMOLOGIE">Ophtalmologie</option>
                  <option value="ORTHOPEDIE">Orthopédie</option>
                  <option value="RADIOLOGIE">Radiologie</option>
                  <option value="LABORATOIRE_ANALYSES">Laboratoire d'Analyses</option>
                  {/* <option value="URGENCES">Urgences</option> */}
                  <option value="KINESITHERAPIE">Kinésithérapie</option>
                  <option value="DENTISTE">Dentiste</option>
                  <option value="PSYCHIATRIE">Psychiatrie</option>
                  <option value="NEUROLOGIE">Neurologie</option>
                  <option value="GASTRO_ENTEROLOGIE">Gastro-entérologie</option>
                  <option value="PNEUMOLOGIE">Pneumologie</option>
                  <option value="ENDOCRINOLOGIE">Endocrinologie</option>
                  <option value="RHUMATOLOGIE">Rhumatologie</option>

                </Select>
              </FormGroupvisible>
              <FormGroup>
                <Label htmlFor="medecin">Medecin</Label>
                <Select 
                  id="medecin" 
                  name="medecinId" 
                  value={formData.medecinId} 
                  onChange={handleChange}
                  disabled={!formData.jour || !formData.heure || !formData.serviceMedical}
                  style={{
                    borderColor: fieldErrors.medecinId ? '#e74c3c' : '#d1d5db',
                    backgroundColor: fieldErrors.medecinId ? '#fdf2f2' : '#ffffff'
                  }}
                >
                  <option value="">
                    {!formData.jour || !formData.heure || !formData.serviceMedical 
                      ? 'Sélectionnez d\'abord la date, heure et service' 
                      : 'Sélectionnez un médecin'}
                  </option>
                  {medecinsdisponible.map((medecin) => (<option key={medecin.id} value={parseInt(medecin.id)}>{medecin.nom} {medecin.prenom}</option>))}
                </Select>
                {!fieldErrors.medecinId && medecinsdisponible.length > 0 && (
                  <span style={{ color: '#3498db', fontSize: '12px', marginTop: '4px', fontStyle: 'italic' }}>
                    {medecinsdisponible.length} médecin(s) disponible(s) pour ce créneau
                  </span>
                )}
                {!fieldErrors.medecinId && medecinsdisponible.length === 0 && formData.jour && formData.heure && formData.serviceMedical && (
                  <span style={{ color: '#e67e22', fontSize: '12px', marginTop: '4px', fontStyle: 'italic' }}>
                    Aucun médecin disponible pour ce créneau
                  </span>
                )}
              </FormGroup>
            </FormRow>
            <FormRow>
              <FormGroup>
                <Label htmlFor="note">Note</Label>
                <TextArea id='note' name="note" value={formData.note} onChange={handleChange} />
              </FormGroup>
            </FormRow>
          </FormContainer>
          <ButtonRow>
            <button type="button" className="cancel-button" onClick={handleAnnuler}>
              Annuler
            </button>
            <button type="submit" className="submit-button">
              Créer un rendez-vous
            </button>
          </ButtonRow>
        </Form>
      </Afficheformulaireadd>
    </>
  );
};

export default FormulaireRendezVous;
