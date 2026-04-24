import { test, expect } from '@playwright/test';

const REPO_NAME = 'Task-Manager';

 

test.describe('Analysis API', () => {
   
  
  
  test('should create an analysis report from a valid repo', async ({ request }) => {
    // This hits http://localhost:4000/analyze/test-repo-1
    test.setTimeout(100000);
    const response = await request.post(`/api/analyze/${REPO_NAME}`, {
      data: {
        
        depth: 'full'
      }
    });

   
    expect(response.status()).toBe(200);
    const body = await response.json();
    // Ensure these match your logicController res.json()
    expect(body).toHaveProperty('aiAnalysis');
    expect(body.message).toBe('The Suggestion is Completed');
    
 
  });

  test('should return 404 for a non-existent repo', async ({ request }) => {
    const response = await request.post('/api/analyze/non-existent-repo');
    expect(response.status()).toBe(404);
  });
});