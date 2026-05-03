import express from 'express';
import passport from 'passport'
import {Authentication} from '../middlewares/authMiddleware.js'
import {githubController} from '../controllers/github.Controller.js'
import {logicController} from '../controllers/logicController.js'
import {helperController} from '../controllers/helpController.js'
const Router = express.Router();

Router.get('/auth/github',passport.authenticate('github',{
    scope:['public_repo','user:email','read:user']
}))
Router.get('/auth/github/callback', passport.authenticate('github', { 
  failureRedirect:(process.env.FRONTEND_URL || 'http://localhost:5173') + '/login',
  session:true
 }),
  (req, res) => {
    res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173');
  });
   

Router.get('/current_user',Authentication,(req, res) => {
    res.json({
        loggedIn: true,
        user: req.user
    })});
 
Router.get('/repos/',Authentication,githubController)
Router.post('/analyze/:repoName',Authentication,logicController)
Router.post('/Aihelp',Authentication,helperController)

export default Router;


 