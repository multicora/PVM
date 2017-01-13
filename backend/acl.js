const permissionsFunc = function(credentials, callback) {

  const actions = credentials.actions;

  const hasAction = (name) => {
    return actions.indexOf(name) >= 0;
  };

  var userPermissions = {
    read: hasAction('CAN_SEE_USERS_PAGE'),
    edit: hasAction('CAN_EDIT_USERS'),
    invite: hasAction('CAN_INVITE_USERS')
  };

  callback(null, userPermissions);
};

module.exports = function (server, cb) {
  server.register(
    {
      register: require('hapi-route-acl'),
      options: {
        permissionsFunc: permissionsFunc
      }
    },
    cb
  );
};