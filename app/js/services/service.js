export default ['$http', function($http) {

    this.getUsers = function() {

        //  returns promise;
        return $http({
            method: 'GET',
            url: 'https://randomuser.me/api/?results=5'
        });
    }
}];
