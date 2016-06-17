var pocemonAPP = angular.module('pocemonAPP', [])

    .controller('mainCtrl', function ($scope, $http, get_request) {
        $scope.loading = {main: true, button: false};
        $scope.single_container = {spinner: false, all: false};
        $scope.pokemon = {types: []};
        var start = 12;


        var main = {
            init: function (q) {
                q = String(q);

                get_request.get_data(q, false).then(function (answ) {
                    console.log('ANSWER',answ['data']['objects'][0]);
                    $scope.lists = answ['data']['objects'];
                        $scope.loading.main = false;
                        console.log('should hide loading', $scope.loading.main)
                        $scope.loading.button = false;
                        angular.forEach($scope.lists, function (single) {
                            if ($scope.pokemon.types.indexOf(single['types'][0]['name']) == -1) {
                                $scope.pokemon.types.push(single['types'][0]['name']);
                            } else {
                                if (single['types'][1] && $scope.pokemon.types.indexOf(single['types'][1]['name']) == -1) {
                                    $scope.pokemon.types.push(single['types'][1]['name']);
                                }
                            }
                        });

                        console.log('finn', $scope.pokemon.types)


                },function (err) {
                    console.log('factory error  - ', err.data)
                });



            },
            single: function (id) {
                $scope.single_container.all = false;
                $scope.single_container.spinner = true;

                console.log('id is - ', id);
                get_request.get_data(false,String(id)).then( (answ) =>{
                    console.log('answer single - ', answ['data']['name']);
                    $scope.single_details = answ['data'];
                    $scope.single_container.spinner = false;
                    $scope.single_container.all = true;
                },(err) => {
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



    .factory('get_request', function ($http) {
        return {
            get_data: function (req_url, id) {
                req_url = id ? id : "?limit=" + req_url;
                return $http.get("http://pokeapi.co/api/v1/pokemon/" + req_url);
            },
            otherMethod: function () {
                return 'other method'
            }
        }
    })


