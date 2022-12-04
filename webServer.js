/* jshint node: true */

/*
 * This builds on the webServer of previous projects in that it exports the current
 * directory via webserver listing on a hard code (see portno below) port. It also
 * establishes a connection to the MongoDB named 'cs142project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch any file accessible
 * to the current user in the current directory or any of its children.
 *
 * This webServer exports the following URLs:
 * /              -  Returns a text status message.  Good for testing web server running.
 * /test          - (Same as /test/info)
 * /test/info     -  Returns the SchemaInfo object from the database (JSON format).  Good
 *                   for testing database connectivity.
 * /test/counts   -  Returns the population counts of the cs142 collections in the database.
 *                   Format is a JSON object with properties being the collection name and
 *                   the values being the counts.
 *
 * The following URLs need to be changed to fetch there reply values from the database.
 * /user/list     -  Returns an array containing all the User objects from the database.
 *                   (JSON format)
 * /user/:id      -  Returns the User object with the _id of id. (JSON format).
 * /photosOfUser/:id' - Returns an array with all the photos of the User (id). Each photo
 *                      should have all the Comments on the Photo (JSON format)
 *
 */

var mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
var fs = require("fs");
var async = require("async");

var express = require("express");
var app = express();
var session = require("express-session");
//CHECK DO WE NEED TO ADD THIS?
//const MongoStore = require("connect-mongo")(session);

// Load the Mongoose schema for User, Photo, and SchemaInfo
var bodyParser = require("body-parser");
var multer = require("multer");
var User = require("./schema/user.js");
var Photo = require("./schema/photo.js");
//const { PhotoSharp } = require('@material-ui/icons');
var SchemaInfo = require("./schema/schemaInfo.js");
//const { ContactSupportOutlined } = require("@material-ui/icons");
//const { request } = require("http");

var processFormBody = multer({ storage: multer.memoryStorage() }).single(
  "uploadedphoto"
);
//const { response } = require('express');
//const { request } = require('http');
//var store = multer({storage: multer.memoryStorage()}).single("uploadedPicture");

// XXX - Your submission should work without this line. Comment out or delete this line for tests and before submission!
//var cs142models = require('./modelData/photoApp.js').cs142models;

mongoose.connect("mongodb://localhost/cs142project6", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
app.use(express.static(__dirname));

app.use(
  session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: true,
    user_id: undefined,
    //store: new MongoStore({mongooseConnection: mongoose.connection})
  })
);
app.use(bodyParser.json());
app.get("/", function (request, response) {
  response.send("Simple web server of files from " + __dirname);
});

/*
 * Use express to handle argument passing in the URL.  This .get will cause express
 * To accept URLs with /test/<something> and return the something in request.params.p1
 * If implement the get as follows:
 * /test or /test/info - Return the SchemaInfo object of the database in JSON format. This
 *                       is good for testing connectivity with  MongoDB.
 * /test/counts - Return an object with the counts of the different collections in JSON format
 */
app.get("/test/:p1", function (request, response) {
  // Express parses the ":p1" from the URL and returns it in the request.params objects.
  console.log("/test called with param1 = ", request.params.p1);

  var param = request.params.p1 || "info";

  if (param === "info") {
    // Fetch the SchemaInfo. There should only one of them. The query of {} will match it.
    SchemaInfo.find({}, function (err, info) {
      if (err) {
        // Query returned an error.  We pass it back to the browser with an Internal Service
        // Error (500) error code.
        console.error("Doing /user/info error:", err);
        response.status(500).send(JSON.stringify(err));
        return;
      }
      if (info.length === 0) {
        // Query didn't return an error but didn't find the SchemaInfo object - This
        // is also an internal error return.
        response.status(500).send("Missing SchemaInfo");
        return;
      }

      // We got the object - return it in JSON format.
      console.log("SchemaInfo", info[0]);
      response.end(JSON.stringify(info[0]));
    });
  } else if (param === "counts") {
    // In order to return the counts of all the collections we need to do an async
    // call to each collections. That is tricky to do so we use the async package
    // do the work.  We put the collections into array and use async.each to
    // do each .count() query.
    var collections = [
      { name: "user", collection: User },
      { name: "photo", collection: Photo },
      { name: "schemaInfo", collection: SchemaInfo },
    ];
    async.each(
      collections,
      function (col, done_callback) {
        col.collection.countDocuments({}, function (err, count) {
          col.count = count;
          done_callback(err);
        });
      },
      function (err) {
        if (err) {
          response.status(500).send(JSON.stringify(err));
        } else {
          var obj = {};
          for (var i = 0; i < collections.length; i++) {
            obj[collections[i].name] = collections[i].count;
          }
          response.end(JSON.stringify(obj));
        }
      }
    );
  } else {
    // If we know understand the parameter we return a (Bad Parameter) (400) status.
    response.status(400).send("Bad param " + param);
  }
});

