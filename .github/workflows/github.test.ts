import { test, expect } from '@playwright/test';

const REPO_NAME = 'test-repo-1';

 

test.describe('Analysis API', () => {
  
  test('should create an analysis report from a valid repo', async ({ request }) => {
    // This hits http://localhost:4000/analyze/test-repo-1
    const response = await request.post(`/analyze/${REPO_NAME}`, {
      data: {
        
        depth: 'full'
      }
    });

   
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('roadmap');
    expect(body.status).toBe('completed');
  });

  test('should return 404 for a non-existent repo', async ({ request }) => {
    const response = await request.post('/analyze/non-existent-repo');
    expect(response.status()).toBe(404);
  });
});