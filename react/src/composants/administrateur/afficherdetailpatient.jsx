import React ,{useEffect, useState}from 'react';
import { API_BASE } from '../../composants/config/apiconfig'
import axiosInstance from '../../composants/config/axiosConfig';
import Styled from 'styled-components';
import fondImage from '../../assets/backgroundimageuserform.jpg';
import { useParams, useNavigate } from 'react-router-dom';
import Barrehorizontal1 from '../../composants/barrehorizontal1';
import imgprofil from '../../assets/photoDoc.png'

const SousDiv1Style = Styled.div`
 width: 99%;
 padding-left: 1%;
`
const Span2= Styled.span`
  
`
const Span1= Styled.span`
    cursor: pointer;
`
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
    opacity: 0.1; /* ⬅️ Réduit l’opacité de l’image seulement */
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
const Title3 = Styled.h2`
  margin-bottom: 0px;
  font-size: 24px;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
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
const TraitHorizontal2 = Styled.div`
  width: 718px;
  height: 5px;
  angle: 0 deg;
  opacity: 1;
  border-radius: 2.5px;
  background-color: rgba(217, 217, 217, 1);
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
  padding-left:0;
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
  &:focus{
    border: 1px solid rgba(217, 217, 217, 1);
  }
`;

const Select = Styled.select`
  min-width: 351px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
`;
const TextArea = Styled.textarea`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  resize: vertical;
`;


const DetailsPatient = () => {
  
  const idUser = localStorage.getItem('id');
    const [nomprofil, setnomprofil]= useState('')

    useEffect(() => {
           const nomutilisateur =  async ()=> {
                try {
                const response = await axiosInstance.get(`/utilisateurs/${idUser}`);
                console.log('Token utilisé:', localStorage.getItem('token'));
              if (response) {
                 setnomprofil(response.data.nom)
                } else {
                setErreur('Données introuvables');
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs:', error);
                setErreur('Erreur lors du chargement');
            } finally {
                setisloading(false);
            }
            }
            nomutilisateur()
    }, [idUser]);
 
    const { id } = useParams();
    const [patient, setPatient] = useState(null);
    const [erreur, setErreur] = useState(null);
    const [isloading, setisloading] = useState(true);
      
    

    useEffect(()=>{
            
            const fetchPatients = async () => {
                try {
                    const response = await axiosInstance.get(`/patients/${id}`);
                    //console.log(response.data);
                  setPatient(response.data);
                } catch (error) {
                    console.error('Erreur lors de la récupération des utilisateurs:', error);
                    setErreur('Erreur lors du chargement');
                } finally {
                    setisloading(false);
                }
        
            };
                fetchPatients();
            },[id]);


  

      let navigate = useNavigate();
      const handleClick = () => {
        // Redirige vers /utilisateur
        navigate("/admin/patient");
      };
      let navigate1 = useNavigate();
      const handleEditClick = (patient) => {
        navigate1(`/admin/patient/edit/${patient.id}`);
      };
      if (!patient) {
      return <p style={{ textAlign: 'center' }}>Chargement...</p>;
      }
      if (isloading) return <p>Chargement...</p>;

      if (erreur) return <p style={{ color: 'red' }}>{erreur}</p>;
      return (
        <>
          <SousDiv1Style>
              <Barrehorizontal1 titrepage="Gestion des patients" imgprofil1={imgprofil} nomprofil={nomprofil}> 
                  <Span1 onClick={handleClick}>Liste des patients</Span1>
                  <Span2 > {">"} Détail du patient</Span2>
              </Barrehorizontal1>
          </SousDiv1Style>
          <Affichedetailuser>
              <Form>
                <FormContainer>
                <Title>
                    <Title1>Détail utilisateur</Title1>
                    <Title2 onClick={() => handleEditClick(patient)}>Edit</Title2>
                </Title>
                
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
                        <Label htmlFor="adresse">Adresse</Label>
                        <Input id="adresse" name="adresse" value={patient.adresse} readOnly />
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" value={patient.email} readOnly />
                      </FormGroup>
                    </FormRow>

                    <FormRow>
                      <FormGroup>
                        <Label htmlFor="genre">Genre</Label>
                        <Input id="genre" name="genre" value={patient.genre} >
                          
                        </Input>
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="dateNaissance">Date de naissance</Label>
                        <Input id="dateNaissance" name="dateNaissance" type="date" value={patient.dateNaissance} readOnly />
                      </FormGroup>
                    </FormRow>
                  
                </FormContainer>
              </Form>
          </Affichedetailuser>
        </>
      );
};

export default DetailsPatient ;
