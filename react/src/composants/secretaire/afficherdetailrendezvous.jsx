import React, { useEffect, useState } from 'react';
import { API_BASE } from '../config/apiconfig';
import axiosInstance from '../config/axiosConfig';
import Styled from 'styled-components';
import fondImage from '../../assets/backgroundimageuserform.jpg';
import { useParams, useNavigate } from 'react-router-dom';
import Barrehorizontal1 from '../barrehorizontal1';
import imgprofil from '../../assets/photoDoc.png';

const SousDiv1Style = Styled.div`
  width: 99%;
  padding-left: 1%;
`;

const Span2 = Styled.span``;

const Span1 = Styled.span`
  cursor: pointer;
`;

const Affichedetailuser = Styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

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
    opacity: 0.1;
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }
`;

const Title = Styled.div`
  display: flex;
  justify-content: space-between;
`;

const Title1 = Styled.h2`
  margin-bottom: 0px;
  font-size: 24px;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
  padding-bottom: 10px;
  font-family: Roboto;
`;

const Title2 = Styled.h2`
  margin-bottom: 0px;
  font-size: 24px;
  font-weight: 400;
  color: rgba(159, 159, 255, 1);
  padding-bottom: 10px;
  font-family: Roboto;
  cursor: pointer;
`;

const TraitHorizontal = Styled.div`
  width: 718px;
  height: 5px;
  angle: 0 deg;
  opacity: 1;
  border-radius: 2.5px;
  background-color: rgba(159, 159, 255, 1);
  margin-bottom: 20px;
`;

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

const Form = Styled.form`
  margin: 0;
  padding-left: 0;
  width: 766px;
`;

const Label = Styled.label`
  font-size: 14px;
  margin-bottom: 5px;
  color: rgba(51, 51, 51, 1);
`;

const Input = Styled.input`
  padding: 10px;
  border: 1px solid rgba(217, 217, 217, 1);
  border-radius: 8px;
  width: 351px;
  color: rgba(30, 30, 30, 1);
  &:focus {
    border: 1px solid rgba(217, 217, 217, 1);
  }
`;

const TextArea = Styled.textarea`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  resize: vertical;
  min-width: 351px;
  min-height: 80px;
`;

const AfficherDetailRendezVous = () => {
  const idUser = localStorage.getItem('id');
  const [nomprofil, setnomprofil] = useState('');
  const { id } = useParams();
  const [rendezvous, setRendezvous] = useState(null);
  const [erreur, setErreur] = useState(null);
  const [isloading, setisloading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const nomutilisateur = async () => {
      try {
        const response = await axiosInstance.get(`/utilisateurs/${idUser}`);
        if (response) {
          setnomprofil(response.data.nom);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      }
    };
    nomutilisateur();
  }, [idUser]);

  useEffect(() => {
    const fetchRendezvous = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axiosInstance.get(`/rendezvous/${id}`);
        setRendezvous(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération du rendez-vous:', error);
        setErreur('Erreur lors du chargement');
      } finally {
        setisloading(false);
      }
    };
    fetchRendezvous();
  }, [id]);

  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/secretaire/rendezvous');
  };

  const handleEditClick = (rendezvous) => {
    navigate(`/secretaire/rendezvous/edit/${rendezvous.id}`);
  };

  if (!rendezvous) {
    return <p style={{ textAlign: 'center' }}>Chargement...</p>;
  }
  
  if (isloading) return <p>Chargement...</p>;
  
  if (erreur) return <p style={{ color: 'red' }}>{erreur}</p>;

  return (
    <>
      <SousDiv1Style>
        <Barrehorizontal1 titrepage="Gestion des rendez-vous" imgprofil1={imgprofil} nomprofil={nomprofil}>
          <Span1 onClick={handleClick}>Liste des rendez-vous</Span1>
          <Span2> {">"} Détail du rendez-vous</Span2>
        </Barrehorizontal1>
      </SousDiv1Style>
      
      <Affichedetailuser>
        <Form>
          <FormContainer>
            <Title>
              <Title1>Détail du rendez-vous</Title1>
              <Title2 onClick={() => handleEditClick(rendezvous)}>Modifier</Title2>
            </Title>
            
            <TraitHorizontal></TraitHorizontal>
            
            <FormRow>
              <FormGroup>
                <Label htmlFor="patient">Patient</Label>
                <Input 
                  id="patient" 
                  name="patient" 
                  value={rendezvous.patientNomComplet || 'Non assigné'} 
                  readOnly 
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="medecin">Médecin</Label>
                <Input 
                  id="medecin" 
                  name="medecin" 
                  value={rendezvous.medecinNomComplet ? `Dr. ${rendezvous.medecinNomComplet}` : 'Non assigné'} 
                  readOnly 
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label htmlFor="jour">Date</Label>
                <Input 
                  id="jour" 
                  name="jour" 
                  type="date" 
                  value={rendezvous.jour} 
                  readOnly 
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="heure">Heure</Label>
                <Input 
                  id="heure" 
                  name="heure" 
                  type="time" 
                  value={rendezvous.heure} 
                  readOnly 
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label htmlFor="serviceMedical">Service médical</Label>
                <Input 
                  id="serviceMedical" 
                  name="serviceMedical" 
                  value={rendezvous.serviceMedical} 
                  readOnly 
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="salle">Salle</Label>
                <Input 
                  id="salle" 
                  name="salle" 
                  value={rendezvous.nomSalle || 'Non assignée'} 
                  readOnly 
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label htmlFor="statut">Statut</Label>
                <Input 
                  id="statut" 
                  name="statut" 
                  value={rendezvous.statut} 
                  readOnly 
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="facture">Facture</Label>
                <Input 
                  id="facture" 
                  name="facture" 
                  value={rendezvous.factureId ? `Facture #${rendezvous.factureId}` : 'Aucune facture'} 
                  readOnly 
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label htmlFor="notes">Notes</Label>
                <TextArea 
                  id="notes" 
                  name="notes" 
                  value={rendezvous.notes || 'Aucune note'} 
                  readOnly 
                />
              </FormGroup>
            </FormRow>

            
          </FormContainer>
        </Form>
      </Affichedetailuser>
    </>
  );
};

export default AfficherDetailRendezVous; 
