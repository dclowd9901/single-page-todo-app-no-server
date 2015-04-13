define(function(require){
  "use strict";

  var LS;
  var Backbone = require('backbone');
  var modelMock;
  var collectionMock;
  var optsMock = {
    table: 'foo'
  };

  beforeEach(function() {
    LS = require('services/localstorage');
    modelMock = collectionMock = {
      set: function(){
        modelMock.setArgs = arguments;
      }
    };

    LS.ls = {
      setItem: function() {
        LS.ls.setItemArgs = arguments;
      },
      getItem: function() {}
    };

    JSON.parse = function() {
      return {'foo': []}
    };

    JSON.stringify = function() {
      return 'foo';
    };    
  })

  describe('sync override', function() {
    it('Should set a function on Backbone.sync', function() {
      var LS = require('services/localstorage');

      assert(Backbone.sync === LS.syncOverride);
    });
  });

  describe('create', function() {
    it('should set an id on the model the length of the collection', function() {
      var collection = LS.create(modelMock, {table: 'foo'});

      assert(collection[0].setArgs[0].id === 0);
    });

    it('should setItem on the LocalStorage at the namespace', function() {
      var collection = LS.create(modelMock, {table: 'foo'});

      assert(LS.ls.setItemArgs[0] === LS.namespace);
      assert(LS.ls.setItemArgs[1] === 'foo');
    });
  });

  describe('read', function() {
    it('should return the table on the store', function() {
      LS.store = {'foo': 'bar'};
      var result = LS.read({collection: collectionMock}, {table: 'foo'});

      assert(result.length === 0);
    });

    it('should call this.set if not a model', function() {
      var result = LS.read.apply(collectionMock, [undefined, {table: 'foo'}]);

      assert(collectionMock.setArgs[0].length === 0);
    });
  });

  describe('update', function() {
    it('should retrieve the model and update it in the collection', function() {

      JSON.parse = function() {
        return {foo:[{id: 0}]};
      };

      var result = LS.update({attributes: 'bar', get: function(){ return 0; }}, {table: 'foo'});

      console.log(result[0]);
      assert.equal('bar', result[0]);
    });

    it('should set a stringified JSON in the namespace', function() {
      JSON.parse = function() {
        return {foo:[{id: 0}]};
      };

      JSON.stringify = function() {
        return 'hippo';
      }

      var result = LS.update({attributes: 'bar', get: function(){ return 0; }}, {table: 'foo'});

      assert.equal(LS.ls.setItemArgs[0], LS.namespace);
      assert.equal(LS.ls.setItemArgs[1], 'hippo');
    });
  });
});