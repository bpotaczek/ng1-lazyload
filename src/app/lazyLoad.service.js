class LazyLoadService {
    constructor($ocLazyLoad, $q, $urlRouter) {
        this.$ocLazyLoad = $ocLazyLoad;
        this.$q = $q;
        this.$urlRouter = $urlRouter;
        this.paths = [
            { path: '/moduleA', modulePath: './moduleA/moduleA.module', name: 'lazy.moduleA' },
            { path: '/moduleB', modulePath: './moduleB/moduleB.module', name: 'lazy.moduleB' }
        ];
    }

    load(path) {
        let that = this;
        let mod = this.paths.find((m) => {
            return path.startsWith(m.path);
        });
        if (!mod) return this.$q.reject();
        return this.loadModule(mod).then((m) => {
            return that.$ocLazyLoad.load({name: mod.name});
        });
    }

    loadModule(mod) {
        // This has to have the hardcoded paths or it will not work.
        let deferred = this.$q.defer();
        if (mod.name === 'lazy.moduleA') {
            require.ensure([], function(require) {
                let m = require('./moduleA/moduleA.module');
                deferred.resolve(m);
            }, 'moduleA');
        } else {
            require.ensure([], function(require) {
                let m = require('./moduleB/moduleB.module');
                deferred.resolve(m);
            }, 'moduleB');
        }
        return deferred.promise;
    }

    loadTemplate(path) {
        let deferred = this.$q.defer();
        require([path], (html) => {
            deferred.resolve(html);
        });
        return deferred.promise;
    }
}

LazyLoadService.$inject = ['$ocLazyLoad', '$q', '$urlRouter'];

export {LazyLoadService};