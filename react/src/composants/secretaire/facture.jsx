import '../../styles/tableau.css'
import '../../styles/Zonedaffichage.css'
import '../../styles/Barrehorizontal2.css'
import Styled from 'styled-components'
import axiosInstance from '../config/axiosConfig';
import React from 'react';
import { useEffect, useState } from 'react';
import { API_BASE } from '../../composants/config/apiconfig'
import Barrehorizontal1 from '../../composants/barrehorizontal1';
import imgprofil from '../../assets/photoDoc.png'
import iconrecherche from '../../assets/iconrecherche.png'
import iconburger from '../../assets/iconburger.png'
import { Link } from 'react-router-dom';
import FormulaireFacture from './formulairefacture';
import { useLoading } from '../LoadingProvider';
import { useConfirmation } from '../ConfirmationProvider';
import Pagination from '../shared/Pagination';



const ZonedaffichageStyle = Styled.div`
    border-radius: 10px;
    padding-bottom: 50px;
`;

const SousDiv1Style = Styled.div`
  width: 100%;
  padding-right: 32px;
`;

const SousDiv2Style = Styled.div`
  width: 100%;
  padding-right: 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Span1 = Styled.span`
    cursor: pointer;
`;

const ModalOverlay = Styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  animation: fadeIn 0.3s ease-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContainer = Styled.div`
  background: white;
  border-radius: 12px;
  max-width: 90%;
  max-height: 90%;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;


