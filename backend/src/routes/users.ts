import { Router } from 'express'
import { getUser, updateUser, getUserMarketplaces } from '../controllers/usersController'

const router = Router()

router.get('/:id', getUser)
router.patch('/:id', updateUser)
router.get('/:id/marketplaces', getUserMarketplaces)

export default router
