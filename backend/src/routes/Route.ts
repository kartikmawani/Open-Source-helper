import express from 'express';
import passport from 'passport'
import {Authentication} from '../middlewares/authMiddleware.js'
import {githubController} from '../controllers/github.Controller.js'
import {logicController} from '../controllers/logicController.js'
import {refreshController} from  '../controllers/refreshController.js' 
import {helperController} from '../controllers/helpController.js'
const Router=express();
Router.get('/auth/github',passport.authenticate('github',{
    scope:['public_repo','user:email','read:user']
}))
Router.get('/auth/github/callback', passport.authenticate('github', { 
  failureRedirect: 'http://localhost/login',
  session:true
 }),
  (req, res) => {
    res.redirect('http://localhost/');
  });
   

Router.get('/current_user',refreshController);
 
Router.get('/repos/',Authentication,githubController)
Router.post('/analyze/:repos',Authentication,logicController)
Router.post('/Aihelp',Authentication,helperController)

export default Router;


 