function Facture(){
    const { startLoading, stopLoading, isLoading } = useLoading();
    const { showConfirmation } = useConfirmation();
    const idUser = localStorage.getItem('id');
    const [nomprofil, setnomprofil]= useState('')
    const [idfacture, setidfacture] = useState(0)
    const [showFormulaire, setShowFormulaire] = useState(false)
 
    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log(token);
           const nomutilisateur =  async ()=> {
                try {
                const response = await axiosInstance.get(`/utilisateurs/${idUser}`);
                console.log(token);
              if (response) {
                 setnomprofil(response.data.nom)
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs:', error);
                
            } finally {
              console.log('fin')
            }
            }
            nomutilisateur()
    }, [idUser]);

    const [valeurrecherche, setvaleurrecherche] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [factures, setfactures] = useState([]);
    const [facturesFiltres, setfacturesFiltres] = useState([]);
  
    const [erreur, setErreur] = useState(null);

   
    const rendezvousPerPage = 8;
   
    
    useEffect(()=>{
        startLoading('fetchFactures');
        const fetchfactures = async () => {
            const token = localStorage.getItem('token');
              console.log(token);
            try {
                const response = await axiosInstance.get(`/factures/statut/impayee`);
                console.log(token);
                            if (response && response.data) {
                // Trier les factures par ordre décroissant (plus récent en premier)
                const facturesTries = response.data.sort((a, b) => {
                    // Trier par ID (plus récent en premier)
                    return b.id - a.id;
                });
                
                setfactures(facturesTries);
                setfacturesFiltres(facturesTries);
               } else {
                //setErreur('Données introuvables');
                }
            } catch (error) {
                console.log('Erreur lors de la récupération des rendezvous:', error);
                setErreur('Erreur lors du chargement');
            } finally {
                stopLoading('fetchFactures');
            }
    
        };
            fetchfactures();
        },[]);
        
    useEffect(() => {
            if (!valeurrecherche.trim()) {
                setfacturesFiltres(factures); // Si rien à chercher, on affiche tout
                return;
            }

            const recherche = valeurrecherche.toLowerCase();

            const resultats = factures.filter((u) =>
                u.dateEmission.toLowerCase().includes(recherche) ||
                u.patientNomComplet.toLowerCase().includes(recherche) ||
                u.serviceMedicalNom.toLowerCase().includes(recherche) 
            );

            setfacturesFiltres(resultats);
    }, [valeurrecherche, factures]);





    const [pagesToShow, setpagesToShow] = useState([]);
    const totalPages = Math.ceil(facturesFiltres.length / rendezvousPerPage);

    useEffect(() => {
      // Ne pas afficher la pagination s'il n'y a qu'une page ou moins
      if (totalPages <= 1) {
        setpagesToShow([]);
        return;
      }
      
      if (totalPages >= 6) {
        setpagesToShow([1, 2, 3, "...", totalPages - 1, totalPages]);
      } else {
        const fullList = Array.from({ length: totalPages }, (_, i) => i + 1);
        setpagesToShow(fullList);
      }
    }, [facturesFiltres.length, totalPages]);

            //let pagesToShow = [1, 2, 3, "...", totalPages - 1, totalPages];

            const handleClick = (page) => {
                if (page !== "..." && page !== currentPage) {
                setCurrentPage(page);
                }
            }



    //toggle boutton
    
    
    
                    
    
         
    




    const modification = (numeropage) => {
    let nouvelleListe = [...pagesToShow] // copie de l'ancien tableau

    if (numeropage > 2 && numeropage < totalPages - 2) {
        nouvelleListe[0] = numeropage - 2
        nouvelleListe[1] = numeropage - 1
        nouvelleListe[2] = numeropage
        nouvelleListe[3] = '...'
    } else if (numeropage === totalPages - 2) {
        nouvelleListe[0] = numeropage - 3
        nouvelleListe[1] = numeropage - 2
        nouvelleListe[2] = numeropage - 1
        nouvelleListe[3] = numeropage
    } else {
        // Peut-être une autre logique ici ?
    }
    console.log(pagesToShow)
    setpagesToShow(nouvelleListe)
    }

    // S'assurer que currentPage est toujours valide
    const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages));
    if (validCurrentPage !== currentPage) {
      setCurrentPage(validCurrentPage);
    }
    
    const indexOfLastFacture = validCurrentPage * rendezvousPerPage;
    const indexOfFirstFacture = indexOfLastFacture - rendezvousPerPage;
    const currentFactures = facturesFiltres.slice(indexOfFirstFacture, indexOfLastFacture);
    

    //

    //aficher les détails d'un rendezvous
        //const [user, setuser] = useState({})
        
    //
   

  const handleRowClick = (facture) => {
    setidfacture(facture.id)
    setShowFormulaire(true)
  };

  const handleCloseFormulaire = () => {
    setShowFormulaire(false)
    setidfacture(0)
  }


  



  if (isLoading('fetchFactures')) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '18px', marginBottom: '10px' }}>Chargement des factures...</div>
        <div style={{ fontSize: '14px', color: '#666' }}>Veuillez patienter</div>
      </div>
    </div>
  );

  if (erreur) return <p style={{ color: 'red' }}>{erreur}</p>;
    return(<>
            <SousDiv1Style>
                <Barrehorizontal1 titrepage="Factures" imgprofil1={imgprofil} nomprofil={nomprofil}> 
                    <Span1>Liste des factures impayées</Span1>
                    
                </Barrehorizontal1>
            </SousDiv1Style>
            
            <SousDiv2Style >
                <div className='affichebarh2'
                style={{
                  marginTop: '-20px',
                }}
                >
                    <div className='recherche'>
                        <img className='iconburger' src={iconburger}></img>
                        <input className='inputrecherche' type="text" id="text1" placeholder='Tapez votre recherche ici'  value={valeurrecherche} onChange={(e) => setvaleurrecherche(e.target.value)} required></input>
                        <img className='iconrecherche' src={iconrecherche}></img>
                    </div>
                    
                </div>
                 
                
                
                <div className='zonedaffichage'
                
                >
                    <div className='numero'>
                            <div>
                                <h2 className='nomtable'> Facture impayee </h2>
                            </div>
                            <Pagination
                              currentPage={currentPage}
                              totalPages={totalPages}
                              onPageChange={setCurrentPage}
                              onModification={modification}
                              itemsPerPage={rendezvousPerPage}
                              totalItems={facturesFiltres.length}
                            />
                            
                    </div>
                        <div className='conteneurbarre'>
                            <div className='barre'></div>
                        </div>
                <div className='affichetableau'>
                   
                    <table className='tableau-2'>
                        <thead>
                        <tr>
                            
                            <th className='th'>Jour de création</th>
                            <th className='th'>Heure de création</th>
                            <th className='th'>Service medical</th>
                            <th className='th'>Nom du patient</th>
                            <th className='th'>Montant</th>
                            <th className='th'>Statut</th>
                           
                           
                        </tr>
                        </thead>
                        <tbody>
                        {currentFactures.map((facture) => (
                           <tr key={facture.id} className='tr'>
    
                            
                            
                            <td onClick={() => {handleRowClick(facture)}} className='td'>{facture.dateEmission.split("T")[0]}</td>
                            <td onClick={() => {handleRowClick(facture)}} className='td'>{facture.dateEmission.split("T")[1].split(".")[0]}</td>
                            <td onClick={() => {handleRowClick(facture)}} className='td'>{facture.serviceMedicalNom}</td>
                            <td onClick={() => {handleRowClick(facture)}} className='td'>{facture.patientNomComplet ? facture.patientNomComplet.split(' ').map(name => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()).join(' ') : ''}</td>
                            <td onClick={() => {handleRowClick(facture)}} className='td'>{facture.montant} FCFA</td>
                            <td onClick={() => {handleRowClick(facture)}} className='td'>{facture.statutPaiement}</td>
                            
                            </tr>
                        ))}
                        </tbody>
                    </table>
                   
                    </div>
                </div>

               
                
            </SousDiv2Style>
            {showFormulaire && (
              <ModalOverlay onClick={handleCloseFormulaire}>
                <ModalContainer onClick={(e) => e.stopPropagation()}>
                  <FormulaireFacture id={idfacture} onClick1={handleCloseFormulaire} />
                </ModalContainer>
              </ModalOverlay>
            )}
    </>)   
}
export default Facture;
