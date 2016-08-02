# Angular Lazyloading with ocLazyload and UI-Router

To run:

```bash
# clone repo
$ git clone https://github.com/bpotaczek/ng1-lazyload.git mylazyload

# change directory
$ cd mylazyload

# install dependencies
$ npm install

# start server
$ npm run start
```

open [http://localhost:8080/#/](http://localhost:8080/#/) in your browser

open developer tools

change url to [http://localhost:8080/#/moduleA/step1](http://localhost:8080/#/moduleA/step1)
There should be a download of file moduleA.chunk.js

change url to [http://localhost:8080/#/moduleB/aaaa](http://localhost:8080/#/moduleB/aaaa)
There should be a download of file moduleB.chunk.js and it should change the url to /moduleB/step1
