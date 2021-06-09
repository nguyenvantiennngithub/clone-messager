const db = require('../../db/connect.db')
const bcrypt = require('bcryptjs')
const sqlHelper = require('../../helpers/sqlHelper')



class authController{
    //[POST] /auth/checkLogin
    async checkLogin(req, res){
        const {username, password} = req.body
        var messageError = 'Wrong username or password'
        
        var flag = await sqlHelper.checkUser(username, password);
        
        if (flag){
            req.session.isAuth = true
            req.session.username = username
            messageError = ''
            res.redirect('/chat')
        }else{
            res.render('home', {
                messageError,
                username: username,
                password: password,
            })

        }
    }

    //[GET] /auth/register
    register(req, res){
        res.render('register', {
            nickname: '',
            username: '',
            password: '',
            messageError: ''
        })
    }

    //[POST] /auth/checkRegister
    async checkRegister(req, res){
        const saltRounds = 8
        const io = req.app.get('socketio');
        const {nickname, username, password, socketid} = req.body
        const hashPsw = bcrypt.hashSync(password, saltRounds);
        const fileName = "/uploads/"+req.file.filename;
        var isExistsUser = await sqlHelper.isExistsUser(username)
        if (!isExistsUser){
            sqlHelper.insertUser(username, nickname, hashPsw, socketid, fileName);
            io.emit('new user', {username, nickname})
            return res.redirect("/")
        }else{ 
            return res.render('register', {
                nickname: nickname,
                username: username,
                password: password,
                messageError: 'Username is available'
            })
        }

    }
    logout(req, res){
        req.session.destroy(function(err) {
            if (err) throw err
            res.redirect('/')
        })
    }
}


module.exports = new authController()
