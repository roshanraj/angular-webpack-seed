export default ['$scope', 'UserService', function($scope, UserService) {

    $scope.msg = "Home";
    var promise = UserService.getUsers();
    promise.then(function(res) {

            $scope.users = res.data.results;
        },
        function() {
            // handle if promise fails
        }

    )
}];
