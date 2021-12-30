import history from 'connect-history-api-fallback';
import Router from 'express-promise-router';
import serveStatic from 'serve-static';
import compression from 'compression';

import { CLIENT_DIST_PATH, PUBLIC_PATH, UPLOAD_PATH } from '../paths';

const router = Router();

// SPA 対応のため、ファイルが存在しないときに index.html を返す
router.use(history());

router.use(compression())

function setCustomCacheControl(res, path) {
  res.setHeader('Cache-Control', 'public, max-age=3600000')
}

router.use(
  serveStatic(UPLOAD_PATH, {
    etag: false,
    lastModified: false,
    setHeaders: setCustomCacheControl,
  }),
);

router.use(
  serveStatic(PUBLIC_PATH, {
    etag: false,
    lastModified: false,
    setHeaders: setCustomCacheControl,
  }),
);

router.use(
  serveStatic(CLIENT_DIST_PATH, {
    etag: false,
    lastModified: false,
    setHeaders: setCustomCacheControl,
  }),
);

export { router as staticRouter };
