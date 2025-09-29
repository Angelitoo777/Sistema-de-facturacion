import { Router } from 'express'
import { CronJob } from '../services/cronJob.services.js'

export const routesOfCronJob = Router()

routesOfCronJob.get('/calentar', CronJob.calentar)
