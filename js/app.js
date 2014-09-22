var app = angular.module('mls-design', []);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/projects', {
            templateUrl: 'partials/projects.html',
            controller: ProjectsController })

        .when('/project/:name', {
            templateUrl: 'partials/project-detail.html',
            controller: ProjectController })

        .when('/about', {
            templateUrl: 'partials/about.html' })

        .when('/contact', {
            templateUrl: 'partials/contact.html' })

        .otherwise({ redirectTo: '/projects' });
}]);

app.value('$anchorScroll', angular.noop);

app.filter('url', function() {
    return function(input) {
        if (input)
            return input.replace(/\s+/g, '-');
    };
});

app.directive('flexslider', function () {
    return function (scope, element, attrs) {
        scope.$watch(attrs.flexslider, function () {
            setTimeout(function() {
                element.flexslider({
                    animation: "slide"
                });
            }, 100);
        })
    }
});

app.directive('delayedFadeIn', function () {
    return function (scope, element, attrs) {
        scope.$watch(attrs.delayedFadeIn, function () {
            var src = element.children(":first").children(":first").data("src");
            var img = $("<img>");
            img.attr("src", src);
            img.on("load", function () {
                img.appendTo(element.children(":first").children(":first"));                
                element.addClass("animated");
                element.animate({opacity: 0},0);
                setTimeout(function() {
                    element.addClass("grow-in");
                }, Math.random() * 1000);
            });
        })
    }
});

app.directive('fadeIn', function () {
    return function (scope, element, attrs) {
        scope.$watch(attrs.fadeIn, function () {
            element.addClass("animated");
            element.addClass("fade-in");
        })
    }
});

app.directive('fadeInDown', function () {
    return function (scope, element, attrs) {
        scope.$watch(attrs.fadeInDown, function () {
            var src = element.data("src");
            var img = $("<img>");
            img.attr("src", src);
            img.on("load", function () {
                img.appendTo(element.children(":first"));
                img.addClass("animated");
                img.addClass("fade-in-down")
            });
        })
    }
});

function ProjectsController($scope, $http) {
    $http.get('js/data.json')
        .success(function (data) {
            $scope.projects = data;
        })
        .error(function (data, status, headers, config) {
            document.write(data);
        });
}

function ProjectController($scope, $routeParams, $http, $location, $filter) {
    $http.get('js/data.json').success(function (data) {
        // find project and inject into scope
        for (var project = 0; project < data.length; ++project) {
            var name = $filter('url')($filter('lowercase')(data[project].name));
            if ($routeParams.name == name) {
                $scope.project = data[project];

                if (project > 0)
                    $scope.prevProject = data[project - 1].name;

                if (project < data.length - 1)
                    $scope.nextProject = data[project + 1].name;

                return;
            }
        }

        // will only get here if project not found
        $location.path("/projects");
    });
}