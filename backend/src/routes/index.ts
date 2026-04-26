import { Router } from 'express'
import marketplacesRouter from './marketplaces'
import usersRouter from './users'
import productsRouter from './products'
import uploadRouter from './upload'

const router = Router()

router.use('/marketplaces', marketplacesRouter)
router.use('/users', usersRouter)
router.use('/products', productsRouter)
router.use('/upload', uploadRouter)

export default router
