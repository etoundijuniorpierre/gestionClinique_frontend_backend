-- Insertion de 50 patients (noms camerounais et japonais)
INSERT INTO public.patient (id, creation_date, modification_date, adresse, age, date_naissance, email, genre, nom, prenom, telephone) VALUES
-- Patients camerounais
(1, '2025-01-01 09:00:00', '2025-01-01 09:00:00', 'Bastos, Yaoundé', 32, '1993-05-15', 'jean.nguemo@email.com', 'M', 'Nguemo', 'Jean', '677889900'),
(2, '2025-01-01 10:00:00', '2025-01-01 10:00:00', 'Bonapriso, Douala', 28, '1997-02-20', 'aicha.mbappe@email.com', 'F', 'Mbappé', 'Aïcha', '655443322'),
(3, '2025-01-02 11:00:00', '2025-01-02 11:00:00', 'Mendong, Yaoundé', 45, '1980-08-12', 'pierre.tchouta@email.com', 'M', 'Tchouta', 'Pierre', '699887766'),
(4, '2025-01-02 14:00:00', '2025-01-02 14:00:00', 'Akwa, Douala', 19, '2006-11-30', 'fatou.djoumessi@email.com', 'F', 'Djoumessi', 'Fatou', '633221100'),
(5, '2025-01-03 09:30:00', '2025-01-03 09:30:00', 'Nkolbisson, Yaoundé', 55, '1970-04-25', 'jacques.fotso@email.com', 'M', 'Fotso', 'Jacques', '677112233'),
(6, '2025-01-03 10:30:00', '2025-01-03 10:30:00', 'Deido, Douala', 40, '1985-07-18', 'marie.ndongo@email.com', 'F', 'Ndongo', 'Marie', '655778899'),
(7, '2025-01-04 11:30:00', '2025-01-04 11:30:00', 'Mvan, Yaoundé', 22, '2003-01-05', 'serge.ebongue@email.com', 'M', 'Ebongué', 'Serge', '699554433'),
(8, '2025-01-04 14:30:00', '2025-01-04 14:30:00', 'Bali, Douala', 29, '1996-09-22', 'esther.mballa@email.com', 'F', 'Mballa', 'Esther', '633667788'),
(9, '2025-01-05 09:45:00', '2025-01-05 09:45:00', 'Efoulan, Yaoundé', 37, '1988-12-15', 'alain.biyong@email.com', 'M', 'Biyong', 'Alain', '677990011'),
(10, '2025-01-05 10:45:00', '2025-01-05 10:45:00', 'Bonaberi, Douala', 31, '1994-03-08', 'nadine.tagne@email.com', 'F', 'Tagne', 'Nadine', '655332211'),
(11, '2025-01-06 11:45:00', '2025-01-06 11:45:00', 'Odza, Yaoundé', 48, '1977-06-20', 'patrick.mbarga@email.com', 'M', 'Mbarga', 'Patrick', '699001122'),
(12, '2025-01-06 14:45:00', '2025-01-06 14:45:00', 'Bonamoussadi, Douala', 26, '1999-10-12', 'rachel.nguimfack@email.com', 'F', 'Nguimfack', 'Rachel', '633445566'),
(13, '2025-01-07 09:15:00', '2025-01-07 09:15:00', 'Elig-Edzoa, Yaoundé', 42, '1983-04-05', 'armand.ngueme@email.com', 'M', 'Ngueme', 'Armand', '677667788'),
(14, '2025-01-07 10:15:00', '2025-01-07 10:15:00', 'New-Bell, Douala', 23, '2002-07-30', 'sylvie.mouelle@email.com', 'F', 'Mouelle', 'Sylvie', '655889900'),
(15, '2025-01-08 11:15:00', '2025-01-08 11:15:00', 'Mokolo, Yaoundé', 34, '1991-11-18', 'guy.essomba@email.com', 'M', 'Essomba', 'Guy', '699223344'),
(16, '2025-01-08 14:15:00', '2025-01-08 14:15:00', 'Logbaba, Douala', 27, '1998-02-25', 'juliette.ngono@email.com', 'F', 'Ngono', 'Juliette', '633778899'),
(17, '2025-01-09 09:00:00', '2025-01-09 09:00:00', 'Ngoa-Ekelle, Yaoundé', 39, '1986-09-14', 'roland.nguena@email.com', 'M', 'Nguena', 'Roland', '677001122'),
(18, '2025-01-09 10:00:00', '2025-01-09 10:00:00', 'Makepe, Douala', 24, '2001-12-08', 'chantal.tchakounte@email.com', 'F', 'Tchakounté', 'Chantal', '655334455'),
(19, '2025-01-10 11:00:00', '2025-01-10 11:00:00', 'Biyem-Assi, Yaoundé', 50, '1975-05-22', 'bernard.nguimbi@email.com', 'M', 'Nguimbi', 'Bernard', '699556677'),
(20, '2025-01-10 14:00:00', '2025-01-10 14:00:00', 'Kotto, Douala', 33, '1992-08-15', 'monique.mbappe@email.com', 'F', 'Mbappé', 'Monique', '633889900'),
(21, '2025-01-11 09:30:00', '2025-01-11 09:30:00', 'Etoudi, Yaoundé', 41, '1984-03-10', 'albert.nguimbi@email.com', 'M', 'Nguimbi', 'Albert', '677112233'),
(22, '2025-01-11 10:30:00', '2025-01-11 10:30:00', 'Bepanda, Douala', 25, '2000-06-28', 'gisele.tchouta@email.com', 'F', 'Tchouta', 'Gisèle', '655445566'),
(23, '2025-01-12 11:30:00', '2025-01-12 11:30:00', 'Melen, Yaoundé', 36, '1989-10-05', 'michel.ebongue@email.com', 'M', 'Ebongué', 'Michel', '699778899'),
(24, '2025-01-12 14:30:00', '2025-01-12 14:30:00', 'Bonamoussadi, Douala', 30, '1995-01-20', 'veronique.ndongo@email.com', 'F', 'Ndongo', 'Véronique', '633001122'),
(25, '2025-01-13 09:45:00', '2025-01-13 09:45:00', 'Nkolmesseng, Yaoundé', 44, '1981-07-15', 'gerard.mbarga@email.com', 'M', 'Mbarga', 'Gérard', '677334455'),

