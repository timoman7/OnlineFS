let InvisibleCharacter = new RegExp(String.fromCharCode(13),'g');
let root = [];
// Object.defineProperty(Object.prototype, '__toArray__', {
//   value: function(){
//     let newArray = [];
//
//   }
// });
// Object.defineProperty(Object.prototype, '__map__', {
// 	value: function(cb){
// 		for(let _ in this){
// 			cb(this[_]);
//     }
//   },
// 	enumerable: false
// });
function getStructure(path, file, cb){
  fetch(`./${path.length>0?(path.join('/')+'/'):''}${file}`).then(function(r){
    if(r.status == 200 && r.ok == true){
      r.text().then(cb);
    }
  });
}
Object.defineProperty(Object.prototype, 'downPath', {
  value: function(){
    let currentPoint = this;
    [...arguments].forEach(function(p){
      currentPoint = currentPoint[p];
    });
    return currentPoint;
  },
  writable: false,
  enumerable: false
});
function composeFolder(path){
  getStructure(path,'files.prn',function(t){
    let arr = t.replace(InvisibleCharacter, '').split('\n').filter(o=>o!='');
    arr.forEach(function(f){
      root.downPath(...path).push({name: f});
    });
    // let path_ = [...path];
    // path_.pop();
    // root.downPath(...path_)[path[path.length-1]] = JSON.parse(JSON.stringify(Object.assign({},root.downPath(...path))));
  });
  getStructure(path,'folders.prn',function(t){
    let arr = t.replace(InvisibleCharacter,'').split('\n').filter(o=>o!='');
    arr.forEach(function(f){
      root.downPath(...path)[f] = [];
      composeFolder(path.concat(f));
    });
  });
}
(async function main(){
  composeFolder([]);
  var app = angular.module('app', []);
  app.service('getRoot', function(){
    // let _root = {};
    // (async function(){
    // function recur(p, n){
    //   console.log(p)
    //   for(let kn in p){
    //     let child = p[kn];
    //     console.log('p:',p,'\nn:',n,'\nkn:',kn,'\nchild:',child)
    //   }
    // }
    // recur(root);
    // })();
    this.root = Object.assign({}, root);
  });
  app.controller("page", [
    '$scope',
    'getRoot',
    function($scope, getRoot) {
      $scope.flatten = function(e){
        return Object.assign({}, e);
      };
      $scope.concat = function(){
        return [].concat(...[...arguments]);
      };
      $scope.conlog = console.log;
      $scope.fromJson = angular.fromJson;
      $scope.toJson = angular.toJson;
      $scope.map = Array.prototype.map;
      $scope.isObject = angular.isObject;
      $scope.isArray = angular.isArray;
      window.myScope = $scope;
      $scope.root = Object.assign({}, root);/*function(){
        return getRoot.root;
      };*/
    }
  ]);
})();
setInterval(function(){
  myScope.$apply();
}, 500);
