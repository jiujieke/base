import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';

@Module({ dynamic: true, store, name: 'app' })
class APP extends VuexModule {
    public isCollapse = false;

    get isCollapsed() {
        return this.isCollapse;
    }
    
    @Mutation
    public SET_ISCOLLAPSE(payload: boolean) {
        this.isCollapse = payload;
    }
}

export const AppState = getModule(APP);
