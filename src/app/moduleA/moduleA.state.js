let states = [
    {
        name: 'moduleA', 
        url: '/moduleA',
        abstract: true
    },
    {
        name: 'moduleA.step1',
        url: '/step1',
        views: {
            'main@': {
                component: 'componentA'
            }
        }
    }
];

export default states;
