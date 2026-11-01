import axios from 'axios';

// Directly calls your live Render backend
const API_BASE = 'https://ai-mystery-room-api-q69g.onrender.com/api';

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000
});

export const caseApi = {
  createCase: (premise, difficulty) => client.post('/cases', { premise, difficulty }).then(r => r.data),
  getCase: (id) => client.get('/cases/' + id).then(r => r.data),
  discoverClue: (caseId, clueId) => client.post('/cases/' + caseId + '/clues/' + clueId + '/discover').then(r => r.data),
  requestHint: (caseId) => client.post('/cases/' + caseId + '/hints').then(r => r.data),
  submitAccusation: (caseId, suspectId, notes) => client.post('/cases/' + caseId + '/accuse', { suspectId, notes }).then(r => r.data),
  getResult: (caseId) => client.get('/cases/' + caseId + '/result').then(r => r.data)
};

