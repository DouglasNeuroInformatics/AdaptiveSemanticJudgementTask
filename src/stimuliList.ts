import type { WordPairStimulus } from "./schemas";

const stimuliList = [
  // Difficulty Level 1
  {
    stimulus: "Dog1R",
    prompt: "Cat",
    difficultyLevel: 1,
    language: "en",
    relation: "related",
  },
  {
    stimulus: "Table1UR",
    prompt: "Cloud",
    difficultyLevel: 1,
    language: "en",
    relation: "unrelated",
  },
  {
    stimulus: "Hot1R",
    prompt: "Cold",
    difficultyLevel: 1,
    language: "en",
    relation: "related",
  },
  {
    stimulus: "Black1R",
    prompt: "White",
    difficultyLevel: 1,
    language: "en",
    relation: "related",
  },
  {
    stimulus: "Chair1UR",
    prompt: "Rain",
    difficultyLevel: 1,
    language: "en",
    relation: "unrelated",
  },
  {
    stimulus: "Sun1R",
    prompt: "Moon",
    difficultyLevel: 1,
    language: "en",
    relation: "related",
  },

  // Difficulty Level 2
  {
    stimulus: "Happy2R",
    prompt: "Smile",
    difficultyLevel: 2,
    language: "en",
    relation: "related",
  },
  {
    stimulus: "Book2UR",
    prompt: "Sand",
    difficultyLevel: 2,
    language: "en",
    relation: "unrelated",
  },
  {
    stimulus: "Fish2R",
    prompt: "Swim",
    difficultyLevel: 2,
    language: "en",
    relation: "related",
  },
  {
    stimulus: "Bird2R",
    prompt: "Wing",
    difficultyLevel: 2,
    language: "en",
    relation: "related",
  },
  {
    stimulus: "Shoe2UR",
    prompt: "Pizza",
    difficultyLevel: 2,
    language: "en",
    relation: "unrelated",
  },
  {
    stimulus: "Paint2R",
    prompt: "Brush",
    difficultyLevel: 2,
    language: "en",
    relation: "related",
  },

  // Difficulty Level 3
  {
    stimulus: "Doctor3R",
    prompt: "Hospital",
    difficultyLevel: 3,
    language: "en",
    relation: "related",
  },
  {
    stimulus: "Piano3UR",
    prompt: "Forest",
    difficultyLevel: 3,
    language: "en",
    relation: "unrelated",
  },
  {
    stimulus: "Garden3R",
    prompt: "Flower",
    difficultyLevel: 3,
    language: "en",
    relation: "related",
  },
  {
    stimulus: "Teacher3R",
    prompt: "Classroom",
    difficultyLevel: 3,
    language: "en",
    relation: "related",
  },
  {
    stimulus: "Ocean3UR",
    prompt: "Computer",
    difficultyLevel: 3,
    language: "en",
    relation: "unrelated",
  },
  {
    stimulus: "Chef3R",
    prompt: "Kitchen",
    difficultyLevel: 3,
    language: "en",
    relation: "related",
  },

  // Difficulty Level 4
  {
    stimulus: "Orchestra4R",
    prompt: "Symphony",
    difficultyLevel: 4,
    language: "en",
    relation: "related",
  },
  {
    stimulus: "Mountain4UR",
    prompt: "Pencil",
    difficultyLevel: 4,
    language: "en",
    relation: "unrelated",
  },
  {
    stimulus: "Democracy4R",
    prompt: "Freedom",
    difficultyLevel: 4,
    language: "en",
    relation: "related",
  },
  {
    stimulus: "Philosophy4R",
    prompt: "Wisdom",
    difficultyLevel: 4,
    language: "en",
    relation: "related",
  },
  {
    stimulus: "Theatre4UR",
    prompt: "Chemistry",
    difficultyLevel: 4,
    language: "en",
    relation: "unrelated",
  },
  {
    stimulus: "Justice4R",
    prompt: "Law",
    difficultyLevel: 4,
    language: "en",
    relation: "related",
  },

  // Difficulty Level 5
  {
    stimulus: "Photosynthesis5R",
    prompt: "Chlorophyll",
    difficultyLevel: 5,
    language: "en",
    relation: "related",
  },
  {
    stimulus: "Quantum5UR",
    prompt: "Literature",
    difficultyLevel: 5,
    language: "en",
    relation: "unrelated",
  },
  {
    stimulus: "Algorithm5R",
    prompt: "Computation",
    difficultyLevel: 5,
    language: "en",
    relation: "related",
  },
  {
    stimulus: "Thermodynamics5R",
    prompt: "Entropy",
    difficultyLevel: 5,
    language: "en",
    relation: "related",
  },
  {
    stimulus: "Metaphysics5UR",
    prompt: "Basketball",
    difficultyLevel: 5,
    language: "en",
    relation: "unrelated",
  },
  {
    stimulus: "Neuroscience5R",
    prompt: "Synapse",
    difficultyLevel: 5,
    language: "en",
    relation: "related",
  },
  // Difficulty Level 6
  {
    stimulus: "Epistemology6R",
    prompt: "Knowledge",
    difficultyLevel: 6,
    language: "en",
    relation: "related",
  },
  {
    stimulus: "Cytokine6UR",
    prompt: "Symphony",
    difficultyLevel: 6,
    language: "en",
    relation: "unrelated",
  },
  {
    stimulus: "Mitochondria6R",
    prompt: "ATP",
    difficultyLevel: 6,
    language: "en",
    relation: "related",
  },
  {
    stimulus: "Oligarchy6R",
    prompt: "Plutocrat",
    difficultyLevel: 6,
    language: "en",
    relation: "related",
  },
  {
    stimulus: "Dialectic6UR",
    prompt: "Photon",
    difficultyLevel: 6,
    language: "en",
    relation: "unrelated",
  },
  {
    stimulus: "Paradigm6R",
    prompt: "Framework",
    difficultyLevel: 6,
    language: "en",
    relation: "related",
  },

  // Difficulty Level 7
  {
    stimulus: "Hermeneutics7R",
    prompt: "Interpretation",
    difficultyLevel: 7,
    language: "en",
    relation: "related",
  },
  {
    stimulus: "Apoptosis7UR",
    prompt: "Democracy",
    difficultyLevel: 7,
    language: "en",
    relation: "unrelated",
  },
  {
    stimulus: "Ontology7R",
    prompt: "Existence",
    difficultyLevel: 7,
    language: "en",
    relation: "related",
  },
  {
    stimulus: "Ubiquitin7R",
    prompt: "Proteolysis",
    difficultyLevel: 7,
    language: "en",
    relation: "related",
  },
  {
    stimulus: "Phenomenology7UR",
    prompt: "Chromosome",
    difficultyLevel: 7,
    language: "en",
    relation: "unrelated",
  },
  {
    stimulus: "Entropy7R",
    prompt: "Disorder",
    difficultyLevel: 7,
    language: "en",
    relation: "related",
  },

  // Difficulty Level 8
  {
    stimulus: "Eigenvalue8R",
    prompt: "Matrix",
    difficultyLevel: 8,
    language: "en",
    relation: "related",
  },
  {
    stimulus: "Telomere8UR",
    prompt: "Capitalism",
    difficultyLevel: 8,
    language: "en",
    relation: "unrelated",
  },
  {
    stimulus: "Qualia8R",
    prompt: "Consciousness",
    difficultyLevel: 8,
    language: "en",
    relation: "related",
  },
  {
    stimulus: "Stochastic8R",
    prompt: "Random",
    difficultyLevel: 8,
    language: "en",
    relation: "related",
  },
  {
    stimulus: "Autopoiesis8UR",
    prompt: "Velocity",
    difficultyLevel: 8,
    language: "en",
    relation: "unrelated",
  },
  {
    stimulus: "Deontology8R",
    prompt: "Duty",
    difficultyLevel: 8,
    language: "en",
    relation: "related",
  },

  // Difficulty Level 9
  {
    stimulus: "Escherichia9R",
    prompt: "Bacterium",
    difficultyLevel: 9,
    language: "en",
    relation: "related",
  },
  {
    stimulus: "Noumenon9UR",
    prompt: "Ecosystem",
    difficultyLevel: 9,
    language: "en",
    relation: "unrelated",
  },
  {
    stimulus: "Supervenience9R",
    prompt: "Emergence",
    difficultyLevel: 9,
    language: "en",
    relation: "related",
  },
  {
    stimulus: "Higgs9R",
    prompt: "Boson",
    difficultyLevel: 9,
    language: "en",
    relation: "related",
  },
  {
    stimulus: "Apoptosis9UR",
    prompt: "Metaphor",
    difficultyLevel: 9,
    language: "en",
    relation: "unrelated",
  },
  {
    stimulus: "Axiomatic9R",
    prompt: "Foundational",
    difficultyLevel: 9,
    language: "en",
    relation: "related",
  },

  // french
  //
  {
    stimulus: "Chien1R",
    prompt: "Chat",
    difficultyLevel: 1,
    language: "fr",
    relation: "related",
  },
  {
    stimulus: "Table1UR",
    prompt: "Nuage",
    difficultyLevel: 1,
    language: "fr",
    relation: "unrelated",
  },
  {
    stimulus: "Chaud1R",
    prompt: "Froid",
    difficultyLevel: 1,
    language: "fr",
    relation: "related",
  },
  {
    stimulus: "Noir1R",
    prompt: "Blanc",
    difficultyLevel: 1,
    language: "fr",
    relation: "related",
  },
  {
    stimulus: "Chaise1UR",
    prompt: "Pluie",
    difficultyLevel: 1,
    language: "fr",
    relation: "unrelated",
  },
  {
    stimulus: "Soleil1R",
    prompt: "Lune",
    difficultyLevel: 1,
    language: "fr",
    relation: "related",
  },

  // Level 2
  {
    stimulus: "Heureux2R",
    prompt: "Sourire",
    difficultyLevel: 2,
    language: "fr",
    relation: "related",
  },
  {
    stimulus: "Livre2UR",
    prompt: "Sable",
    difficultyLevel: 2,
    language: "fr",
    relation: "unrelated",
  },
  {
    stimulus: "Poisson2R",
    prompt: "Nager",
    difficultyLevel: 2,
    language: "fr",
    relation: "related",
  },
  {
    stimulus: "Oiseau2R",
    prompt: "Aile",
    difficultyLevel: 2,
    language: "fr",
    relation: "related",
  },
  {
    stimulus: "Chaussure2UR",
    prompt: "Pizza",
    difficultyLevel: 2,
    language: "fr",
    relation: "unrelated",
  },
  {
    stimulus: "Peinture2R",
    prompt: "Pinceau",
    difficultyLevel: 2,
    language: "fr",
    relation: "related",
  },

  // Level 3
  {
    stimulus: "Médecin3R",
    prompt: "Hôpital",
    difficultyLevel: 3,
    language: "fr",
    relation: "related",
  },
  {
    stimulus: "Piano3UR",
    prompt: "Forêt",
    difficultyLevel: 3,
    language: "fr",
    relation: "unrelated",
  },
  {
    stimulus: "Jardin3R",
    prompt: "Fleur",
    difficultyLevel: 3,
    language: "fr",
    relation: "related",
  },
  {
    stimulus: "Professeur3R",
    prompt: "Salle de classe",
    difficultyLevel: 3,
    language: "fr",
    relation: "related",
  },
  {
    stimulus: "Océan3UR",
    prompt: "Ordinateur",
    difficultyLevel: 3,
    language: "fr",
    relation: "unrelated",
  },
  {
    stimulus: "Chef3R",
    prompt: "Cuisine",
    difficultyLevel: 3,
    language: "fr",
    relation: "related",
  },

  // Level 4
  {
    stimulus: "Orchestre4R",
    prompt: "Symphonie",
    difficultyLevel: 4,
    language: "fr",
    relation: "related",
  },
  {
    stimulus: "Montagne4UR",
    prompt: "Crayon",
    difficultyLevel: 4,
    language: "fr",
    relation: "unrelated",
  },
  {
    stimulus: "Démocratie4R",
    prompt: "Liberté",
    difficultyLevel: 4,
    language: "fr",
    relation: "related",
  },
  {
    stimulus: "Philosophie4R",
    prompt: "Sagesse",
    difficultyLevel: 4,
    language: "fr",
    relation: "related",
  },
  {
    stimulus: "Théâtre4UR",
    prompt: "Chimie",
    difficultyLevel: 4,
    language: "fr",
    relation: "unrelated",
  },
  {
    stimulus: "Justice4R",
    prompt: "Loi",
    difficultyLevel: 4,
    language: "fr",
    relation: "related",
  },
  // Level 5
  {
    stimulus: "Photosynthèse5R",
    prompt: "Chlorophylle",
    difficultyLevel: 5,
    language: "fr",
    relation: "related",
  },
  {
    stimulus: "Quantique5UR",
    prompt: "Littérature",
    difficultyLevel: 5,
    language: "fr",
    relation: "unrelated",
  },
  {
    stimulus: "Algorithme5R",
    prompt: "Calcul",
    difficultyLevel: 5,
    language: "fr",
    relation: "related",
  },
  {
    stimulus: "Thermodynamique5R",
    prompt: "Entropie",
    difficultyLevel: 5,
    language: "fr",
    relation: "related",
  },
  {
    stimulus: "Métaphysique5UR",
    prompt: "Basketball",
    difficultyLevel: 5,
    language: "fr",
    relation: "unrelated",
  },
  {
    stimulus: "Neuroscience5R",
    prompt: "Synapse",
    difficultyLevel: 5,
    language: "fr",
    relation: "related",
  },

  // Level 6
  {
    stimulus: "Épistémologie6R",
    prompt: "Connaissance",
    difficultyLevel: 6,
    language: "fr",
    relation: "related",
  },
  {
    stimulus: "Cytokine6UR",
    prompt: "Symphonie",
    difficultyLevel: 6,
    language: "fr",
    relation: "unrelated",
  },
  {
    stimulus: "Mitochondrie6R",
    prompt: "ATP",
    difficultyLevel: 6,
    language: "fr",
    relation: "related",
  },
  {
    stimulus: "Oligarchie6R",
    prompt: "Ploutocrate",
    difficultyLevel: 6,
    language: "fr",
    relation: "related",
  },
  {
    stimulus: "Dialectique6UR",
    prompt: "Photon",
    difficultyLevel: 6,
    language: "fr",
    relation: "unrelated",
  },
  {
    stimulus: "Paradigme6R",
    prompt: "Cadre",
    difficultyLevel: 6,
    language: "fr",
    relation: "related",
  },

  // Level 7
  {
    stimulus: "Herméneutique7R",
    prompt: "Interprétation",
    difficultyLevel: 7,
    language: "fr",
    relation: "related",
  },
  {
    stimulus: "Apoptose7UR",
    prompt: "Démocratie",
    difficultyLevel: 7,
    language: "fr",
    relation: "unrelated",
  },
  {
    stimulus: "Ontologie7R",
    prompt: "Existence",
    difficultyLevel: 7,
    language: "fr",
    relation: "related",
  },
  {
    stimulus: "Ubiquitine7R",
    prompt: "Protéolyse",
    difficultyLevel: 7,
    language: "fr",
    relation: "related",
  },
  {
    stimulus: "Phénoménologie7UR",
    prompt: "Chromosome",
    difficultyLevel: 7,
    language: "fr",
    relation: "unrelated",
  },
  {
    stimulus: "Entropie7R",
    prompt: "Désordre",
    difficultyLevel: 7,
    language: "fr",
    relation: "related",
  },

  // Level 8
  {
    stimulus: "Valeur Propre8R",
    prompt: "Matrice",
    difficultyLevel: 8,
    language: "fr",
    relation: "related",
  },
  {
    stimulus: "Télomère8UR",
    prompt: "Capitalisme",
    difficultyLevel: 8,
    language: "fr",
    relation: "unrelated",
  },
  {
    stimulus: "Qualia8R",
    prompt: "Conscience",
    difficultyLevel: 8,
    language: "fr",
    relation: "related",
  },
  {
    stimulus: "Stochastique8R",
    prompt: "Aléatoire",
    difficultyLevel: 8,
    language: "fr",
    relation: "related",
  },
  {
    stimulus: "Autopoïèse8UR",
    prompt: "Vélocité",
    difficultyLevel: 8,
    language: "fr",
    relation: "unrelated",
  },
  {
    stimulus: "Déontologie8R",
    prompt: "Devoir",
    difficultyLevel: 8,
    language: "fr",
    relation: "related",
  },

  // Level 9
  {
    stimulus: "Escherichia9R",
    prompt: "Bactérie",
    difficultyLevel: 9,
    language: "fr",
    relation: "related",
  },
  {
    stimulus: "Noumène9UR",
    prompt: "Écosystème",
    difficultyLevel: 9,
    language: "fr",
    relation: "unrelated",
  },
  {
    stimulus: "Survenance9R",
    prompt: "Émergence",
    difficultyLevel: 9,
    language: "fr",
    relation: "related",
  },
  {
    stimulus: "Higgs9R",
    prompt: "Boson",
    difficultyLevel: 9,
    language: "fr",
    relation: "related",
  },
  {
    stimulus: "Apoptose9UR",
    prompt: "Métaphore",
    difficultyLevel: 9,
    language: "fr",
    relation: "unrelated",
  },
  {
    stimulus: "Axiomatique9R",
    prompt: "Fondamental",
    difficultyLevel: 9,
    language: "fr",
    relation: "related",
  },
] as WordPairStimulus[];

export { stimuliList };
