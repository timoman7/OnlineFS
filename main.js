let root = [];
function getStructure(path, file, cb){
  fetch(`./${path.length>0?(path.join('/')+'/'):''}${file}`).then((r)=>{
    if(r.status == 200 && r.ok == true){
      r.text().then(cb);
    }
  });
}
Object.defineProperty(Array.prototype, 'toObject', {
  value: function(){

  }
})
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
    let arr = t.replace('\\r','').split('\n').filter(o=>o!='');
    arr.forEach((f)=>{
      root.downPath(...path).push({name: f});
    });
  });
  getStructure(path,'folders.prn',function(t){
    let arr = t.replace('\\r','').split('\n').filter(o=>o!='');
    arr.forEach((f)=>{
      root.downPath(...path)[f] = [];
      composeFolder(path.concat(f));
    });
  });
}
composeFolder([]);
var app = angular.module('app', []);
app.controller("page", function($scope) {
  window.myScope = $scope;
  $scope.root = JSON.parse(JSON.stringify(Object.assign({},root)));
});