/* get all the users other than the current user -> Proj 8 new func!
 */
app.get("/otherUsers/list", function (request, response) {
  if (!request.session.user_id) {
    response.status(401).send("user aint logged in");
    return;
  }

  let curr_user_id = request.session.user_id;
  User.find({}, (_, allUsers) => {
    let otherUsers = allUsers.filter(
      (user) => String(user._id) !== String(curr_user_id)
    );
    async.eachOf(
      otherUsers,
      function (user, indx, callback) {
        let { _id, first_name, last_name } = user;
        otherUsers[indx] = { _id, first_name, last_name };
        callback();
      },
      (err) => {
        if (err) {
          console.log(err);
        } else {
          response.status(200).send(otherUsers);
        }
      }
    );
  });
});

/*
 * URL /user/list - Return all the User object.
 */
app.get("/user/list", function (request, response) {
  if (!request.session.user_id) {
    response.status(401).send("user aint logged in");
    return;
  }
  let lst = [];
  User.find({}, function (err, userLst) {
    if (err) {
      console.error("Doing /user/list error:", err);
      response.status(500).send(JSON.stringify(err));
      return;
    }
    if (userLst.length === 0) {
      response.status(500).send("Couldnt find userLst");
      return;
    }
    for (var i = 0; i <= userLst.length - 1; i++) {
      var user = userLst[i];
      var obj = {
        _id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
      };
      //     console.log(obj.first_name);

      if (obj.first_name === "Fnu1653707055557") {
        continue;
      }

      lst.push(obj);
    }
    response.status(200).send(lst);
  });
});

/* for mentions --new func for proj 8
 */

app.get("/user/mentionOptions", function (request, response) {
  if (!request.session.user_id) {
    response.status(401).send("user isnt logged in");
    return;
  }
  User.find({}, (_, allUsers) => {
    let users = allUsers;
    async.eachOf(
      allUsers,
      function (user, indx, callback) {
        let { _id, first_name, last_name } = user;
        users[indx] = { id: _id, display: `${first_name} ${last_name}` };
        callback();
      },
      (err) => {
        if (err) {
          console.log(err);
        } else {
          response.status(200).send(users);
        }
      }
    );
  });
});

/*
 * URL /user/:id - Return the information for User (id) --added mentioned for proj 8
 */
app.get("/user/:id", function (request, response) {
  if (!request.session.user_id) {
    response.status(401).send("user is not logged in");
    return;
  }
  var id = request.params.id;
  User.findOne({ _id: id }, (err, user) => {
    if (err) {
      console.log("User with _id:" + id + " not found.");
      response.status(400).send("Not found");
      return;
    }
    let {
      _id,
      first_name,
      last_name,
      location,
      description,
      occupation,
      mentioned,
    } = user;
    let newUser = {
      _id,
      first_name,
      last_name,
      location,
      description,
      occupation,
      mentioned,
    };

    response.status(200).send(newUser);
  });
});

/*
 * URL /photosOfUser/:id - Return the Photos for User (id)
 */
