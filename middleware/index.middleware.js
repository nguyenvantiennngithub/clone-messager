const db = require('../db/connect.db')

class indexMiddleware{
    checkAuth(req, res, next){
        if (req.session.isAuth){
            res.locals.username = req.session.username
            res.locals.isAuth = req.session.isAuth
            const username = req.session.username
            var getNickNameCurrentUserSql = `select nickname from users where username='${username}'`
            db.query(getNickNameCurrentUserSql, (err, result)=>{
                if (err) throw err
                res.locals.nickname = result[0].nickname
                next()
            })
            // console.log("middle/idx/checkauth", req.session.username)
        }else{
            return res.render('home', {
                username: '',
                password: '',
                messageError: 'You need to login'
            })
        }
    }

    isLogin(req, res, next){
        if (req.session.isAuth){
            res.locals.username = req.session.username
            res.locals.isAuth = req.session.isAuth
            
            const username = req.session.username
            var getNickNameCurrentUserSql = `select nickname from users where username='${username}'`
            db.query(getNickNameCurrentUserSql, (err, result)=>{
                if (err) throw err
                res.locals.nickname = result[0].nickname
            })
            // console.log("middle/idx/checkauth", req.session.username)
        }
        next()
    }
    //dùng để redirect tới trang chat khi 
    //mà customer đã login nhưng lại ở trang home
    homeRedirect(req, res, next){
        if (req.session.isAuth){
            res.locals.username = req.session.username
            const currentUser = res.locals.username
            var idRoom
            var maxTime = 0
            var getRoomSql = `select * from rooms where username='${currentUser}' AND is_show=1`
            db.query(getRoomSql, (err, result)=>{
                if (err) throw err
                result.forEach((item)=>{
                    var updatedAt = new Date(item.updatedAt).getTime()
                    if (maxTime < updatedAt){
                        idRoom = item.id
                        maxTime = updatedAt
                    }
                })
                res.redirect(`/chat/${idRoom}`)
            })
        }
        else{
            res.render('home', {
                username: '',
                password: '',
                messageError: ''
            })
        }
    }
    
}

module.exports = new indexMiddleware()