-- Patients japonais
(26, '2025-01-13 10:45:00', '2025-01-13 10:45:00', 'Shibuya, Tokyo', 38, '1987-04-12', 'taro.yamada@email.jp', 'M', 'Yamada', 'Taro', '09011112222'),
(27, '2025-01-14 11:45:00', '2025-01-14 11:45:00', 'Shinjuku, Tokyo', 27, '1998-09-25', 'hanako.tanaka@email.jp', 'F', 'Tanaka', 'Hanako', '09033334444'),
(28, '2025-01-14 14:45:00', '2025-01-14 14:45:00', 'Osaka-shi, Osaka', 52, '1973-11-30', 'jiro.suzuki@email.jp', 'M', 'Suzuki', 'Jiro', '09055556666'),
(29, '2025-01-15 09:15:00', '2025-01-15 09:15:00', 'Yokohama-shi, Kanagawa', 21, '2004-02-18', 'sakura.watanabe@email.jp', 'F', 'Watanabe', 'Sakura', '09077778888'),
(30, '2025-01-15 10:15:00', '2025-01-15 10:15:00', 'Kyoto-shi, Kyoto', 59, '1966-08-05', 'kenji.takahashi@email.jp', 'M', 'Takahashi', 'Kenji', '09099990000'),
(31, '2025-01-16 11:15:00', '2025-01-16 11:15:00', 'Sapporo-shi, Hokkaido', 33, '1992-05-22', 'yuki.ito@email.jp', 'F', 'Ito', 'Yuki', '08011112222'),
(32, '2025-01-16 14:15:00', '2025-01-16 14:15:00', 'Nagoya-shi, Aichi', 40, '1985-12-10', 'takashi.nakamura@email.jp', 'M', 'Nakamura', 'Takashi', '08033334444'),
(33, '2025-01-17 09:00:00', '2025-01-17 09:00:00', 'Kobe-shi, Hyogo', 29, '1996-07-15', 'ai.kobayashi@email.jp', 'F', 'Kobayashi', 'Ai', '08055556666'),
(34, '2025-01-17 10:00:00', '2025-01-17 10:00:00', 'Fukuoka-shi, Fukuoka', 47, '1978-03-28', 'hiroshi.yoshida@email.jp', 'M', 'Yoshida', 'Hiroshi', '08077778888'),
(35, '2025-01-18 11:00:00', '2025-01-18 11:00:00', 'Hiroshima-shi, Hiroshima', 31, '1994-10-08', 'mei.sasaki@email.jp', 'F', 'Sasaki', 'Mei', '08099990000'),
(36, '2025-01-18 14:00:00', '2025-01-18 14:00:00', 'Sendai-shi, Miyagi', 56, '1969-01-20', 'yuji.yamamoto@email.jp', 'M', 'Yamamoto', 'Yuji', '09022223333'),
(37, '2025-01-19 09:30:00', '2025-01-19 09:30:00', 'Chiba-shi, Chiba', 24, '2001-06-12', 'rika.matsumoto@email.jp', 'F', 'Matsumoto', 'Rika', '09044445555'),
(38, '2025-01-19 10:30:00', '2025-01-19 10:30:00', 'Kawasaki-shi, Kanagawa', 43, '1982-09-05', 'masao.inoue@email.jp', 'M', 'Inoue', 'Masao', '09066667777'),
(39, '2025-01-20 11:30:00', '2025-01-20 11:30:00', 'Saitama-shi, Saitama', 35, '1990-04-18', 'nao.kimura@email.jp', 'F', 'Kimura', 'Nao', '09088889999'),
(40, '2025-01-20 14:30:00', '2025-01-20 14:30:00', 'Shizuoka-shi, Shizuoka', 51, '1974-12-25', 'shinji.ogawa@email.jp', 'M', 'Ogawa', 'Shinji', '08022223333'),
(41, '2025-01-21 09:45:00', '2025-01-21 09:45:00', 'Okayama-shi, Okayama', 26, '1999-08-30', 'yui.ishikawa@email.jp', 'F', 'Ishikawa', 'Yui', '08044445555'),
(42, '2025-01-21 10:45:00', '2025-01-21 10:45:00', 'Kumamoto-shi, Kumamoto', 58, '1967-05-15', 'takeshi.endo@email.jp', 'M', 'Endo', 'Takeshi', '08066667777'),
(43, '2025-01-22 11:45:00', '2025-01-22 11:45:00', 'Kagoshima-shi, Kagoshima', 30, '1995-02-10', 'mika.abe@email.jp', 'F', 'Abe', 'Mika', '08088889999'),
(44, '2025-01-22 14:45:00', '2025-01-22 14:45:00', 'Naha-shi, Okinawa', 46, '1979-11-22', 'kazuki.mori@email.jp', 'M', 'Mori', 'Kazuki', '09010101010'),
(45, '2025-01-23 09:15:00', '2025-01-23 09:15:00', 'Matsuyama-shi, Ehime', 32, '1993-07-08', 'haruka.fujita@email.jp', 'F', 'Fujita', 'Haruka', '09020202020'),
(46, '2025-01-23 10:15:00', '2025-01-23 10:15:00', 'Niigata-shi, Niigata', 53, '1972-04-15', 'ryota.okamoto@email.jp', 'M', 'Okamoto', 'Ryota', '09030303030'),
(47, '2025-01-24 11:15:00', '2025-01-24 11:15:00', 'Hamamatsu-shi, Shizuoka', 23, '2002-10-28', 'saki.miura@email.jp', 'F', 'Miura', 'Saki', '09040404040'),
(48, '2025-01-24 14:15:00', '2025-01-24 14:15:00', 'Hachioji-shi, Tokyo', 49, '1976-01-05', 'daiki.harada@email.jp', 'M', 'Harada', 'Daiki', '09050505050'),
(49, '2025-01-25 09:00:00', '2025-01-25 09:00:00', 'Toyota-shi, Aichi', 36, '1989-06-20', 'akari.shimizu@email.jp', 'F', 'Shimizu', 'Akari', '09060606060'),
(50, '2025-01-25 10:00:00', '2025-01-25 10:00:00', 'Kanazawa-shi, Ishikawa', 57, '1968-03-12', 'yutaka.takeuchi@email.jp', 'M', 'Takeuchi', 'Yutaka', '09070707070');

