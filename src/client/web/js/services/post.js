angular.module('IronbaneApp')
.factory('Post', ['$q', '$log', '$http', '$location', 'User', function($q, $log, $http, $location, User) {
    var Post = function(json) {
        angular.copy(json || {}, this);
    };

    Post.prototype.$save = function(params) {
        var url = '/api/forum/' + params.boardId + '/topics',
            self = this;

        if(params.topicId && params.topicId > 0) {
            url = '/api/forum/topics/' + params.topicId;
        }

        var promise = $http.post(url, self)
            .then(function(response) {
                // update post object with id, topic_id etc...
                $log.log('success saving post!', response.data);
                return new Post(response.data);
            }, function(err) {
                $log.error('error saving post', err);
                return $q.reject(err);
            });

        return promise;
    };

    return Post;
}]);