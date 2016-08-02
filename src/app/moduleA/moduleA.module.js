import angular from 'angular';
import states from './moduleA.state';

import ComponentAComponent from '../componentA/componentA.component';

var app = angular.module('lazy.moduleA', ['lazy.core']);

app.component('componentA', ComponentAComponent);

app.config(($stateProvider, OtherwiseRouterProvider) => {
    [...states].forEach(state => $stateProvider.state(state));

    OtherwiseRouterProvider.registerRouter('/moduleA/', ($injector) => {
        console.log('lazy.moduleA - OtherwiseRouterProvider');
        var $state = $injector.get('$state');
        return $state.go('moduleA.step1');
    });
});

app.run(($transitions) => {
    console.log('lazy.moduleA loaded');
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