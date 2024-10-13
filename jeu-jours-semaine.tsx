import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, Volume2, VolumeX } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const joursAvecIcones = [
  { nom: "lundi", icone: "🌙", couleur: "#E6E6FA" },    // Lavande
  { nom: "mardi", icone: "🔴", couleur: "#FFB3BA" },    // Rouge clair
  { nom: "mercredi", icone: "☿", couleur: "#BAFFC9" },  // Vert menthe
  { nom: "jeudi", icone: "⚡", couleur: "#BAE1FF" },    // Bleu clair
  { nom: "vendredi", icone: "♀", couleur: "#FFFFBA" },  // Jaune pâle
  { nom: "samedi", icone: "🪐", couleur: "#FFD9BA" },   // Pêche
  { nom: "dimanche", icone: "☀️", couleur: "#FFDFBA" }  // Abricot
];

const moisAvecIcones = [
  { nom: "janvier", icone: "❄️", couleur: "#FFFFFF" },   // Blanc
  { nom: "février", icone: "💘", couleur: "#FFB3BA" },   // Rose
  { nom: "mars", icone: "🌱", couleur: "#BAFFC9" },      // Vert clair
  { nom: "avril", icone: "🌧️", couleur: "#BAE1FF" },     // Bleu ciel
  { nom: "mai", icone: "🌸", couleur: "#FFB3FF" },       // Rose clair
  { nom: "juin", icone: "☀️", couleur: "#FFFFBA" },      // Jaune pâle
  { nom: "juillet", icone: "🏖️", couleur: "#FFDFBA" },   // Sable
  { nom: "août", icone: "🌻", couleur: "#FFFFC9" },      // Jaune clair
  { nom: "septembre", icone: "🍁", couleur: "#FFCBA4" }, // Orange clair
  { nom: "octobre", icone: "🎃", couleur: "#FFB347" },   // Orange
  { nom: "novembre", icone: "🍂", couleur: "#D2691E" },  // Chocolat
  { nom: "décembre", icone: "🎄", couleur: "#228B22" }   // Vert forêt
];