-- Insertion de dossiers médicaux pour les 50 patients
INSERT INTO public.dossier_medical (id, creation_date, modification_date, dernier_traitements, allergies, antecedents_medicaux, groupe_sanguin, observations, patient_id) VALUES
(1, '2025-01-01 09:05:00', '2025-01-01 09:05:00', 'Paracétamol 500mg', 'Pollen, Arachides', 'Hypertension artérielle', 'A+', 'Patient stable, surveillance tensionnelle', 1),
(2, '2025-01-01 10:05:00', '2025-01-01 10:05:00', 'Ibuprofène 200mg', 'Pénicilline', 'Asthme infantile', 'B-', 'Nécessite suivi allergologique', 2),
(3, '2025-01-02 11:05:00', '2025-01-02 11:05:00', 'Atorvastatine 20mg', 'Aucune connue', 'Diabète type 2', 'O+', 'Équilibre glycémique à surveiller', 3),
(4, '2025-01-02 14:05:00', '2025-01-02 14:05:00', 'Vitamine D 1000UI', 'Latex', 'Aucun', 'AB+', 'Croissance normale pour l''âge', 4),
(5, '2025-01-03 09:35:00', '2025-01-03 09:35:00', 'Lisinopril 10mg', 'Iode', 'Infarctus 2018', 'A-', 'Réadaptation cardiaque en cours', 5),
(6, '2025-01-03 10:35:00', '2025-01-03 10:35:00', 'Metformine 850mg', 'Sulfamides', 'Diabète gestationnel', 'B+', 'Contrôle glycémique trimestriel', 6),
(7, '2025-01-04 11:35:00', '2025-01-04 11:35:00', 'Salbutamol spray', 'Acariens', 'Bronchite chronique', 'O-', 'Utilisation ponctuelle du spray', 7),
(8, '2025-01-04 14:35:00', '2025-01-04 14:35:00', 'Fer 50mg', 'Aucune', 'Anémie ferriprive', 'A+', 'Contrôle hémoglobine dans 3 mois', 8),
(9, '2025-01-05 09:50:00', '2025-01-05 09:50:00', 'Oméprazole 20mg', 'Aucune', 'Reflux gastro-œsophagien', 'B-', 'Traitement au long cours', 9),
(10, '2025-01-05 10:50:00', '2025-01-05 10:50:00', 'Doliprane 1000mg', 'Arachides', 'Migraines fréquentes', 'AB-', 'Éviter les déclencheurs connus', 10),
(11, '2025-01-06 11:50:00', '2025-01-06 11:50:00', 'Simvastatine 40mg', 'Aucune', 'Hypercholestérolémie', 'O+', 'Bilan lipidique annuel', 11),
(12, '2025-01-06 14:50:00', '2025-01-06 14:50:00', 'Levothyrox 75µg', 'Aucune', 'Hypothyroïdie', 'A-', 'Contrôle TSH tous les 6 mois', 12),
(13, '2025-01-07 09:20:00', '2025-01-07 09:20:00', 'Amlodipine 5mg', 'Aucune', 'Hypertension artérielle', 'B+', 'Automesure tensionnelle conseillée', 13),
(14, '2025-01-07 10:20:00', '2025-01-07 10:20:00', 'Dafalgan 500mg', 'AINS', 'Arthrose genou droit', 'AB+', 'Kinésithérapie en cours', 14),
(15, '2025-01-08 11:20:00', '2025-01-08 11:20:00', 'Ventoline spray', 'Pollen', 'Asthme allergique', 'O-', 'Débitmètre de pointe fourni', 15),
(16, '2025-01-08 14:20:00', '2025-01-08 14:20:00', 'Spasfon 80mg', 'Aucune', 'Colopathie fonctionnelle', 'A+', 'Régime pauvre en FODMAPs', 16),
(17, '2025-01-09 09:05:00', '2025-01-09 09:05:00', 'Kardégic 75mg', 'Aspirine', 'Antécédent AVC 2020', 'B-', 'Surveillance neurologique', 17),
(18, '2025-01-09 10:05:00', '2025-01-09 10:05:00', 'Effexor 75mg', 'Aucune', 'Dépression modérée', 'AB-', 'Suivi psychiatrique mensuel', 18),
(19, '2025-01-10 11:05:00', '2025-01-10 11:05:00', 'Lantus 20UI', 'Aucune', 'Diabète type 1', 'O+', 'Autosurveillance glycémique', 19),
(20, '2025-01-10 14:05:00', '2025-01-10 14:05:00', 'Prozac 20mg', 'Aucune', 'Trouble anxieux généralisé', 'A-', 'Thérapie cognitive en parallèle', 20),
(21, '2025-01-11 09:35:00', '2025-01-11 09:35:00', 'Crestor 10mg', 'Aucune', 'Dyslipidémie', 'B+', 'Activité physique conseillée', 21),
(22, '2025-01-11 10:35:00', '2025-01-11 10:35:00', 'Xanax 0.25mg', 'Benzodiazépines', 'Trouble panique', 'AB+', 'Utilisation ponctuelle uniquement', 22),
(23, '2025-01-12 11:35:00', '2025-01-12 11:35:00', 'Cozaar 50mg', 'Aucune', 'Hypertension artérielle', 'O-', 'Régime hyposodé conseillé', 23),
(24, '2025-01-12 14:35:00', '2025-01-12 14:35:00', 'Synthroid 100µg', 'Aucune', 'Thyroïdectomie totale', 'A+', 'Contrôle TSH trimestriel', 24),
(25, '2025-01-13 09:50:00', '2025-01-13 09:50:00', 'Plavix 75mg', 'Aucune', 'Stent coronaire 2022', 'B-', 'Pas d''AINS sans avis médical', 25),
(26, '2025-01-13 10:50:00', '2025-01-13 10:50:00', 'Losartan 50mg', 'Aucune', 'Hypertension artérielle', 'O+', 'Contrôle tensionnel mensuel', 26),
(27, '2025-01-14 11:50:00', '2025-01-14 11:50:00', 'Zyrtec 10mg', 'Pollen, acariens', 'Rhinite allergique', 'A-', 'Traitement saisonnier', 27),
(28, '2025-01-14 14:50:00', '2025-01-14 14:50:00', 'Pantoprazole 40mg', 'Aucune', 'Ulcère gastrique', 'B+', 'Endoscopie de contrôle dans 1 an', 28),
(29, '2025-01-15 09:20:00', '2025-01-15 09:20:00', 'Concerta 36mg', 'Aucune', 'TDAH', 'AB+', 'Suivi psychiatrique régulier', 29),
(30, '2025-01-15 10:20:00', '2025-01-15 10:20:00', 'Eliquis 5mg', 'Aucune', 'FA non valvulaire', 'O-', 'Surveillance saignement', 30),
(31, '2025-01-16 11:20:00', '2025-01-16 11:20:00', 'Insulatard 20UI', 'Aucune', 'Diabète type 2', 'A+', 'Éducation thérapeutique en cours', 31),
(32, '2025-01-16 14:20:00', '2025-01-16 14:20:00', 'Tahor 20mg', 'Aucune', 'Hypercholestérolémie familiale', 'B-', 'Bilan lipidique semestriel', 32),
(33, '2025-01-17 09:05:00', '2025-01-17 09:05:00', 'Levothyrox 100µg', 'Aucune', 'Hypothyroïdie post-opératoire', 'AB-', 'Contrôle TSH tous les 3 mois', 33),
(34, '2025-01-17 10:05:00', '2025-01-17 10:05:00', 'Tramadol 50mg', 'Opioïdes', 'Lombalgie chronique', 'O+', 'Utilisation ponctuelle', 34),
(35, '2025-01-18 11:05:00', '2025-01-18 11:05:00', 'Seroplex 10mg', 'Aucune', 'Dépression récurrente', 'A-', 'Psychothérapie en parallèle', 35),
(36, '2025-01-18 14:05:00', '2025-01-18 14:05:00', 'Kardégic 160mg', 'Aucune', 'Antécédent IDM', 'B+', 'Pas d''AINS sans avis médical', 36),
(37, '2025-01-19 09:35:00', '2025-01-19 09:35:00', 'Diamicron 30mg', 'Sulfamides', 'Diabète type 2', 'AB+', 'Autosurveillance glycémique', 37),
(38, '2025-01-19 10:35:00', '2025-01-19 10:35:00', 'Toplexil 15mg', 'Aucune', 'Urticaire chronique', 'O-', 'Éviter les facteurs déclenchants', 38),
(39, '2025-01-20 11:35:00', '2025-01-20 11:35:00', 'Loxen 50mg', 'Aucune', 'Hypertension artérielle', 'A+', 'Automesure tensionnelle', 39),
(40, '2025-01-20 14:35:00', '2025-01-20 14:35:00', 'Tercian 25mg', 'Aucune', 'Trouble bipolaire', 'B-', 'Suivi psychiatrique mensuel', 40),
(41, '2025-01-21 09:50:00', '2025-01-21 09:50:00', 'Forlax 10g', 'Aucune', 'Constipation chronique', 'AB-', 'Hydratation suffisante importante', 41),
(42, '2025-01-21 10:50:00', '2025-01-21 10:50:00', 'Tareg 80mg', 'Aucune', 'Insuffisance cardiaque', 'O+', 'Surveillance poids quotidienne', 42),
(43, '2025-01-22 11:50:00', '2025-01-22 11:50:00', 'Topamax 50mg', 'Aucune', 'Épilepsie partielle', 'A-', 'Éviter l''alcool', 43),
(44, '2025-01-22 14:50:00', '2025-01-22 14:50:00', 'Nexium 40mg', 'Aucune', 'Œsophagite peptique', 'B+', 'Traitement de 8 semaines', 44),
(45, '2025-01-23 09:20:00', '2025-01-23 09:20:00', 'Keppra 500mg', 'Aucune', 'Épilepsie généralisée', 'AB+', 'Contrôle neurologique annuel', 45),
(46, '2025-01-23 10:20:00', '2025-01-23 10:20:00', 'Coversyl 5mg', 'Aucune', 'Hypertension artérielle', 'O-', 'Contrôle tensionnel mensuel', 46),
(47, '2025-01-24 11:20:00', '2025-01-24 11:20:00', 'Imovane 7.5mg', 'Aucune', 'Insomnie chronique', 'A+', 'Utilisation ponctuelle', 47),
(48, '2025-01-24 14:20:00', '2025-01-24 14:20:00', 'Zyprexa 5mg', 'Aucune', 'Schizophrénie', 'B-', 'Suivi psychiatrique hebdomadaire', 48),
(49, '2025-01-25 09:05:00', '2025-01-25 09:05:00', 'Depakine 500mg', 'Aucune', 'Trouble bipolaire', 'AB-', 'Contrôle hépatique trimestriel', 49),
(50, '2025-01-25 10:05:00', '2025-01-25 10:05:00', 'Lantus 30UI', 'Aucune', 'Diabète type 2 insulinorequérant', 'O+', 'Autosurveillance glycémique', 50);

-- Insertion de 12 utilisateurs (3x4) - médecins et secrétaires
INSERT INTO public.utilisateurs (id, creation_date, modification_date, adresse, age, date_naissance, email, genre, nom, prenom, telephone, actif, last_login_date, last_logout_date, mot_de_passe, photo_profil, service_medical, status_connect, role_id) VALUES
-- Médecins camerounais
(2, '2025-01-10 08:00:00', '2025-01-10 08:00:00', 'Bastos, Yaoundé', 45, '1980-04-15', 'dr.nguema@clinique.cm', 'M', 'Nguema', 'Samuel', '677112233', true, '2025-08-15 08:30:00', '2025-08-15 17:00:00', '$2a$10$securehashedpassword', 'dr_nguema.jpg', 'CARDIOLOGIE', 'DECONNECTE', 2),
(3, '2025-01-10 08:05:00', '2025-01-10 08:05:00', 'Bonapriso, Douala', 38, '1987-11-22', 'dr.mbappe@clinique.cm', 'F', 'Mbappé', 'Amina', '655443322', true, '2025-08-15 08:15:00', '2025-08-15 16:45:00', '$2a$10$securehashedpassword', 'dr_mbappe.jpg', 'PEDIATRIE', 'DECONNECTE', 2),
(4, '2025-01-10 08:10:00', '2025-01-10 08:10:00', 'Mendong, Yaoundé', 50, '1975-08-30', 'dr.ebongue@clinique.cm', 'M', 'Ebongué', 'Paul', '699887766', true, '2025-08-15 08:00:00', '2025-08-15 17:30:00', '$2a$10$securehashedpassword', 'dr_ebongue.jpg', 'MEDECINE_GENERALE', 'DECONNECTE', 2),
(5, '2025-01-10 08:15:00', '2025-01-10 08:15:00', 'Akwa, Douala', 32, '1993-03-10', 'secretary1@clinique.cm', 'F', 'Tchouta', 'Estelle', '633221100', true, '2025-08-15 07:45:00', '2025-08-15 17:15:00', '$2a$10$securehashedpassword', 'secretary1.jpg', NULL, 'DECONNECTE', 3),