app.get("/photosOfUser/:id", function (request, response) {
  if (!request.session.user_id) {
    response.status(401).send("user aint logged in");
    return;
  }

  var id = request.params.id;
  //console.log(id);
  Photo.find(
    {
      user_id: id,
    },
    function (err, photos) {
      if (err) {
        console.error("Doing /photoOfUser/:id error:", err);
        response.status(400).send(JSON.stringify(err));
        return;
      }
      var funcStack = [];
      var newPhotos = JSON.parse(JSON.stringify(photos));
      for (var i = 0; i <= newPhotos.length - 1; i++) {
        delete newPhotos[i].__v;
        var comments = newPhotos[i].comments;

        comments.forEach(function (comment) {
          var userID = comment.user_id;
          funcStack.push(function (callback) {
            User.findOne(
              {
                _id: userID,
              },
              function (error, result) {
                if (error !== null) {
                  response.status(400).send("Error");
                } else {
                  var userInfo = JSON.parse(JSON.stringify(result));
                  var user = {
                    _id: userID,
                    first_name: userInfo.first_name,
                    last_name: userInfo.last_name,
                  };
                  comment.user = user;
                }
                callback();
              }
            );
          });
          delete comment.user_id;
        });
      }
      async.parallel(funcStack, function () {
        response.status(200).send(newPhotos);
      });
    }
  );
  /*
    var photos = cs142models.photoOfUserModel(id);
    if (photos.length === 0) {
        console.log('Photos for user with _id:' + id + ' not found.');
        response.status(400).send('Not found');
        return;
    }
    response.status(200).send(photos);
    */
});

/*New func for proj 8!
 */
app.get("/admin/current", function (request, response) {
  let user_id = request.session.user_id;
  if (!user_id) {
    console.log("user_id was undefined");
    response.status(200).send(undefined);
    return;
  }
  User.findOne({ _id: user_id }, (_, user) => {
    if (!user) {
      console.log("id was not recognized");
      response.status(400).send("id was not recognized");
      return;
    }

    let { _id, first_name, last_name, login_name } = user;
    let otherUser = { _id, first_name, last_name, login_name };
    response.status(200).send(otherUser);
  });
});

app.post("/admin/login", function (request, response) {
  // console.log(request.session.cookie);
  let login = request.body.login_name;
  let password_tried = request.body.password;
  User.findOne({ login_name: login }, (err, user) => {
    if (err) {
      console.log("Problem with recognizing User with login:" + login);
      response.status(400).send("User name not a valid account");
      return;
    }
    if (!user) {
      console.log("Could not find User with login:" + login);
      response.status(400).send("User name not found");
      return;
    }
    if (user.password !== password_tried) {
      response.status(400).send("Aw! Wrong Password! Better luck next time!");
      return;
    }
    request.session.login_name = login;
    request.session.user_id = user._id;
    //request.session.cookie.reSave = true;
    console.log(request.session.user_id);

    let { _id, first_name, last_name, login_name } = user;
    response.status(200).send({ _id, first_name, last_name, login_name });
  });
});

app.post("/admin/logout", function (request, response) {
  request.session.destroy(function (err) {
    if (err) {
      response
        .status(400)
        .send("having trouble logging out maybe user aint logged in");
      return;
    }
    response.status(200).send();
  });
});

/*new func for proj 8 for giving basic inof on pictures
 */
app.get("/photo/:photo_id", function (request, response) {
  if (!request.session.user_id) {
    response.status(401).send("User is not logged in");
  } else {
    let photo_id = request.params.photo_id;
    Photo.findOne({ _id: photo_id }, function (error, photo) {
      if (error) {
        response.status(400).send("The Photo Id is invalid");
        return;
      }
      User.findOne({ _id: photo.user_id }, function (_, photo_owner) {
        let pObj = {
          _id: photo_id,
          photo_owner_id: photo_owner._id,
          file_name: photo.file_name,
          photo_owner_first_name: photo_owner.first_name,
          photo_owner_last_name: photo_owner.last_name,
        };
        response.status(200).send(pObj);
        //return;
      });
    });
  }
});

/*made changes for mentions in comments for proj 8
 */
