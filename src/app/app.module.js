import angular from 'angular';
import core from './core/core.module';

import { AppComponent } from './app.component';
import { LazyLoadService } from './lazyLoad.service';
import { OtherwiseRouterProvider } from './otherwiseRouter.provider';

import * as style from '../style/main.scss';

var app = angular.module('lazy.main', [
    'lazy.core',
    'oc.lazyLoad'
]);

app
    .service('LazyLoadService', LazyLoadService)
    .provider('OtherwiseRouter', OtherwiseRouterProvider)
    .component('lazyApp', AppComponent);

const pattern = /\/(moduleA|moduleB)\/.+$/g;
let lastPath = '';

app.config(($urlRouterProvider, OtherwiseRouterProvider) => {
    OtherwiseRouterProvider.registerRouter('/', ($injector) => console.log('app.module - OtherwiseRouterProvider'));
    $urlRouterProvider.otherwise(function($injector, $location) {
        let path = $location.path();
        console.log('global otherwise');
        console.log(path);
        if (path == lastPath) {
            let router = $injector.get('OtherwiseRouter');
            router.route(path);
        } else {
            lastPath = path;
            if (path.match(pattern)) {
                let $urlRouter = $injector.get('$urlRouter');
                let lazyLoad = $injector.get('LazyLoadService');
                lazyLoad.load(path).then(() => {
                    $urlRouter.sync();  
                }).catch(err => {
                    console.log(err);
                })
            } else {
                // Eventually this should go to 404
                console.log('Path not found: ' + path);
            }
        }
    });
});

app.run(($transitions) => {
    console.log('lazy.main loaded');
    $transitions.onBefore(true, ($transition$) => {
        console.log('Changing to state: ' + $transition$.to().name);
    });
    $transitions.onError(true, ($transition$) => {
        console.log('Error when changing to state: ' + $transition$.to().name + ' from state ' + $transition$.from().name);
    });
    $transitions.onSuccess(true, ($transition$) => {
        console.log('Changed to state: ' + $transition$.to().name);
    });
});

export default app;