-- Médecins japonais
(6, '2025-01-10 08:20:00', '2025-01-10 08:20:00', 'Shibuya, Tokyo', 42, '1983-07-18', 'dr.yamamoto@clinique.jp', 'M', 'Yamamoto', 'Takashi', '09011112222', true, '2025-08-15 08:10:00', '2025-08-15 17:20:00', '$2a$10$securehashedpassword', 'dr_yamamoto.jpg', 'NEUROLOGIE', 'DECONNECTE', 2),
(7, '2025-01-10 08:25:00', '2025-01-10 08:25:00', 'Shinjuku, Tokyo', 35, '1990-12-05', 'dr.tanaka@clinique.jp', 'F', 'Tanaka', 'Yuki', '09033334444', true, '2025-08-15 08:05:00', '2025-08-15 16:50:00', '$2a$10$securehashedpassword', 'dr_tanaka.jpg', 'GYNECOLOGIE', 'DECONNECTE', 2),
(8, '2025-01-10 08:30:00', '2025-01-10 08:30:00', 'Osaka-shi, Osaka', 48, '1977-04-22', 'dr.suzuki@clinique.jp', 'M', 'Suzuki', 'Kenji', '09055556666', true, '2025-08-15 08:15:00', '2025-08-15 17:45:00', '$2a$10$securehashedpassword', 'dr_suzuki.jpg', 'ORTHOPEDIE', 'DECONNECTE', 2),
(9, '2025-01-10 08:35:00', '2025-01-10 08:35:00', 'Yokohama-shi, Kanagawa', 29, '1996-09-15', 'secretary2@clinique.jp', 'F', 'Nakamura', 'Hana', '09077778888', true, '2025-08-15 07:50:00', '2025-08-15 17:10:00', '$2a$10$securehashedpassword', 'secretary2.jpg', NULL, 'DECONNECTE', 3),

-- Autres médecins
(10, '2025-01-10 08:40:00', '2025-01-10 08:40:00', 'Kyoto-shi, Kyoto', 52, '1973-05-30', 'dr.wilson@clinique.com', 'M', 'Wilson', 'David', '0734567890', true, '2025-08-15 08:20:00', '2025-08-15 17:25:00', '$2a$10$securehashedpassword', 'dr_wilson.jpg', 'DERMATOLOGIE', 'DECONNECTE', 2),
(11, '2025-01-10 08:45:00', '2025-01-10 08:45:00', 'Sapporo-shi, Hokkaido', 40, '1985-10-12', 'dr.jones@clinique.com', 'F', 'Jones', 'Sarah', '0723456789', true, '2025-08-15 08:10:00', '2025-08-15 16:55:00', '$2a$10$securehashedpassword', 'dr_jones.jpg', 'OPHTALMOLOGIE', 'DECONNECTE', 2),
(12, '2025-01-10 08:50:00', '2025-01-10 08:50:00', 'Nagoya-shi, Aichi', 44, '1981-02-28', 'dr.smith@clinique.com', 'M', 'Smith', 'John', '0712345678', true, '2025-08-15 08:05:00', '2025-08-15 17:35:00', '$2a$10$securehashedpassword', 'dr_smith.jpg', 'RHUMATOLOGIE', 'DECONNECTE', 2),
(13, '2025-01-10 08:55:00', '2025-01-10 08:55:00', 'Kobe-shi, Hyogo', 31, '1994-08-08', 'secretary3@clinique.com', 'F', 'Brown', 'Emma', '0745678901', true, '2025-08-15 07:55:00', '2025-08-15 17:05:00', '$2a$10$securehashedpassword', 'secretary3.jpg', NULL, 'DECONNECTE', 3);

-- Insertion de 30 rendez-vous (adapté pour 50 patients et 12 médecins)
INSERT INTO public.rendez_vous (id, creation_date, modification_date, heure, jour, notes, service_medical, statut, medecin_id, patient_id, salle_id) VALUES
-- Rendez-vous camerounais
(1, '2025-01-20 09:00:00', '2025-01-20 09:00:00', '09:30:00', '2025-01-25', 'Première consultation cardiologie', 'CARDIOLOGIE', 'CONFIRME', 2, 5, 4),
(2, '2025-01-20 10:00:00', '2025-01-20 10:00:00', '10:15:00', '2025-01-25', 'Contrôle annuel enfant', 'PEDIATRIE', 'CONFIRME', 3, 4, 2),
(3, '2025-01-21 11:00:00', '2025-01-21 11:00:00', '14:00:00', '2025-01-26', 'Douleurs thoraciques', 'MEDECINE_GENERALE', 'EN_ATTENTE', 4, 1, 1),
(4, '2025-01-22 14:00:00', '2025-01-22 14:00:00', '16:30:00', '2025-01-27', 'Suivi diabète', 'MEDECINE_GENERALE', 'CONFIRME', 4, 3, 1),
(5, '2025-01-23 16:00:00', '2025-01-23 16:00:00', '08:45:00', '2025-01-28', 'Vaccination', 'PEDIATRIE', 'TERMINE', 3, 2, 2),
(6, '2025-01-24 09:00:00', '2025-01-24 09:00:00', '11:00:00', '2025-01-29', 'Bilan neurologique', 'NEUROLOGIE', 'CONFIRME', 6, 17, 14),
(7, '2025-01-25 10:00:00', '2025-01-25 10:00:00', '14:30:00', '2025-01-30', 'Consultation grossesse', 'GYNECOLOGIE', 'CONFIRME', 7, 20, 3),
(8, '2025-01-26 11:00:00', '2025-01-26 11:00:00', '09:15:00', '2025-02-01', 'Douleurs articulaires', 'ORTHOPEDIE', 'EN_ATTENTE', 8, 15, 7),
(9, '2025-01-27 14:00:00', '2025-01-27 14:00:00', '16:00:00', '2025-02-02', 'Examen de la vue', 'OPHTALMOLOGIE', 'CONFIRME', 11, 12, 6),
(10, '2025-01-28 16:00:00', '2025-01-28 16:00:00', '10:45:00', '2025-02-03', 'Problèmes de peau', 'DERMATOLOGIE', 'CONFIRME', 10, 8, 5),

-- Rendez-vous japonais
(11, '2025-01-20 09:30:00', '2025-01-20 09:30:00', '13:00:00', '2025-01-25', 'Consultation routine', 'MEDECINE_GENERALE', 'CONFIRME', 4, 26, 1),
(12, '2025-01-21 10:30:00', '2025-01-21 10:30:00', '15:30:00', '2025-01-26', 'Problèmes thyroïde', 'ENDOCRINOLOGIE', 'CONFIRME', 12, 30, 17),
(13, '2025-01-22 11:30:00', '2025-01-22 11:30:00', '09:00:00', '2025-01-27', 'Dépistage cancer', 'GYNECOLOGIE', 'CONFIRME', 7, 31, 3),
(14, '2025-01-23 14:30:00', '2025-01-23 14:30:00', '11:30:00', '2025-01-28', 'Douleurs rhumatismales', 'RHUMATOLOGIE', 'CONFIRME', 12, 35, 18),
(15, '2025-01-24 16:30:00', '2025-01-24 16:30:00', '14:00:00', '2025-01-29', 'Examen des yeux', 'OPHTALMOLOGIE', 'TERMINE', 11, 28, 6),
(16, '2025-01-25 09:30:00', '2025-01-25 09:30:00', '16:45:00', '2025-01-30', 'Suivi diabète', 'ENDOCRINOLOGIE', 'CONFIRME', 12, 42, 17),
(17, '2025-01-26 10:30:00', '2025-01-26 10:30:00', '08:30:00', '2025-02-01', 'Problèmes respiratoires', 'PNEUMOLOGIE', 'CONFIRME', 10, 38, 16),
(18, '2025-01-27 11:30:00', '2025-01-27 11:30:00', '10:15:00', '2025-02-02', 'Consultation enfant', 'PEDIATRIE', 'CONFIRME', 3, 45, 2),
(19, '2025-01-28 14:30:00', '2025-01-28 14:30:00', '13:45:00', '2025-02-03', 'Bilan cardiaque', 'CARDIOLOGIE', 'CONFIRME', 2, 46, 4),
(20, '2025-01-29 16:30:00', '2025-01-29 16:30:00', '15:30:00', '2025-02-04', 'Problèmes digestifs', 'GASTRO_ENTEROLOGIE', 'CONFIRME', 8, 33, 15),

