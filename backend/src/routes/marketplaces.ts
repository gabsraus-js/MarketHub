import { Router } from 'express'
import {
  getMarketplaces,
  getMarketplace,
  joinMarketplace,
  leaveMarketplace,
} from '../controllers/marketplacesController'

const router = Router()

router.get('/', getMarketplaces)
router.get('/:id', getMarketplace)
router.post('/:id/join', joinMarketplace)
router.delete('/:id/leave', leaveMarketplace)

export default router
