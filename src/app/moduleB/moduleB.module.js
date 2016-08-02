import angular from 'angular';
import states from './moduleB.state';

import ComponentBComponent from '../componentB/componentB.component';

var app = angular.module('lazy.moduleB', ['lazy.core']);

app.component('componentB', ComponentBComponent);

app.config(($stateProvider, OtherwiseRouterProvider) => {
    [...states].forEach(state => $stateProvider.state(state));

    OtherwiseRouterProvider.registerRouter('/moduleB/', ($injector) => {
        console.log('lazy.moduleB - OtherwiseRouterProvider');
        var $state = $injector.get('$state');
        return $state.go('moduleB.step1');
    });
});

app.run(($transitions) => {
    console.log('lazy.moduleB loaded');
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