-- Autres rendez-vous
(21, '2025-01-30 09:00:00', '2025-01-30 09:00:00', '09:00:00', '2025-02-05', 'Consultation urgence', 'URGENCES', 'CONFIRME', 4, 7, 10),
(22, '2025-01-30 10:00:00', '2025-01-30 10:00:00', '11:00:00', '2025-02-05', 'Analyse sang', 'LABORATOIRE_ANALYSES', 'CONFIRME', 5, 9, 9),
(23, '2025-01-31 11:00:00', '2025-01-31 11:00:00', '14:00:00', '2025-02-06', 'Douleurs dentaires', 'DENTISTE', 'CONFIRME', 8, 14, 12),
(24, '2025-02-01 14:00:00', '2025-02-01 14:00:00', '16:00:00', '2025-02-07', 'Consultation psychiatrique', 'PSYCHIATRIE', 'CONFIRME', 6, 18, 13),
(25, '2025-02-02 16:00:00', '2025-02-02 16:00:00', '10:30:00', '2025-02-08', 'Rééducation', 'KINESITHERAPIE', 'CONFIRME', 10, 22, 11),
(26, '2025-02-03 09:00:00', '2025-02-03 09:00:00', '13:15:00', '2025-02-09', 'Radiographie genou', 'RADIOLOGIE', 'CONFIRME', 11, 25, 8),
(27, '2025-02-04 10:00:00', '2025-02-04 10:00:00', '15:45:00', '2025-02-10', 'Contrôle tension', 'MEDECINE_GENERALE', 'EN_ATTENTE', 4, 29, 1),
(28, '2025-02-05 11:00:00', '2025-02-05 11:00:00', '09:30:00', '2025-02-11', 'Vaccin grippe', 'PEDIATRIE', 'CONFIRME', 3, 37, 2),
(29, '2025-02-06 14:00:00', '2025-02-06 14:00:00', '11:45:00', '2025-02-12', 'Problèmes de peau', 'DERMATOLOGIE', 'CONFIRME', 10, 40, 5),
(30, '2025-02-07 16:00:00', '2025-02-07 16:00:00', '14:15:00', '2025-02-13', 'Bilan annuel', 'MEDECINE_GENERALE', 'CONFIRME', 4, 44, 1);

-- Insertion de 30 consultations (1 par rendez-vous)
INSERT INTO public.consultation (id, creation_date, modification_date, compte_rendu, diagnostic, motifs, poids, taille, temperature, tension_arterielle, dossier_medical_id, medecin_id, rendez_vous_id) VALUES
(1, '2025-01-25 10:00:00', '2025-01-25 10:00:00', 'Patient présentant des douleurs thoraciques atypiques. ECG normal. Pas de signes d''urgence.', 'Douleurs musculo-squelettiques', 'Douleurs thoraciques', 78.5, 175, 36.8, '12/8', 1, 4, 3),
(2, '2025-01-25 11:00:00', '2025-01-25 11:00:00', 'Examen cardiologique complet. Léger souffle systolique sans retentissement.', 'Souffle cardiaque bénin', 'Bilan post-infarctus', 85.2, 180, 36.7, '13/8', 5, 2, 1),
(3, '2025-01-26 14:30:00', '2025-01-26 14:30:00', 'Contrôle de croissance normal. Vaccination à jour.', 'En bonne santé', 'Contrôle annuel', 52.0, 165, 37.0, '11/7', 4, 3, 2),
(4, '2025-01-27 17:00:00', '2025-01-27 17:00:00', 'Diabète bien équilibré sous traitement. Pas de complications.', 'Diabète type 2 équilibré', 'Suivi diabète', 90.0, 172, 36.9, '12/7', 3, 4, 4),
(5, '2025-01-28 09:30:00', '2025-01-28 09:30:00', 'Vaccin ROR effectué. Pas de réaction immédiate.', 'Vaccination effectuée', 'Vaccination', 60.5, 168, 36.5, '11/6', 2, 3, 5),
(6, '2025-01-29 11:30:00', '2025-01-29 11:30:00', 'Bilan neurologique normal. Pas de signes déficitaires.', 'Examen neurologique normal', 'Bilan neurologique', 82.0, 178, 36.8, '12/8', 17, 6, 6),
(7, '2025-01-30 15:00:00', '2025-01-30 15:00:00', 'Grossesse à 12 SA. Échographie normale. Prescription vitamines.', 'Grossesse normale', 'Consultation grossesse', 65.0, 170, 36.9, '11/7', 20, 7, 7),
(8, '2025-02-01 09:45:00', '2025-02-01 09:45:00', 'Arthrose genou gauche confirmée. Prescription antalgiques et kiné.', 'Gonarthrose gauche', 'Douleurs articulaires', 76.0, 175, 36.7, '13/8', 15, 8, 8),
(9, '2025-02-02 16:30:00', '2025-02-02 16:30:00', 'Myopie stable. Ordonnance nouvelles lunettes.', 'Myopie -2.5 OD et OG', 'Examen de la vue', 68.0, 172, 36.8, '12/7', 12, 11, 9),
(10, '2025-02-03 11:15:00', '2025-02-03 11:15:00', 'Eczéma atopique. Prescription crème corticoïde.', 'Eczéma atopique', 'Problèmes de peau', 70.5, 180, 36.9, '12/8', 8, 10, 10),
(11, '2025-01-25 13:30:00', '2025-01-25 13:30:00', 'Examen de routine normal. Pas de plainte particulière.', 'En bonne santé', 'Consultation routine', 72.0, 173, 36.7, '12/8', 26, 4, 11),
(12, '2025-01-26 16:00:00', '2025-01-26 16:00:00', 'Hypothyroïdie compensée sous traitement. Adaptation posologie.', 'Hypothyroïdie compensée', 'Problèmes thyroïde', 65.0, 168, 36.8, '11/7', 30, 12, 12),
(13, '2025-01-27 09:30:00', '2025-01-27 09:30:00', 'Frottis cervico-vaginal normal. Pas de lésion suspecte.', 'Frottis normal', 'Dépistage cancer', 58.0, 165, 36.9, '11/6', 31, 7, 13),
(14, '2025-01-28 12:00:00', '2025-01-28 12:00:00', 'Polyarthrite rhumatoïde stable sous traitement.', 'PR stable', 'Douleurs rhumatismales', 62.0, 170, 36.8, '12/7', 35, 12, 14),
(15, '2025-01-29 14:30:00', '2025-01-29 14:30:00', 'Cataracte débutante. Surveillance annuelle.', 'Cataracte débutante', 'Examen des yeux', 70.0, 175, 36.7, '13/8', 28, 11, 15),
(16, '2025-01-30 17:15:00', '2025-01-30 17:15:00', 'Diabète déséquilibré. Adaptation insulinothérapie.', 'Diabète déséquilibré', 'Suivi diabète', 85.0, 172, 36.9, '12/8', 42, 12, 16),
(17, '2025-02-01 09:00:00', '2025-02-01 09:00:00', 'Bronchite aiguë virale. Prescription symptomatique.', 'Bronchite aiguë', 'Problèmes respiratoires', 78.0, 180, 37.5, '13/8', 38, 10, 17),
(18, '2025-02-02 10:45:00', '2025-02-02 10:45:00', 'Enfant en bonne santé. Vaccination à jour.', 'En bonne santé', 'Consultation enfant', 25.0, 120, 37.0, '10/6', 45, 3, 18),
(19, '2025-02-03 14:15:00', '2025-02-03 14:15:00', 'Cardiopathie ischémique stable. Pas de signe d''angor.', 'Cardiopathie stable', 'Bilan cardiaque', 80.0, 175, 36.8, '12/8', 46, 2, 19),
(20, '2025-02-04 16:00:00', '2025-02-04 16:00:00', 'Reflux gastro-œsophagien. Conseils hygiéno-diététiques.', 'RGO', 'Problèmes digestifs', 72.0, 178, 36.9, '12/7', 33, 8, 20),
(21, '2025-02-05 09:30:00', '2025-02-05 09:30:00', 'Entorse cheville droite. Prescription antalgiques et repos.', 'Entorse cheville droite', 'Consultation urgence', 75.0, 180, 37.0, '13/8', 7, 4, 21),
(22, '2025-02-05 11:30:00', '2025-02-05 11:30:00', 'Prélèvement sanguin effectué. Résultats dans 48h.', 'Prélèvement effectué', 'Analyse sang', 70.0, 175, 36.8, '12/7', 9, 5, 22),
(23, '2025-02-06 14:30:00', '2025-02-06 14:30:00', 'Carie molaire supérieure droite. Soin effectué.', 'Carie traitée', 'Douleurs dentaires', 65.0, 170, 36.9, '11/7', 14, 8, 23),
(24, '2025-02-07 16:30:00', '2025-02-07 16:30:00', 'Dépression réactionnelle. Adaptation traitement.', 'Dépression réactionnelle', 'Consultation psychiatrique', 68.0, 172, 36.8, '12/7', 18, 6, 24),
(25, '2025-02-08 11:00:00', '2025-02-08 11:00:00', 'Séance de kiné pour lombalgie. Exercices prescrits.', 'Lombalgie commune', 'Rééducation', 72.0, 178, 36.9, '12/8', 22, 10, 25),
(26, '2025-02-09 13:45:00', '2025-02-09 13:45:00', 'Radiographie genou: arthrose fémoro-tibiale.', 'Gonarthrose', 'Radiographie genou', 80.0, 180, 36.8, '13/8', 25, 11, 26),
(27, '2025-02-10 16:15:00', '2025-02-10 16:15:00', 'Tension normale. Pas de modification traitement.', 'Tension normale', 'Contrôle tension', 74.0, 175, 36.9, '12/7', 29, 4, 27),
(28, '2025-02-11 10:00:00', '2025-02-11 10:00:00', 'Vaccin grippe saisonnière effectué.', 'Vaccination grippe', 'Vaccin grippe', 30.0, 130, 36.8, '10/6', 37, 3, 28),
(29, '2025-02-12 12:15:00', '2025-02-12 12:15:00', 'Psoriasis en plaques. Prescription topique.', 'Psoriasis', 'Problèmes de peau', 75.0, 178, 36.9, '12/8', 40, 10, 29),
(30, '2025-02-13 14:45:00', '2025-02-13 14:45:00', 'Bilan complet normal. Conseils prévention.', 'Bilan normal', 'Bilan annuel', 82.0, 180, 36.8, '12/8', 44, 4, 30);

