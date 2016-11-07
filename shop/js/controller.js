var ShopModule = angular.module("ShopModule",["ngRoute"]);
ShopModule.config(function($routeProvider){
    $routeProvider
        .when('/index',{
            template:"<h3>这是网站的首页</h3>"
        })
        .when('/shop',{
            templateUrl:"template/shop.html",
            controller:"ShopController"
        })
        .when('/cart',{
            templateUrl:"template/cart.html",
            controller:"CartController"
        })
        .otherwise({
            redirectTo:'/index'
        })
})
ShopModule.controller('IndexController',function($scope,$http){
    // 通过ajax请求data/shop.json的数据(模拟从后台服务器获取数据)
    $http.get('data/shop.json').then(function(msg){
        $scope.shoplist = msg.data;
    })
    // 购物车数据默认为空
    $scope.cartlist = [];
})
ShopModule.controller('ShopController',function($scope){
    // 根据id获取shoplist的索引值
    function getShopIndex(id){
        var index;
        angular.forEach($scope.shoplist,function(value,key){
            if(value['id'] == id){
                index = key;
            }
        })
        return index;
    }
    // 判断id是否存在于cartlist中
    function getCartIndex(id){
        var index;
        angular.forEach($scope.cartlist,function(value,key){
            if(value['id'] == id){
                index = key;
            }
        })
        // id存在，返回cartlist中索引的下标
        return index;
    }
    // 点击添加到购物车
    $scope.addCart = function(id,ent){
        var cIndex = getCartIndex(id);
        var sIndex = getShopIndex(id);
        if(cIndex == undefined){
            // id不存在，添加商品
            var obj = $scope.shoplist[sIndex];
            // 添加到购物车的数量默认为1
            obj['num'] = 1;
            $scope.cartlist.push(obj);
        }else{
            // id存在，商品数量加1
            $scope.cartlist[cIndex]['num']++;
        }
        var flyObj = $('<img src="' + $scope.shoplist[sIndex]['pic'] + '" width="60">');
        flyObj.fly({
            // 相对于当前窗口的坐标点
            start:{
                left:ent.clientX,
                top:ent.clientY,
            },
            end:{
                left:90,
                top:130,
            },
            speed:1.5,  //默认为1.2
            vertex_Rtop:10, //  运动轨迹最高点
            onEnd:function(){
                flyObj.remove();
            }
        })
    }
})    
       
ShopModule.controller('CartController',function($scope){
    $scope.jian = function(index){
        if($scope.cartlist[index].num > 0){
            $scope.cartlist[index].num--;
        }
    }
    $scope.jia = function(index){
        $scope.cartlist[index].num++;
    }
    $scope.del = function(index){
        $scope.cartlist.splice(index,1);
    }
    $scope.$watch('cartlist',function(){
        $scope.total = {
            price:0,
            num:0
        }
        // 全部选中,isBool为真,否则为假
        $scope.isBool = true;   //默认全选
        angular.forEach($scope.cartlist,function(value,key){
            if(value['isCheck']){
                // 总价
                $scope.total.price += value.price * value.num;
                // 总数
                $scope.total.num += value.num;
            }else{
                // 不选中不计算价格和数量 
                $scope.isBool = false;
            }
        })
    },true) //深度监听
   $scope.check = function(){
      angular.forEach($scope.cartlist,function(value,key){
         value['isCheck'] = $scope.checkAll;
      })
   }
})
   