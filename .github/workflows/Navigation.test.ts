import {expect,test} from  '@playwright/test';

test('Navbar is working',async({page})=>{
    await page.goto('/');

    const Navbar=page.getByRole('navigation')
    const Gemini=Navbar.getByRole('link',{name:/gemini/i});

    await expect(Gemini).toBeVisible();

    await expect(Gemini).toBeEnabled();

    await Gemini.click()

    await expect(page).toHaveURL(/\/gemini$/);
})

test('User can generate a roadmap to solve the issue by sending github issue', async ({ page }) => {
    
    await page.goto('/gemini');
    const urlInput = page.getByPlaceholder(/paste github issue url/i);
    
    const generateBtn = page.getByRole('button', { name: /generate/i });
    
    await urlInput.fill('https://github.com/facebook/react/issues/12345');

    await generateBtn.click();
   
    await expect(page.getByText(/analyzing issue/i)).toBeVisible();
   
    const roadmapContainer = page.locator('.roadmap-container');  
    await expect(roadmapContainer).toBeVisible({ timeout: 15000 });  
 
    await expect(roadmapContainer).toContainText(/complexity/i);
    await expect(roadmapContainer).toContainText(/implementation steps/i);
});