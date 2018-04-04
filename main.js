let root = [];
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
function getStructure(path, file, cb){
  fetch(`./${path.length>0?(path.join('/')+'/'):''}${file}`).then((r)=>{
    if(r.status == 200 && r.ok == true){
      r.text().then(cb);
    }
  });
}
function composeFolder(path){
  getStructure(path,'files.prn',function(t){
    let arr = t.split('\n').filter(o=>o!='');
    arr.forEach((f)=>{
      root.downPath(...path).push({name: f});
    });
  });
  getStructure(path,'folders.prn',function(t){
    let arr = t.split('\n').filter(o=>o!='');
    arr.forEach((f)=>{
      root.downPath(...path)[f] = [];
      composeFolder(path.concat(f));
    });
  });
}
var app = angular.module('app', []);
app.controller("page", function($scope) {
  $scope.root = root;
});