-- Insertion de 30 prescriptions (1 par consultation)
INSERT INTO public.prescription (id, creation_date, modification_date, duree_prescription, instructions, medicaments, quantite, type_prescription, consultation_id, dossier_medical_id, medecin_id, patient_id) VALUES
(1, '2025-01-25 10:05:00', '2025-01-25 10:05:00', '7 jours', '1 comprimé matin et soir après les repas', 'Paracétamol 500mg', 14, 'MEDICAMENT', 1, 1, 4, 1),
(2, '2025-01-25 11:05:00', '2025-01-25 11:05:00', '30 jours', '1 comprimé le matin à jeun', 'Atorvastatine 20mg', 30, 'MEDICAMENT', 2, 5, 2, 5),
(3, '2025-01-26 14:35:00', '2025-01-26 14:35:00', '90 jours', '1 ampoule par semaine', 'Vitamine D 1000UI', 12, 'MEDICAMENT', 3, 4, 3, 4),
(4, '2025-01-27 17:05:00', '2025-01-27 17:05:00', 'Continu', 'Mesurer la glycémie à jeun 3x/semaine', 'Bandelettes glycémie', 100, 'MATERIEL', 4, 3, 4, 3),
(5, '2025-01-28 09:35:00', '2025-01-28 09:35:00', 'Ponctuel', 'Appliquer 3x/jour pendant 2 jours', 'Crème Apaisyl', 1, 'MEDICAMENT', 5, 2, 3, 2),
(6, '2025-01-29 11:35:00', '2025-01-29 11:35:00', '30 jours', '1 comprimé le soir', 'Gabapentine 300mg', 30, 'MEDICAMENT', 6, 17, 6, 17),
(7, '2025-01-30 15:05:00', '2025-01-30 15:05:00', '90 jours', '1 comprimé par jour', 'Acide folique 400µg', 90, 'MEDICAMENT', 7, 20, 7, 20),
(8, '2025-02-01 09:50:00', '2025-02-01 09:50:00', '10 jours', '1 comprimé matin et soir', 'Ibuprofène 400mg', 20, 'MEDICAMENT', 8, 15, 8, 15),
(9, '2025-02-02 16:35:00', '2025-02-02 16:35:00', '12 mois', 'A porter en permanence', 'Lunettes myopie -2.5', 1, 'MATERIEL', 9, 12, 11, 12),
(10, '2025-02-03 11:20:00', '2025-02-03 11:20:00', '15 jours', 'Appliquer matin et soir', 'Crème corticoïde', 1, 'MEDICAMENT', 10, 8, 10, 8),
(11, '2025-01-25 13:35:00', '2025-01-25 13:35:00', 'Aucune', 'Bilan sanguin à effectuer', 'Bilan sanguin complet', 1, 'EXAMEN', 11, 26, 4, 26),
(12, '2025-01-26 16:05:00', '2025-01-26 16:05:00', '60 jours', '1 comprimé le matin à jeun', 'Lévothyroxine 75µg', 60, 'MEDICAMENT', 12, 30, 12, 30),
(13, '2025-01-27 09:35:00', '2025-01-27 09:35:00', 'Aucune', 'Contrôle dans 3 ans', 'Frottis cervico-vaginal', 1, 'EXAMEN', 13, 31, 7, 31),
(14, '2025-01-28 12:05:00', '2025-01-28 12:05:00', '30 jours', '1 injection par semaine', 'Méthotrexate 15mg', 4, 'MEDICAMENT', 14, 35, 12, 35),
(15, '2025-01-29 14:35:00', '2025-01-29 14:35:00', 'Aucune', 'Contrôle annuel', 'Examen ophtalmologique', 1, 'EXAMEN', 15, 28, 11, 28),
(16, '2025-01-30 17:20:00', '2025-01-30 17:20:00', '30 jours', '20 unités le soir', 'Insuline glargine', 1, 'MEDICAMENT', 16, 42, 12, 42),
(17, '2025-02-01 09:05:00', '2025-02-01 09:05:00', '5 jours', '1 sachet matin et soir', 'Paracétamol 500mg', 10, 'MEDICAMENT', 17, 38, 10, 38),
(18, '2025-02-02 10:50:00', '2025-02-02 10:50:00', 'Aucune', 'Vaccination à jour', 'Vaccin ROR', 1, 'VACCIN', 18, 45, 3, 45),
(19, '2025-02-03 14:20:00', '2025-02-03 14:20:00', '90 jours', '1 comprimé le matin', 'Bisoprolol 5mg', 90, 'MEDICAMENT', 19, 46, 2, 46),
(20, '2025-02-04 16:05:00', '2025-02-04 16:05:00', '30 jours', '1 comprimé avant repas', 'Oméprazole 20mg', 30, 'MEDICAMENT', 20, 33, 8, 33),
(21, '2025-02-05 09:35:00', '2025-02-05 09:35:00', '7 jours', '1 comprimé 3x/jour', 'Ibuprofène 400mg', 21, 'MEDICAMENT', 21, 7, 4, 7),
(22, '2025-02-05 11:35:00', '2025-02-05 11:35:00', 'Aucune', 'Résultats dans 48h', 'Bilan sanguin', 1, 'EXAMEN', 22, 9, 5, 9),
(23, '2025-02-06 14:35:00', '2025-02-06 14:35:00', '5 jours', '1 comprimé si douleur', 'Paracétamol 1g', 10, 'MEDICAMENT', 23, 14, 8, 14),
(24, '2025-02-07 16:35:00', '2025-02-07 16:35:00', '30 jours', '1 comprimé le soir', 'Sertraline 50mg', 30, 'MEDICAMENT', 24, 18, 6, 18),
(25, '2025-02-08 11:05:00', '2025-02-08 11:05:00', '10 séances', '2 séances par semaine', 'Kinésithérapie', 10, 'SOIN', 25, 22, 10, 22),
(26, '2025-02-09 13:50:00', '2025-02-09 13:50:00', '30 jours', '1 comprimé matin et soir', 'Glucosamine 1500mg', 60, 'MEDICAMENT', 26, 25, 11, 25),
(27, '2025-02-10 16:20:00', '2025-02-10 16:20:00', 'Aucune', 'Contrôle dans 6 mois', 'Automesure tensionnelle', 1, 'EXAMEN', 27, 29, 4, 29),
(28, '2025-02-11 10:05:00', '2025-02-11 10:05:00', 'Aucune', 'Vaccination effectuée', 'Vaccin grippe', 1, 'VACCIN', 28, 37, 3, 37),
(29, '2025-02-12 12:20:00', '2025-02-12 12:20:00', '15 jours', 'Appliquer matin et soir', 'Crème à base de cortisone', 1, 'MEDICAMENT', 29, 40, 10, 40),
(30, '2025-02-13 14:50:00', '2025-02-13 14:50:00', 'Aucune', 'Bilan complet normal', 'Bilan sanguin', 1, 'EXAMEN', 30, 44, 4, 44);

