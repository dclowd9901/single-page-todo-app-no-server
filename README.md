Todo App in One Page with No Server
===================================

1. Clone this repo
2. Run `npm install` in the directory you cloned it to.
3. 
```
# Install global dependencies.  Depending on your user account you may need to
# gain elevated privileges using something like `sudo`.
npm install -g grunt-cli bower

# Optionally install coveralls (integration is baked in with Travis CI).
npm install -g coveralls

# Install NPM dependencies.
npm install

# Install Bower dependencies.
bower install
```
4. Run `grunt` to build a distributable version.
5. Go to the `/dist` folder of the directory and open the `index.html` file in a browser.
6. Enjoy!