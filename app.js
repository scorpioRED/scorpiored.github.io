var pocemonAPP = angular.module('pocemonAPP', [])

    .controller('mainCtrl', function ($scope, $http, get_request) {
        $scope.loading = {main: true, button: false};
        $scope.single_container = {spinner: false, all: false};
        $scope.pokemon = {types: []};
        var start = 12;


        var main = {
            init: function (q) {
                q = String(q);


                //with prommise

                get_request(q,false).then(function(answ){
                    console.log('then ',answ);
                    console.log('answer form factory - ', answ['data']['objects'][0]);
                    $scope.lists = answ['data']['objects'];
                    $scope.loading.main = false;
                    console.log('should hide loading',$scope.loading.main)
                    $scope.loading.button = false;
                    angular.forEach($scope.lists, function(single) {
                        if($scope.pokemon.types.indexOf(single['types'][0]['name']) == -1){
                            $scope.pokemon.types.push(single['types'][0]['name']);
                        }else {
                            if(single['types'][1] && $scope.pokemon.types.indexOf(single['types'][1]['name']) == -1){
                                $scope.pokemon.types.push(single['types'][1]['name']);
                            }
                        }
                    });

                    console.log('finn', $scope.pokemon.types)

                })


                //with CB

                //get_request(q, false, function (answ) {
                //    console.log('answer form factory - ', answ['data']['objects'][0]);
                //    $scope.lists = answ['data']['objects'];
                //    $scope.loading.main = false;
                //    $scope.loading.button = false;
                //    angular.forEach($scope.lists, function (single) {
                //        if ($scope.pokemon.types.indexOf(single['types'][0]['name']) == -1) {
                //            $scope.pokemon.types.push(single['types'][0]['name']);
                //        } else {
                //            if (single['types'][1] && $scope.pokemon.types.indexOf(single['types'][1]['name']) == -1) {
                //                $scope.pokemon.types.push(single['types'][1]['name']);
                //            }
                //        }
                //    });
                //
                //    console.log($scope.pokemon.types)
                //
                //
                //}, function (err) {
                //    console.log('factory error  - ', err.data)
                //})


            },
            single: function (id) {
                $scope.single_container.all = false;
                $scope.single_container.spinner = true;

                console.log('id is - ', id);
                get_request(false, String(id), function (answ) {
                    console.log('answer single - ', answ['data']['name']);
                    $scope.single_details = answ['data'];
                    $scope.single_container.spinner = false;
                    $scope.single_container.all = true;


                }, function (err) {
                    console.log('factory error  - ', err.data)
                })
            }
        };


        main.init(start);

        $scope.load_more = function (q) {
            $scope.loading.button = true;
            start = start + q;
            main.init(start)
        };

        $scope.show_single = function (id) {
            main.single(id)
        };


        $scope.typeFilter = function (item) {
            if ($scope.pokemonType) {
                if (item['types'][0]['name'] == $scope.pokemonType) {
                    return item
                }
                if (item['types'][1]) {
                    if (item['types'][1]['name'] == $scope.pokemonType) {
                        return item
                    }
                }
            } else {
                return item
            }
        }


    })


     //with CB

    //.factory('get_request', function ($http) {
    //    return function (req_url, id, cdsu, cderr) {
    //        req_url = id ? id : "?limit=" + req_url;
    //        console.log('url - ', "http://pokeapi.co/api/v1/pokemon/" + req_url);
    //        $http.get("http://pokeapi.co/api/v1/pokemon/" + req_url).then(cdsu, cderr);
    //
    //    }
    //})


    .factory('get_request', function ($http) {
        return function (req_url, id) {
            return new Promise(function (resolve, reject) {
                req_url = id ? id : "?limit=" + req_url;
                console.log('url - ', "http://pokeapi.co/api/v1/pokemon/" + req_url);
                $http.get("http://pokeapi.co/api/v1/pokemon/" + req_url).then(function (dt) {
                    if (dt.status == 200) {
                        resolve(dt)
                    } else {
                        var error = new Error(dt.statusText);
                        error.code = dt.status;
                        reject(error);
                    }

                }, function (err) {
                    if (err) {
                        reject(new Error("Network Error"));
                    }
                });
            })


        }
    })

