const express = require('express')
const homeController = require('../controller/home.controller')
const authController = require('../controller/auth.controller')
const middleware = require('../../middleware/index.middleware')

const router = express.Router()

router.get('/', middleware.isLogin, homeController.home)
router.get('/chat', middleware.checkAuth, homeController.chat)
router.post('/change-name', middleware.checkAuth, homeController.changGroupName)
router.post('/appoint-admin-group', middleware.checkAuth, homeController.appointGroupAdmin)
router.post('/create-or-add-chat-list-personal', middleware.checkAuth, homeController.createOrAddChatListPersonal)
router.post('/add-user-to-groups', middleware.checkAuth, homeController.addUserToGroups)
router.post('/hide-chat-list', middleware.checkAuth, homeController.hideChatList)
router.post('/kick-out-group', middleware.checkAuth, homeController.kickOutGroup)
router.post('/create-group-chat', middleware.checkAuth, homeController.createGroupChat)
router.post('/set-updatedAt-group-chat', middleware.checkAuth, homeController.setUpdatedGroupChat)
router.get('/chat/:idroom', middleware.checkAuth, homeController.chat)

module.exports = router
