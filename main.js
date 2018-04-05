let InvisibleCharacter = new RegExp(String.fromCharCode(13),'g');
let root = [];
function getStructure(path, file, cb){
  fetch(`./${path.length>0?(path.join('/')+'/'):''}${file}`).then((r)=>{
    if(r.status == 200 && r.ok == true){
      r.text().then(cb);
    }
  });
}
function deepRecursion(src, dest){
  console.log('Deep Recursion start:', src, dest)
  for(let a in src){
    let kn = a, kv = src[a];
    if(kv instanceof Array){

    }else{
      dest.push(kv);
    }
  }
}
angular.deepCopy = function(scope, destString, src){
  console.log('Begin deep copy:', scope, destString, src)
  scope[destString] = [];
  deepRecursion(src, scope[destString]);
  console.log('End result:', scope[destString])
};
Object.defineProperty(Object.prototype, 'downPath', {
  value: function(){
    let currentPoint = this;
    [...arguments].forEach((p)=>{
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
    arr.forEach((f)=>{
      root.downPath(...path).push({name: f});
    });
  });
  getStructure(path,'folders.prn',function(t){
    let arr = t.replace(InvisibleCharacter,'').split('\n').filter(o=>o!='');
    arr.forEach((f)=>{
      root.downPath(...path)[f] = [];
      composeFolder(path.concat(f));
    });
  });
}
function loop(scope){
  canApply = false;
  scope.root = Object.assign({},root);
  scope.$apply();
  setTimeout(function(){
    canApply = true;
  }, 1000);
}
var canApply = false;
(async function main(){
  composeFolder([]);
  var app = angular.module('app', []);
  app.service('getRoot', function(){
    this.root = Object.assign({}, root);
  })
  app.controller("page", [
    '$scope',
    'getRoot',
    function($scope, getRoot) {
      $scope.isObject = angular.isObject;
      $scope.isArray = angular.isArray;
      window.myScope = $scope;
      $scope.root = function(){
        return getRoot.root;
      }
    //angular.deepCopy($scope, 'root', root);
    }
  ]);
})();
