module.exports = function() {

    return {

        restrict: 'E',
        scope: {

            userinfo: '=user'
        },
        templateUrl: "./partials/card.html"
    };
};