const JeuTemps = () => {
  const [elementActuel, setElementActuel] = useState({ nom: '', icone: '', couleur: '' });
  const [reponseUtilisateur, setReponseUtilisateur] = useState('');
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);
  const [niveau, setNiveau] = useState(1);
  const [mode, setMode] = useState('jours');
  const [tempsRestant, setTempsRestant] = useState(60);
  const [estEnModeTemps, setEstEnModeTemps] = useState(false);
  const [estEnModeAleatoire, setEstEnModeAleatoire] = useState(false);
  const [sonActive, setSonActive] = useState(true);

  useEffect(() => {
    choisirNouvelElement();
  }, [mode, estEnModeAleatoire]);

  useEffect(() => {
    if (estEnModeTemps && tempsRestant > 0) {
      const timer = setTimeout(() => setTempsRestant(tempsRestant - 1), 1000);
      return () => clearTimeout(timer);
    } else if (estEnModeTemps && tempsRestant === 0) {
      finDuJeu();
    }
  }, [estEnModeTemps, tempsRestant]);

  const choisirNouvelElement = () => {
    const liste = mode === 'jours' ? joursAvecIcones : moisAvecIcones;
    let nouvelElement;
    if (estEnModeAleatoire) {
      nouvelElement = liste[Math.floor(Math.random() * liste.length)];
    } else {
      const indexActuel = liste.findIndex(item => item.nom === elementActuel.nom);
      const indexSuivant = (indexActuel + 1) % liste.length;
      nouvelElement = liste[indexSuivant];
    }
    setElementActuel(nouvelElement);
    setReponseUtilisateur('');
    setMessage('');
  };

  const verifierReponse = () => {
    const liste = mode === 'jours' ? joursAvecIcones : moisAvecIcones;
    let reponseCorrecte;
    if (estEnModeAleatoire) {
      const indexActuel = liste.findIndex(item => item.nom === elementActuel.nom);
      reponseCorrecte = liste[(indexActuel + 1) % liste.length];
    } else {
      const indexActuel = liste.findIndex(item => item.nom === elementActuel.nom);
      reponseCorrecte = liste[(indexActuel + 1) % liste.length];
    }

    if (reponseUtilisateur === reponseCorrecte.nom) {
      setMessage('Correct !');
      setScore(score + 1);
      if (score + 1 >= niveau * 10) {
        setNiveau(niveau + 1);
      }
      if (sonActive) playSound('correct');
      setTimeout(choisirNouvelElement, 1500);
    } else {
      setMessage(`Incorrect. La bonne réponse était ${reponseCorrecte.nom}.`);
      if (sonActive) playSound('incorrect');
      setTimeout(choisirNouvelElement, 2000);
    }
  };

  const changerMode = () => {
    setMode(mode === 'jours' ? 'mois' : 'jours');
    setScore(0);
    setNiveau(1);
    setEstEnModeTemps(false);
    setTempsRestant(60);
  };

  const toggleModeTemps = () => {
    setEstEnModeTemps(!estEnModeTemps);
    if (!estEnModeTemps) {
      setTempsRestant(60);
      setScore(0);
    }
  };

  const toggleModeAleatoire = () => {
    setEstEnModeAleatoire(!estEnModeAleatoire);
    setScore(0);
    setNiveau(1);
  };

  const finDuJeu = () => {
    setMessage(`Temps écoulé ! Votre score final est de ${score}.`);
    setEstEnModeTemps(false);
  };

  const playSound = (type) => {
    const audio = new Audio(`/api/sound/${type}`);
    audio.play();
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">
        {`Apprends les ${mode === 'jours' ? 'jours de la semaine' : 'mois de l\'année'}`}
      </h1>
      <div className="mb-4 text-center" style={{backgroundColor: elementActuel.couleur, padding: '20px', borderRadius: '10px'}}>
        <p className="text-lg">Que vient après :</p>
        <p className="text-6xl my-4">{elementActuel.icone}</p>
        <p className="text-3xl font-bold my-2">{elementActuel.nom}</p>
      </div>
      <div className="flex mb-4">
        <input
          type="text"
          value={reponseUtilisateur}
          onChange={(e) => setReponseUtilisateur(e.target.value.toLowerCase())}
          className="flex-grow p-2 border rounded-l"
          placeholder="Tape ta réponse ici"
        />
        <button
          onClick={verifierReponse}
          className="bg-blue-500 text-white p-2 rounded-r"
        >
          Vérifier
        </button>
      </div>
      {message && (
        <Alert className={message.startsWith('Correct') ? 'bg-green-100' : 'bg-red-100'}>
          <AlertDescription className="flex items-center">
            {message.startsWith('Correct') ? (
              <CheckCircle2 className="h-4 w-4 mr-2" />
            ) : (
              <AlertCircle className="h-4 w-4 mr-2" />
            )}
            {message}
          </AlertDescription>
        </Alert>
      )}
      <div className="mt-4 text-center">
        <p>Score: {score}</p>
        <p>Niveau: {niveau}</p>
        {estEnModeTemps && <p>Temps restant: {tempsRestant}s</p>}
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <button
          onClick={changerMode}
          className="bg-purple-500 text-white p-2 rounded"
        >
          {`Changer pour les ${mode === 'jours' ? 'mois' : 'jours'}`}
        </button>
        <button
          onClick={toggleModeTemps}
          className={`p-2 rounded ${estEnModeTemps ? 'bg-red-500' : 'bg-green-500'} text-white`}
        >
          {estEnModeTemps ? 'Désactiver le chronomètre' : 'Activer le chronomètre'}
        </button>
        <button
          onClick={toggleModeAleatoire}
          className={`p-2 rounded ${estEnModeAleatoire ? 'bg-yellow-500' : 'bg-blue-500'} text-white`}
        >
          {estEnModeAleatoire ? 'Mode ordonné' : 'Mode aléatoire'}
        </button>
        <button
          onClick={() => setSonActive(!sonActive)}
          className="p-2 rounded bg-gray-500 text-white"
        >
          {sonActive ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>
      </div>
    </div>
  );
};

export default JeuTemps;
