let states = [
    {
        name: 'moduleB', 
        url: '/moduleB',
        abstract: true
    },
    {
        name: 'moduleB.step1',
        url: '/step1',
        views: {
            'main@': {
                component: 'componentB'
            }
        }
    }
];

export default states;
