// Developer interface
export const createDeveloper = (id, name, role, latestPerformanceScore = 0, teamId = null) => ({
  id,
  name,
  role,
  latestPerformanceScore,
  teamId
});

// Team interface
export const createTeam = (id, name, description = '', color = 'blue') => ({
  id,
  name,
  description,
  color,
  createdAt: new Date().toISOString()
});

// Performance Report interface
export const createPerformanceReport = (
  id,
  developerId,
  month,
  questionScores,
  highlights = '',
  pointsToDevelop = ''
) => {
  // Calculate category averages and weighted final score
  const categoryScores = {};
  let totalWeightedScore = 0;

  Object.entries(EVALUATION_CATEGORIES).forEach(([categoryKey, category]) => {
    const categoryQuestions = category.questions;
    let categoryTotal = 0;
    let categoryWeightSum = 0;

    categoryQuestions.forEach(question => {
      const score = questionScores[question.key] || 0;
      categoryTotal += score * question.weight;
      categoryWeightSum += question.weight;
    });

    const categoryAverage = categoryWeightSum > 0 ? categoryTotal / categoryWeightSum : 0;
    categoryScores[categoryKey] = Math.round(categoryAverage * 100) / 100;
    totalWeightedScore += categoryAverage * category.weight;
  });

  return {
    id,
    developerId,
    month,
    questionScores,
    categoryScores,
    weightedAverageScore: Math.round(totalWeightedScore * 100) / 100,
    highlights,
    pointsToDevelop
  };
};

// Evaluation categories with questions and weights
export const EVALUATION_CATEGORIES = {
  commitment: { 
    label: 'Comprometimento e Disciplina', 
    weight: 0.30,
    questions: [
      { key: 'punctualityDeliveries', label: 'Pontualidade nas Entregas', weight: 3 },
      { key: 'punctualityRituals', label: 'Pontualidade em Rituais (Reuniões, Dailies)', weight: 2 },
      { key: 'hybridModelAdherence', label: 'Adesão ao Modelo Híbrido', weight: 1 }
    ]
  },
  technicalQuality: { 
    label: 'Qualidade e Execução Técnica', 
    weight: 0.40,
    questions: [
      { key: 'deliveryQuality', label: 'Qualidade das Entregas (código, poucos bugs)', weight: 4 },
      { key: 'taskAutonomy', label: 'Autonomia na Resolução de Tarefas', weight: 3 }
    ]
  },
  collaboration: { 
    label: 'Colaboração e Proatividade', 
    weight: 0.30,
    questions: [
      { key: 'proactivityImprovements', label: 'Proatividade e Sugestão de Melhorias', weight: 3 },
      { key: 'communicationQuality', label: 'Qualidade da Comunicação', weight: 2 },
      { key: 'teamCollaboration', label: 'Colaboração e Suporte à Equipe', weight: 2 }
    ]
  }
};

// Helper function to get all questions flattened
export const getAllQuestions = () => {
  const questions = [];
  Object.entries(EVALUATION_CATEGORIES).forEach(([categoryKey, category]) => {
    category.questions.forEach(question => {
      questions.push({
        ...question,
        categoryKey,
        categoryLabel: category.label
      });
    });
  });
  return questions;
};

