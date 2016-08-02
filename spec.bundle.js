var tests = require.context('./src', true, /\.spec\.js/);

tests.keys().forEach(tests);