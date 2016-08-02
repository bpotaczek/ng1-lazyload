class OtherwiseRouterProvider {
    constructor() {
        this.otherwiseRouters = [];
    }

    registerRouter(path, func) {
        this.otherwiseRouters.unshift({path: path, router: func});
        return this;
    }

    $get($injector) {
        return new OtherwiseRouter(this.otherwiseRouters, $injector);
    }
}

class OtherwiseRouter {
    constructor(otherwiseRouters, $injector) {
        this.otherwiseRouters = otherwiseRouters;
        this.$injector = $injector;
    }

    getRouters() {
        return this.otherwiseRouters;
    }

    route(path) {
        this.otherwiseRouters
            .filter(obj => path.startsWith(obj.path))
            .forEach(function(route) {
                route.router(this.$injector);
            }, this);
    }
}

export {OtherwiseRouterProvider, OtherwiseRouter};