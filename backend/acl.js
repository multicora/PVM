const permissionsFunc = function(credentials, callback) {
  // let userPermissions = {};

  const roles = credentials.roles.map( (role) => {
    return role.name;
  } );

  const hasRole = (name) => {
    return roles.indexOf(name) >= 0;
  };

  var userPermissions = {

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