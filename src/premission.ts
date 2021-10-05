import router from '../src/router/index';
import { Route } from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({ showSpinner: false });
router.beforeEach(async (to: Route, from: Route, next: any) => {
    NProgress.start();
    next();

})

router.afterEach(() => {
    NProgress.done();
});