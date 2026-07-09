import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

async function runTests() {
  console.log('=== DÉBUT DU TEST DES ENDPOINTS [ÉCOLE 221] ===\n');
  let testsCount = 0;
  let passedCount = 0;

  async function assertEndpoint(
    name: string,
    method: 'GET' | 'POST',
    path: string,
    data?: any,
    headers?: any
  ) {
    testsCount++;
    try {
      const response = await axios({
        method,
        url: `${BASE_URL}${path}`,
        data,
        headers,
        validateStatus: () => true, // Don't throw on error status
      });

      if (response.status >= 200 && response.status < 300) {
        console.log(`✅ [SUCCESS] ${name} (${method} ${path}) -> Status: ${response.status}`);
        passedCount++;
        return response.data;
      } else {
        console.log(`❌ [FAILURE] ${name} (${method} ${path}) -> Status: ${response.status}`);
        console.log(`   Response: ${JSON.stringify(response.data).substring(0, 150)}`);
      }
    } catch (err: any) {
      console.log(`❌ [ERROR] ${name} (${method} ${path}) failed with error: ${err.message}`);
    }
    return null;
  }

  // 1. Health Endpoint
  await assertEndpoint('API Health status', 'GET', '/health');

  // 2. Authentication Endpoint (Student login)
  console.log('\n--- Test de l\'authentification ---');
  const loginData = { email: 'etudiant221@gmail.com', password: 'ecole221' };
  const authRes = await assertEndpoint('Login Étudiant', 'POST', '/auth/login', loginData);
  const studentToken = authRes?.token;

  // 3. Authentication Endpoint (Vigil login)
  const vigilLoginData = { email: 'vigile221@gmail.com', password: 'ecole221' };
  const vigilAuthRes = await assertEndpoint('Login Vigile', 'POST', '/auth/login', vigilLoginData);
  const vigilToken = vigilAuthRes?.token;

  // 4. Student Endpoints
  if (studentToken) {
    console.log('\n--- Test des endpoints Étudiant ---');
    const authHeader = { Authorization: `Bearer ${studentToken}` };
    
    await assertEndpoint('Profil Étudiant', 'GET', '/student/profile', null, authHeader);
    await assertEndpoint('Liste des cours', 'GET', '/student/courses', null, authHeader);
    await assertEndpoint('Historique des présences', 'GET', '/student/attendances', null, authHeader);
    
    // Add/Update progress
    await assertEndpoint('Mise à jour progrès de cours', 'POST', '/student/courses/c-1/progress', { progress: 85 }, authHeader);
    // Add/Update mood
    await assertEndpoint('Mise à jour humeur', 'POST', '/student/mood', { mood: 'Motivé et concentré' }, authHeader);
  }

  // 5. Professor Endpoints
  console.log('\n--- Test des endpoints Professeur ---');
  const profHeader = { Authorization: 'Bearer fake-jwt-token-prof-221' };
  await assertEndpoint('Emploi du temps Professeur', 'GET', '/professor/schedule', null, profHeader);
  await assertEndpoint('Annulation séance de cours', 'POST', '/professor/schedule/sess-1/cancel', { reason: 'Réunion urgente' }, profHeader);
  await assertEndpoint('Planification séance de cours', 'POST', '/professor/schedule/sess-2/reschedule', { day: 'LUNDI', time: '10:00 - 12:00', room: 'Amphi C' }, profHeader);

  // 6. Vigil & Scanner Endpoints
  console.log('\n--- Test des endpoints Vigile & Scanner ---');
  await assertEndpoint('Profil Vigile', 'GET', '/vigil/profile');
  
  // Test dynamic scan behavior (using student matricule "221-M382" as badge ID)
  const scanResult = await assertEndpoint('Scan badge étudiant', 'POST', '/vigil/scan', { badgeId: '221-M382' });
  console.log('   Resultat du Scan:', JSON.stringify(scanResult));

  await assertEndpoint('Dernier scan enregistré', 'GET', '/vigil/last-scan');
  await assertEndpoint('Historique global des pointages', 'GET', '/vigil/check-ins');

  // Summary
  console.log(`\n=== RAPPORT DES TESTS: ${passedCount}/${testsCount} PASSÉS ===`);
}

runTests();
