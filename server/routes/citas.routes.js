import { Route, Router } from 'express';

import { getCitas } from '../controller/citas.controller.js';

const router = Router();

router.get("/citas",getCitas);

export default router;