-- Insertion de 30 factures (1 par consultation)
INSERT INTO public.facture (id, creation_date, modification_date, date_emission, mode_paiement, montant, statut_paiement, consultation_id, patient_id, rendez_vous_id) VALUES
(1, '2025-01-25 10:30:00', '2025-01-25 10:30:00', '2025-01-25', 'CARTE_BANCAIRE', 50.00, 'PAYEE', 1, 1, 3),
(2, '2025-01-25 11:30:00', '2025-01-25 11:30:00', '2025-01-25', 'VIREMENT', 120.00, 'PAYEE', 2, 5, 1),
(3, '2025-01-26 15:00:00', '2025-01-26 15:00:00', '2025-01-26', 'ESPECES', 40.00, 'PAYEE', 3, 4, 2),
(4, '2025-01-27 17:30:00', '2025-01-27 17:30:00', '2025-01-27', 'CARTE_BANCAIRE', 50.00, 'IMPAYEE', 4, 3, 4),
(5, '2025-01-28 10:00:00', '2025-01-28 10:00:00', '2025-01-28', 'MOBILE_MONEY', 30.00, 'PAYEE', 5, 2, 5),
(6, '2025-01-29 12:00:00', '2025-01-29 12:00:00', '2025-01-29', 'CARTE_BANCAIRE', 80.00, 'PAYEE', 6, 17, 6),
(7, '2025-01-30 15:30:00', '2025-01-30 15:30:00', '2025-01-30', 'CHEQUE', 60.00, 'PAYEE', 7, 20, 7),
(8, '2025-02-01 10:15:00', '2025-02-01 10:15:00', '2025-02-01', 'ESPECES', 70.00, 'PAYEE', 8, 15, 8),
(9, '2025-02-02 17:00:00', '2025-02-02 17:00:00', '2025-02-02', 'CARTE_BANCAIRE', 90.00, 'PAYEE', 9, 12, 9),
(10, '2025-02-03 11:45:00', '2025-02-03 11:45:00', '2025-02-03', 'VIREMENT', 65.00, 'PAYEE', 10, 8, 10),
(11, '2025-01-25 14:00:00', '2025-01-25 14:00:00', '2025-01-25', 'MOBILE_MONEY', 50.00, 'PAYEE', 11, 26, 11),
(12, '2025-01-26 16:30:00', '2025-01-26 16:30:00', '2025-01-26', 'CARTE_BANCAIRE', 75.00, 'PAYEE', 12, 30, 12),
(13, '2025-01-27 10:00:00', '2025-01-27 10:00:00', '2025-01-27', 'ESPECES', 55.00, 'PAYEE', 13, 31, 13),
(14, '2025-01-28 12:30:00', '2025-01-28 12:30:00', '2025-01-28', 'CHEQUE', 85.00, 'PAYEE', 14, 35, 14),
(15, '2025-01-29 15:00:00', '2025-01-29 15:00:00', '2025-01-29', 'CARTE_BANCAIRE', 70.00, 'PAYEE', 15, 28, 15),
(16, '2025-01-30 17:45:00', '2025-01-30 17:45:00', '2025-01-30', 'VIREMENT', 95.00, 'PAYEE', 16, 42, 16),
(17, '2025-02-01 09:30:00', '2025-02-01 09:30:00', '2025-02-01', 'MOBILE_MONEY', 60.00, 'PAYEE', 17, 38, 17),
(18, '2025-02-02 11:15:00', '2025-02-02 11:15:00', '2025-02-02', 'CARTE_BANCAIRE', 45.00, 'PAYEE', 18, 45, 18),
(19, '2025-02-03 14:45:00', '2025-02-03 14:45:00', '2025-02-03', 'ESPECES', 110.00, 'PAYEE', 19, 46, 19),
(20, '2025-02-04 16:30:00', '2025-02-04 16:30:00', '2025-02-04', 'CHEQUE', 65.00, 'PAYEE', 20, 33, 20),
(21, '2025-02-05 10:00:00', '2025-02-05 10:00:00', '2025-02-05', 'CARTE_BANCAIRE', 50.00, 'PAYEE', 21, 7, 21),
(22, '2025-02-05 12:00:00', '2025-02-05 12:00:00', '2025-02-05', 'VIREMENT', 35.00, 'PAYEE', 22, 9, 22),
(23, '2025-02-06 15:00:00', '2025-02-06 15:00:00', '2025-02-06', 'MOBILE_MONEY', 80.00, 'PAYEE', 23, 14, 23),
(24, '2025-02-07 17:00:00', '2025-02-07 17:00:00', '2025-02-07', 'CARTE_BANCAIRE', 120.00, 'PAYEE', 24, 18, 24),
(25, '2025-02-08 11:30:00', '2025-02-08 11:30:00', '2025-02-08', 'ESPECES', 55.00, 'PAYEE', 25, 22, 25),
(26, '2025-02-09 14:15:00', '2025-02-09 14:15:00', '2025-02-09', 'CHEQUE', 90.00, 'PAYEE', 26, 25, 26),
(27, '2025-02-10 16:45:00', '2025-02-10 16:45:00', '2025-02-10', 'CARTE_BANCAIRE', 50.00, 'PAYEE', 27, 29, 27),
(28, '2025-02-11 10:30:00', '2025-02-11 10:30:00', '2025-02-11', 'VIREMENT', 30.00, 'PAYEE', 28, 37, 28),
(29, '2025-02-12 12:45:00', '2025-02-12 12:45:00', '2025-02-12', 'MOBILE_MONEY', 70.00, 'PAYEE', 29, 40, 29),
(30, '2025-02-13 15:15:00', '2025-02-13 15:15:00', '2025-02-13', 'CARTE_BANCAIRE', 50.00, 'PAYEE', 30, 44, 30);

-- Insertion d'historique d'actions supplémentaires (50 au total)
INSERT INTO public.historique_action (id, creation_date, modification_date, action_description, date_action, utilisateur_id) VALUES
-- Suite des actions précédentes...
(6, '2025-01-20 09:35:00', '2025-01-20 09:35:00', 'Modification dossier patient Tanaka Hanako', '2025-01-20', 9),
(7, '2025-01-21 10:20:00', '2025-01-21 10:20:00', 'Consultation patient Suzuki Jiro', '2025-01-21', 6),
(8, '2025-01-22 11:25:00', '2025-01-22 11:25:00', 'Envoi message groupe Gynécologie', '2025-01-22', 7),
(9, '2025-01-23 14:05:00', '2025-01-23 14:05:00', 'Génération facture patient Watanabe Sakura', '2025-01-23', 9),
(10, '2025-01-24 16:50:00', '2025-01-24 16:50:00', 'Création dossier patient Takahashi Kenji', '2025-01-24', 5),
(11, '2025-01-25 09:35:00', '2025-01-25 09:35:00', 'Modification dossier patient Ito Yuki', '2025-01-25', 13),
(12, '2025-01-26 10:20:00', '2025-01-26 10:20:00', 'Consultation patient Nakamura Takashi', '2025-01-26', 6),
(13, '2025-01-27 11:25:00', '2025-01-27 11:25:00', 'Envoi message groupe Orthopédie', '2025-01-27', 8),
(14, '2025-01-28 14:05:00', '2025-01-28 14:05:00', 'Génération facture patient Kobayashi Ai', '2025-01-28', 9),
(15, '2025-01-29 16:50:00', '2025-01-29 16:50:00', 'Création dossier patient Yoshida Hiroshi', '2025-01-29', 5),
(16, '2025-01-30 09:35:00', '2025-01-30 09:35:00', 'Modification dossier patient Sasaki Mei', '2025-01-30', 13),
(17, '2025-01-31 10:20:00', '2025-01-31 10:20:00', 'Consultation patient Yamamoto Yuji', '2025-01-31', 10),
(18, '2025-02-01 11:25:00', '2025-02-01 11:25:00', 'Envoi message groupe Dermatologie', '2025-02-01', 10),
(19, '2025-02-02 14:05:00', '2025-02-02 14:05:00', 'Génération facture patient Matsumoto Rika', '2025-02-02', 9),
(20, '2025-02-03 16:50:00', '2025-02-03 16:50:00', 'Création dossier patient Inoue Masao', '2025-02-03', 5),
(21, '2025-02-04 09:35:00', '2025-02-04 09:35:00', 'Modification dossier patient Kimura Nao', '2025-02-04', 13),
(22, '2025-02-05 10:20:00', '2025-02-05 10:20:00', 'Consultation patient Ogawa Shinji', '2025-02-05', 11),
(23, '2025-02-06 11:25:00', '2025-02-06 11:25:00', 'Envoi message groupe Ophtalmologie', '2025-02-06', 11),
(24, '2025-02-07 14:05:00', '2025-02-07 14:05:00', 'Génération facture patient Ishikawa Yui', '2025-02-07', 9),
(25, '2025-02-08 16:50:00', '2025-02-08 16:50:00', 'Création dossier patient Endo Takeshi', '2025-02-08', 5),
(26, '2025-02-09 09:35:00', '2025-02-09 09:35:00', 'Modification dossier patient Abe Mika', '2025-02-09', 13),
(27, '2025-02-10 10:20:00', '2025-02-10 10:20:00', 'Consultation patient Mori Kazuki', '2025-02-10', 12),
(28, '2025-02-11 11:25:00', '2025-02-11 11:25:00', 'Envoi message groupe Rhumatologie', '2025-02-11', 12),
(29, '2025-02-12 14:05:00', '2025-02-12 14:05:00', 'Génération facture patient Fujita Haruka', '2025-02-12', 9),
(30, '2025-02-13 16:50:00', '2025-02-13 16:50:00', 'Création dossier patient Okamoto Ryota', '2025-02-13', 5),
(31, '2025-02-14 09:35:00', '2025-02-14 09:35:00', 'Modification dossier patient Miura Saki', '2025-02-14', 13),
(32, '2025-02-15 10:20:00', '2025-02-15 10:20:00', 'Consultation patient Harada Daiki', '2025-02-15', 10),
(33, '2025-02-16 11:25:00', '2025-02-16 11:25:00', 'Envoi message groupe Cardiologie', '2025-02-16', 2),
(34, '2025-02-17 14:05:00', '2025-02-17 14:05:00', 'Génération facture patient Shimizu Akari', '2025-02-17', 9),
(35, '2025-02-18 16:50:00', '2025-02-18 16:50:00', 'Création dossier patient Takeuchi Yutaka', '2025-02-18', 5),
(36, '2025-02-19 09:35:00', '2025-02-19 09:35:00', 'Modification dossier patient Nguemo Jean', '2025-02-19', 5),
(37, '2025-02-20 10:20:00', '2025-02-20 10:20:00', 'Consultation patient Mbappé Aïcha', '2025-02-20', 3),
(38, '2025-02-21 11:25:00', '2025-02-21 11:25:00', 'Envoi message groupe Pédiatrie', '2025-02-21', 3),
(39, '2025-02-22 14:05:00', '2025-02-22 14:05:00', 'Génération facture patient Tchouta Pierre', '2025-02-22', 5),
(40, '2025-02-23 16:50:00', '2025-02-23 16:50:00', 'Modification dossier patient Djoumessi Fatou', '2025-02-23', 5),
(41, '2025-02-24 09:35:00', '2025-02-24 09:35:00', 'Consultation patient Fotso Jacques', '2025-02-24', 4),
(42, '2025-02-25 10:20:00', '2025-02-25 10:20:00', 'Envoi message groupe Médecine Générale', '2025-02-25', 4),
(43, '2025-02-26 11:25:00', '2025-02-26 11:25:00', 'Génération facture patient Ndongo Marie', '2025-02-26', 5),
(44, '2025-02-27 14:05:00', '2025-02-27 14:05:00', 'Modification dossier patient Ebongué Serge', '2025-02-27', 5),
(45, '2025-02-28 16:50:00', '2025-02-28 16:50:00', 'Consultation patient Mballa Esther', '2025-02-28', 7),
(46, '2025-03-01 09:35:00', '2025-03-01 09:35:00', 'Envoi message groupe Gynécologie', '2025-03-01', 7),
(47, '2025-03-02 10:20:00', '2025-03-02 10:20:00', 'Génération facture patient Biyong Alain', '2025-03-02', 5),
(48, '2025-03-03 11:25:00', '2025-03-03 11:25:00', 'Modification dossier patient Tagne Nadine', '2025-03-03', 5),
(49, '2025-03-04 14:05:00', '2025-03-04 14:05:00', 'Consultation patient Mbarga Patrick', '2025-03-04', 10),
(50, '2025-03-05 16:50:00', '2025-03-05 16:50:00', 'Envoi message groupe Dermatologie', '2025-03-05', 10);

