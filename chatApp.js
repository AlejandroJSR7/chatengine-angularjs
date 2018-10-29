angular.module('chatApp', ['open-chat-framework'])
  .run(['$rootScope', 'ngChatEngine', function($roo,tScope, ngChatEngine) {
    $rootScope.ChatEngine = ChatEngineCore.create({
      publishKey: 'pub-c-dedc48f3-5a4f-4bb0-a448-d835702e8491',
      subscribeKey: 'sub-c-d2b9517a-db14-11e8-befe-22cc51e2fc9c'
    }, {
      debug: true,
      globalChannel: 'chat-engine-angular-simple'
    });
    // bind open chat framework angular plugin
    ngChatEngine.bind($rootScope.ChatEngine);
  }]);