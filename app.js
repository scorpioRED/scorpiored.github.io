var pocemonAPP = angular.module('pocemonAPP',[])

    .controller('mainCtrl',function($scope,$http,get_request){
        $scope.loading ={main:true,button:false};
        $scope.single_container = {spinner:false,all:false};
        var start = 12;


        var main = {
            init : function (q){
                q = String(q)
                get_request(q,false,function(answ){
                    console.log('answer form factory - ', answ['data']['objects'][0]);
                    $scope.lists = answ['data']['objects'];
                    $scope.loading.main = false;
                    $scope.loading.button = false;



                },function(err){
                    console.log('factory error  - ',err.data)
                })
            },
            single : function(id){
                $scope.single_container.all = false;
                $scope.single_container.spinner = true;

                console.log('id is - ', id);
                get_request(false,String(id),function(answ){
                    console.log('answer single - ', answ['data']['name']);
                    $scope.single_details = answ['data'];
                    $scope.single_container.spinner = false;
                    $scope.single_container.all = true;


                },function(err){
                    console.log('factory error  - ',err.data)
                })
            }
        };


        main.init(start);

        $scope.load_more = function(q){
            $scope.loading.button = true;
            start = start +q;
            main.init(start)
        };

        $scope.show_single = function(id){
            main.single(id)
        }



    })


    .factory('get_request',function($http){
        return function (req_url,id,cdsu,cderr){
            req_url = id ? id : "?limit="+ req_url;
            console.log('url - ',"http://pokeapi.co/api/v1/pokemon/"+ req_url);
            $http.get("http://pokeapi.co/api/v1/pokemon/"+req_url).then(cdsu,cderr);

        }
    })