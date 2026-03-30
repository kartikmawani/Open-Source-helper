import express from 'express';
import passport from 'passport'
import {Authentication} from '../Middleware/authMiddleware.js'
import {githubController} from '../Controller/github.Controller.js'
import {logicController} from '../Controller/logicController.js'
import {refreshController} from  '../Controller/refreshController.js' 
import {helperController} from '../Controller/helpController.js'
const Router=express();
Router.get('/auth/github',passport.authenticate('github',{
    scope:['public_repo','user:email','read:user']
}))
Router.get('/auth/github/callback', passport.authenticate('github', { 
  failureRedirect: 'http://localhost:5173/login',
  session:true
 }),
  (req, res) => {
    res.redirect('http://localhost:5173/');
  });
   

Router.get('/current_user',refreshController);
 
Router.get('/repos/',Authentication,githubController)
Router.post('/analyze/:repos',Authentication,logicController)
Router.get('/Aihelp',Authentication,helperController)

export default Router;