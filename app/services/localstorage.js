define('services/localstorage', ['lodash', 'backbone'], function(_, Backbone) {
  
  /**
   * Overrides Backbone's base-level sync method. Since Backbone usually
   * expects to interact with a backend server, we had to basically rewrite
   * a localstorage interface from scratch. (sure, we could've probably stolen
   * one, but where's the fun in that?)
   * 
   * @param  {String} method Type of method to utilize (create, read, update or delete)
   * @param  {Object} model  Model being updated
   * @param  {Object} opts   Arbitrary set of options to follow the process around.
   * @return {Various}       Depending on the operation, the user might expect
   *                         any number of return values.
   */
  Backbone.sync = function(method, model, opts) {
    return api[method].apply(this, [model, opts]);
  };

  var api = {
    /**
     * We create the store in LocalStorage in this name. Should be as unique as
     * possible.
     * 
     * @type {String}
     */
    namespace: 'JAMA-TEST-DAVID-DREW',

    /**
     * A convenience var for the local storage.
     * @type {Native}
     */
    ls: window.localStorage,

    /**
     * A local, deserialized representation of the store. The one in LocalStorage
     * is a stringified JSON object.
     * 
     * @type {Object}
     */
    store: {},

    /**
     * Another dumb override to keep Backbone quiet.
     * @type {String}
     */
    url: '',

    /**
     * Creates a new record for the collection defined in the options.
     * 
     * @param  {Object} model Backbone model being operated on.
     * @param  {Object} opts  Set of arbitrary options the user has provided.
     * @return {Array}        A collection of the model in question.       
     */
    create: function(model, opts) {
      var collection = JSON.parse(api.ls.getItem(api.namespace))[opts.table] || [];

      collection = collection || [];
      model.set({id: collection.length});
      collection.push(model);
      api.store[opts.table] = collection;

      api.ls.setItem(api.namespace, JSON.stringify(api.store));

      return collection;
    },

    /**
     * Reads from the store and updates the collection
     * 
     * @param  {Object} model Backbone model being operated on.
     * @param  {Object} opts  Set of arbitrary options the user has provided.
     * @return {Array}        A collection of the model in question.   
     */
    read: function(model, opts) {
      api.store = JSON.parse(api.ls.getItem(api.namespace));

      api.store[opts.table] = api.store[opts.table] || [];

      // A model made the call
      if (model.collection) {
        model.collection.set(api.store[opts.table]);
      } else {
      // A collection made the call
        this.set(api.store[opts.table]);
      }
      
      return api.store[opts.table];
    },

    /**
     * Finds a record in the collection, updates it, then reinserts the collection
     * into the LocalStorage.
     * 
     * @param  {Object} model Backbone model being operated on.
     * @param  {Object} opts  Set of arbitrary options the user has provided.
     * @return {Array}        A collection of the model in question.   
     */
    update: function(model, opts) {
      var collection  = JSON.parse(api.ls.getItem(api.namespace))[opts.table] || [],
          recordIndex = _.findIndex(collection, function(record){
            return record.id === model.get('id');
          });

      collection[recordIndex] = model.attributes;
      api.store[opts.table] = collection;

      api.ls.setItem(api.namespace, JSON.stringify(api.store));

      return collection;
    },

    /**
     * Finds a record in the collection by id, then deletes it.
     * 
     * @param  {Object} model Backbone model being operated on.
     * @param  {Object} opts  Set of arbitrary options the user has provided.
     * @return {Array}        A collection of the model in question.   
     */
    delete: function(model, opts) {
      var collection = JSON.parse(api.ls.getItem(api.namespace))[opts.table] || [],
          recordIndex = _.findIndex(collection, function(record){
            return record.id === model.get('id');
          });

      collection.splice(recordIndex, 1);
      api.store[opts.table] = collection;

      api.ls.setItem(api.namespace, JSON.stringify(api.store));

      return collection;
    }
  };

  // Bootstrap store
  if (!api.ls.getItem(api.namespace)) {
    api.ls.setItem(api.namespace, '{}');
  }
});