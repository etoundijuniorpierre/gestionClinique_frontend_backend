usersconnecte
    return (
    <>
    
        <SousDiv1Style>
                <Barrehorizontal1 titrepage="Dashboard" imgprofil1={imgprofil} nomprofil={nomprofil}> 
                    <Span1>Home</Span1>
                </Barrehorizontal1>
        </SousDiv1Style>

        <SousDiv2Style>
                
                
                <div className='zonedaffichage-dashboad'>
                    
                    <div className='numero'>
                        <h2 className='nomtable'> Statistiques globales </h2>
                    </div>
                            
                    <div className='conteneurbarre'>
                        <div className='barre'></div>
                    </div>
                    <div className='content-grid'>
                        <div className='dashboard-grid'>
                        
                            <div className='grid-1'>
                                <p className='grid-title'> Ce compte </p>
                                <div className='grid-01'>
                                    <div className='grid-11'>
                                        <div className="grid-1-content-image">
                                           <img className='grid-image' src={imgprofil}></img> 
                                        </div>
                                        
                                        <div className='grid-11-content'>
                                            <p className='sous-grid-title'> Connecté depuis le  </p>
                                            {connexionadmin.map((connexion)=>(
                                                <p className='grid-11-date' key={connexion.id}>
                                                    {connexion.lastLoginDate.split("T")[0]}<br></br>
                                                    <span className='grid-11-date-heure'> 
                                                        {connexion.lastLoginDate.split("T")[1].split(".")[0]}  
                                                    </span>
                                                </p>))}
                                            
                                        </div>
                                    </div>
                                    <div className='grid-12'>
                                        <p className='sous-grid-title'> Action recente</p>
                                        <ul className='sous-grid-liste'>
                                            {historiques.map((historique)=>(<li key={historique.id}> {historique.action}</li>))}
                                            
                                        </ul>
                                    </div>
                                    <div className='grid-13'>
                                        <div className="grid-1-content-image">
                                           <img className='grid-image' src={imgprofil}></img> 
                                        </div>
                                        
                                        <div className='grid-11-content'>
                                            <p className='sous-grid-title'> Dernière connection   </p>
                                            {connexionadmin.map((connexion)=>(
                                                <p className='grid-11-date' key={connexion.id}>
                                                    {connexion.lastLogoutDate.split("T")[0]}<br></br>
                                                    <span className='grid-11-date-heure'> 
                                                        {connexion.lastLogoutDate.split("T")[1].split(".")[0]}  
                                                    </span>
                                                </p>))}
                                        </div>
                                    </div>
                                    <div className='grid-14'>
                                        <p className='sous-grid-title'> En attente </p>
                                        <ul className='sous-grid-liste'>
                                            <li>Confirmation de création de compte.</li>
                                            <li>2 messages de la secrétaire Mengne non lus</li>
                                            <li>1 messages du docteur Kipenbé non lu.</li>
                                        </ul>
                                    </div>
                                </div>
                                
                            </div>
                            <div className='grid-2'>
                                <p className='grid-2-title'> Aujourd'hui </p>
                                <div className='grid-2-content'> 
                                    <div className="grid-2-content-chid">
                                        <p className="grid-2-content-chid-text">Nombre de patient enregistré</p>
                                        <div className="grid-2-content-chid-chiffre">{statjour.nbrPatientEnrg}</div>
                                    </div>
                                    <div className="grid-2-content-chid">
                                        <p className="grid-2-content-chid-text"> Nombre de RDV validés</p>
                                        <div className="grid-2-content-chid-chiffre">{statjour.nbrRendezVousCONFIRME}</div>
                                    </div>
                                    <div className="grid-2-content-chid">
                                        <p className="grid-2-content-chid-text"> Nombre de RDV manqués</p>
                                        <div className="grid-2-content-chid-chiffre">{statjour.nbrRendezANNULE}</div>
                                    </div>
                                    <div className="grid-2-content-chid">
                                        <p className="grid-2-content-chid-text">Nombre de consultations effectuées</p>
                                        <div className="grid-2-content-chid-chiffre">{statjour.nbrConsultation}</div>
                                    </div>
                                </div>

                            </div>
                            <div className='grid-3'>
                                <p className='grid-3-title'> Connectés recement </p>
                                <div className='grid-3-content'>
                                    {usersconnecte.map((user)=>( 
                                    <div key={user.id}  className='grid-31'>
                                        
                                        <div className="content-image">
                                            <img className='grid-image' src={imgprofil}></img>
                                            <div className='grid-31-nom'><p>{user.nom}</p></div>
                                        </div>
                                        
                                        <div className='grid-31-content'>
                                            <p className='sous-grid-3-title'> Connecté depuis le  </p>
                                            <p className='grid-31-date'>{user.lastLoginDate.split("T")[0]} à <br></br><span className='grid-31-date-heure'> {user.lastLoginDate.split("T")[1].split(".")[0]} </span></p>
                                        </div>
                                    </div>))}
                                    {usersdisconnecte.map((user)=>( 
                                    <div key={user.id}  className='grid-31 disconnect'>
                                        
                                        <div className="content-image">
                                            <img className='grid-image' src={imgprofil}></img>
                                            <div className='grid-31-nom'><p>{user.nom}</p></div>
                                        </div>
                                        
                                        <div className='grid-31-content'>
                                            <p className='sous-grid-3-title'> Dernière connexion   </p>
                                            <p className='grid-31-date'>{user.lastLogoutDate.split("T")[0]} à <br></br><span className='grid-31-date-heure'> {user.lastLogoutDate.split("T")[1].split(".")[0]} </span></p>
                                        </div>
                                    </div>))}
                                    
                                </div>
                                
                            </div>
                            <div className='grid-4'>
                                 <p className='grid-title chart'> Revenus en dizaine de dollars par mois </p>
                                 <div className='line-chart'>
                                    <Line
                                        data={{
                                            labels: ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Decembre'],
                                            datasets: [
                                            {
                                                label: "Revenue",
                                                data: [10, 15, 20, 100, -10 , 80 , 14, 54, 60, 74, 12, 14],
                                                backgroundColor: "white",
                                                borderColor: "rgba(159, 159, 255, 1)",
                                            },
                                            
                                            ],
                                        }}
                                        options={{
                                                    responsive: true,
                                                    maintainAspectRatio: false, // pour que height du conteneur soit prise en compte
                                                    
                                            elements: {
                                            line: {
                                                tension: 0,
                                            },
                                            },
                                            plugins: {
                                            title: {
                                                text: "Monthly Revenue & Cost",
                                            },
                                            },
                                        }}
                                        />
                                 </div>
                                 
                            </div>
                        
                        
                        </div>
                        <div className='content-barre-dashboard'>
                            <div  className='barre-dashboard'>
                                <div className="element-barre">
                                    <img className='image-barre' src={iconutilisateurblanc}></img>
                                    <p>Uti. connecté : {usersconnecte.length}</p>
                                </div>
                            </div>
                        </div>

                    </div>
                    
                </div>    

               
                
            </SousDiv2Style>
    
    </>)
}

export default Dashboard