-- Insertion de statistiques supplémentaires
INSERT INTO public.stat_du_jour (id, creation_date, modification_date, jour, nbr_consultation, nbr_patient_enrg, nbr_rendezannule, nbr_rendez_vousconfirme, revenu) VALUES
(3, '2025-01-27 23:59:00', '2025-01-27 23:59:00', '2025-01-27', 3, 0, 1, 2, 190.00),
(4, '2025-01-28 23:59:00', '2025-01-28 23:59:00', '2025-01-28', 2, 0, 0, 2, 140.00),
(5, '2025-01-29 23:59:00', '2025-01-29 23:59:00', '2025-01-29', 4, 0, 0, 4, 275.00),
(6, '2025-01-30 23:59:00', '2025-01-30 23:59:00', '2025-01-30', 3, 0, 1, 2, 220.00),
(7, '2025-01-31 23:59:00', '2025-01-31 23:59:00', '2025-01-31', 2, 0, 0, 2, 115.00),
(8, '2025-02-01 23:59:00', '2025-02-01 23:59:00', '2025-02-01', 3, 0, 0, 3, 205.00),
(9, '2025-02-02 23:59:00', '2025-02-02 23:59:00', '2025-02-02', 4, 0, 1, 3, 250.00),
(10, '2025-02-03 23:59:00', '2025-02-03 23:59:00', '2025-02-03', 2, 0, 0, 2, 175.00),
(11, '2025-02-04 23:59:00', '2025-02-04 23:59:00', '2025-02-04', 3, 0, 0, 3, 240.00),
(12, '2025-02-05 23:59:00', '2025-02-05 23:59:00', '2025-02-05', 4, 0, 0, 4, 170.00),
(13, '2025-02-06 23:59:00', '2025-02-06 23:59:00', '2025-02-06', 2, 0, 1, 1, 200.00),
(14, '2025-02-07 23:59:00', '2025-02-07 23:59:00', '2025-02-07', 3, 0, 0, 3, 290.00),
(15, '2025-02-08 23:59:00', '2025-02-08 23:59:00', '2025-02-08', 1, 0, 0, 1, 55.00),
(16, '2025-02-09 23:59:00', '2025-02-09 23:59:00', '2025-02-09', 2, 0, 0, 2, 140.00),
(17, '2025-02-10 23:59:00', '2025-02-10 23:59:00', '2025-02-10', 3, 0, 0, 3, 130.00),
(18, '2025-02-11 23:59:00', '2025-02-11 23:59:00', '2025-02-11', 1, 0, 0, 1, 30.00),
(19, '2025-02-12 23:59:00', '2025-02-12 23:59:00', '2025-02-12', 2, 0, 0, 2, 100.00),
(20, '2025-02-13 23:59:00', '2025-02-13 23:59:00', '2025-02-13', 1, 0, 0, 1, 50.00);

INSERT INTO public.stat_mois_encours (id, creation_date, modification_date, mois_encours, nbr_consultation, nbr_patient_enrg, nbr_rendezannule, nbr_rendez_vousconfirme, revenu) VALUES
(2, '2025-02-28 23:59:00', '2025-02-28 23:59:00', 'Février 2025', 25, 0, 3, 22, 1820.00),
(3, '2025-03-31 23:59:00', '2025-03-31 23:59:00', 'Mars 2025', 5, 0, 0, 5, 375.00);

INSERT INTO public.stat_mois_dernier (id, creation_date, modification_date, mois_dernier, nbr_consultation, nbr_patient_enrg, nbr_rendezannule, nbr_rendez_vousconfirme, revenu) VALUES
(2, '2025-03-01 00:00:00', '2025-03-01 00:00:00', 'Février 2025', 25, 0, 3, 22, 1820.00),
(3, '2025-04-01 00:00:00', '2025-04-01 00:00:00', 'Mars 2025', 28, 0, 2, 26, 2100.00);

INSERT INTO public.stats_sur_lannee (id, creation_date, modification_date, annee, nbr_consultation, nbr_patient_enrg, nbr_rendezannule, nbr_rendez_vousconfirme, revenu) VALUES
(2, '2025-01-01 00:00:00', '2025-01-01 00:00:00', '2025', 60, 50, 8, 52, 4800.00),
(3, '2026-01-01 00:00:00', '2026-01-01 00:00:00', '2026', 35, 12, 5, 30, 2800.00);

-- Mise à jour des séquences
SELECT pg_catalog.setval('public.consultation_id_seq', 30, true);
SELECT pg_catalog.setval('public.dossier_medical_id_seq', 50, true);
SELECT pg_catalog.setval('public.facture_id_seq', 30, true);
SELECT pg_catalog.setval('public.groupes_id_seq', 9, true);
SELECT pg_catalog.setval('public.historique_action_id_seq', 50, true);
SELECT pg_catalog.setval('public.message_id_seq', 50, true);
SELECT pg_catalog.setval('public.patient_id_seq', 50, true);
SELECT pg_catalog.setval('public.prescription_id_seq', 30, true);
SELECT pg_catalog.setval('public.rendez_vous_id_seq', 30, true);
SELECT pg_catalog.setval('public.utilisateurs_id_seq', 13, true);
SELECT pg_catalog.setval('public.stat_du_jour_id_seq', 20, true);
SELECT pg_catalog.setval('public.stat_mois_encours_id_seq', 3, true);
SELECT pg_catalog.setval('public.stat_mois_dernier_id_seq', 3, true);
SELECT pg_catalog.setval('public.stats_sur_lannee_id_seq', 3, true);