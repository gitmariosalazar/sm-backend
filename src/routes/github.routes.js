import {Router} from "express";
import {clearToken, ConvertCSV, createToken, deleteToken, getToken, getTokens, searchRepositoriesByLanguage, searchRepositoriesByLanguages, setToken, tokenEnable, updateManyTokens, updateToken} from '../controllers/github.controller.js'
import {analyzeRepository} from "../controllers/components.controller.js";
import {verifyToken} from "../middlewares/authMiddleware.js";
const router = Router()

router.get('/searchrepository/:language/:quantity', verifyToken, searchRepositoriesByLanguage)
router.get('/average/:languages', verifyToken, searchRepositoriesByLanguages)
router.get('/convertcsv', ConvertCSV)
router.get('/components/:owner/:repo/:branch', analyzeRepository)
router.post('/addtoken', createToken)
router.get('/gettoken/:id', getToken)
router.get('/settoken/:id', setToken)
router.delete('/deletetoken/:id', deleteToken)
router.put('/updatetoken/:id', updateToken)
router.get('/findall', getTokens)
router.put('/revokeall', updateManyTokens)
router.get('/verify', tokenEnable)
router.get('/clear', clearToken)

export default router