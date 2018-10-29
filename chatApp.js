angular.module('chatApp', ['open-chat-framework'])
  .run(['$rootScope', 'ngChatEngine', function($rootScope, ngChatEngine) {
    $rootScope.ChatEngine = ChatEngineCore.create({
      publishKey: 'pub-c-dedc48f3-5a4f-4bb0-a448-d835702e8491',
      subscribeKey: 'sub-c-d2b9517a-db14-11e8-befe-22cc51e2fc9c'
    }, {
      debug: true,
      globalChannel: 'chat-engine-angular-simple'
    });
    // bind open chat framework angular plugin
    ngChatEngine.bind($rootScope.ChatEngine);

    // set a global array of chatrooms
    $rootScope.chats = [];
  }])
  .controller('chatAppController', function($scope) {
    $scope.ChatEngine.connect(new Date().getTime(), {}, 'auth-key');
    $scope.ChatEngine.on('$.ready', (data) => {
      $scope.me = data.me;

      $scope.me.plugin(ChatEngineCore.plugin['chat-engine-random-username']($scope.ChatEngine.global));

      // bind chat to updates
      $scope.chat = $scope.ChatEngine.global;
      $scope.chat.plugin(ChatEngineCore.plugin['chat-engine-online-user-search']({
        prop: 'state.username'
      }));
    });
    $scope.search = function() {
      let found = $scope.chat.onlineUserSearch.search($scope.mySearch);
      // hide every user
      for(let uuid in $scope.chat.users) {
        $scope.chat.users[uuid].hideWhileSearch = true;
      }
      // show all found users
      for(let i in found) {
        $scope.chat.users[found[i].uuid].hideWhileSearch = false;
      }
      console.log('$scope.chat.users', $scope.chat.users);
    }

    // create a new chat
    $scope.newChat = function(user) {
      // define a channel
      let chat = new Date().getTime();
      // create a new chat with that channel
      let newChat = new $scope.ChatEngine.Chat(chat);
      // we need to auth ourselves before we can invite others
      newChat.on('$.connected', () => {
        // this fires a private invite to the user
        newChat.invite(user);
        // add the chat to the list
        $scope.chats.push(newChat);
      })
    }
  });