app.post("/commentsOfPhoto/:photo_id", function (request, response) {
  if (!request.session.user_id) {
    response.status(401).send("user is not logged in!");
    return;
  }
  let photo_id = request.params.photo_id;
  let user_comm = request.session.user_id;
  let text = request.body.comment;
  let mentionsToAdd = request.body.mentionsToAdd;
  if (!text) {
    response.status(400).send("Comment request not valid. Please retry");
    return;
  }
  Photo.findOne({ _id: photo_id }, function (err, photo) {
    if (err) {
      response.status(400).send("Photo Id not valid. Please retry");
      return;
    }
    let current_time = new Date();
    photo.comments = photo.comments.concat([
      { comment: text, date_time: current_time, user_id: user_comm },
    ]);
    photo.save();

    //adding photo ids to each user mentioned for comments
    async.each(
      mentionsToAdd,
      function (user, callback) {
        User.findOne({ _id: user }, function (error, user) {
          if (error) {
            response.status(400).send("ID is invalid");
            return;
          }
          user.mentioned.push(photo_id);
          user.save();
          callback();
        });
      },
      function (error) {
        if (error) {
          response
            .status(400)
            .send(
              "Getting an error when adding photo ids to each user in comments"
            );
          return;
        }
        response.status(200).send();
      }
    );
  });
});

/* new func for proj 8 for liking or unliking photos
 */
app.post(`/likeOrUnlike/:photo_id`, function (request, response) {
  if (!request.session.user_id) {
    response.status(401).send("User isnt logged in");
    return;
  }
  let photo_id = request.params.photo_id;
  console.log("Photo Id" + photo_id);
  let curr_user_id = request.session.user_id;
  Photo.findOne({ _id: photo_id }, function (error, photo) {
    console.log("photo in find one backend" + photo);
    if (error) {
      response.status(400).send("Photo Id received is invalid");
      return;
    }
    let index_of_user = photo.liked_by.indexOf(curr_user_id);
    //if (request.body.like) {
    if (index_of_user === -1) {
      photo.liked_by.push(curr_user_id);
    }
    //photo.liked_by.push(curr_user_id);
    //} else {
    if (index_of_user >= 0) {
      photo.liked_by.splice(index_of_user, 1);
    }

    //photo.save();
    photo.save(function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        //console.log(result)
        response.send(result);
      }
    });
    console.log("hey");
    //response.status(200).send();
  });
});

/* add check for permissions to view photos for proj 8
 */
app.post("/photos/new", function (request, response) {
  if (!request.session.user_id) {
    response.status(401).send("user is not logged in!");
    return;
  }

  processFormBody(request, response, function (error) {
    if (error) {
      response.status(400).send("Some kind of error occured with file");
      return;
    }
    if (!request.file) {
      response.status(400).send("File is invalid");
      return;
    }

    let userPermissions = JSON.parse(request.body.usersPermitted);

    var timestamp = new Date().valueOf();
    var filename = "U" + String(timestamp) + request.file.originalname;

    fs.writeFile("./images/" + filename, request.file.buffer, function (err) {
      if (err) {
        response.status(400).send("Not able to write File");
        return;
      }

      let permitted_users = Object.entries(userPermissions)
        .filter((key_value) => key_value[1])
        .map((key_value) => key_value[0]);
      permitted_users.push(request.session.user_id);
      Photo.create(
        {
          file_name: filename,
          date_time: timestamp,
          user_id: request.session.user_id,
          comments: [],
          permitted_users,
        },
        function (errors, newPicture) {
          if (errors) {
            response
              .status(400)
              .send("Encountering an error in creating a new picture");
            return;
          }
          newPicture.save();
          response.status(200).send();
        }
      );
    });
  });
});

/*Added cookie for newuser for proj8
 */
app.post("/user", function (request, response) {
  let {
    login_name,
    password,
    first_name,
    last_name,
    location,
    description,
    occupation,
  } = request.body;

  if (password) {
    User.findOne({ login_name }, function (err, user) {
      if (user) {
        response
          .status(400)
          .send("Rethink Username. This one is already taken.");
        return;
      }
      User.create(
        {
          login_name,
          password,
          first_name,
          last_name,
          location,
          description,
          occupation,
        },
        function (_, newUser) {
          request.session.login_name = login_name;
          request.session.user_id = newUser._id;
          request.session.cookie.user_id = newUser._id;
          let user_current = {
            _id: newUser._id,
            first_name,
            last_name,
            login_name,
          };
          response.status(200).send(user_current);
        }
      );
    });
  } else {
    console.log("Need to fill in password");
    response.status(400).send("Need to fill in password");
  }
});

var server = app.listen(3000, function () {
  var port = server.address().port;
  console.log(
    "Listening at http://localhost:" +
      port +
      " exporting the directory " +
      __dirname
  );
});
