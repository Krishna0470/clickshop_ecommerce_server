'use strict';

module.exports = {
  up: (models, mongoose) => {
    return models.user_types
    .insertMany([
      {
        _id : "65f3d64061496a1395461cf0",
        user_type : "admin"
      },
      {
        _id : "65f3d65961496a1395461cf1",
        user_type : "employee"
      }
    ])
    .then((res) =>{
      console.log(res.insertedCount)
    });
    
  },

  down: (models, mongoose) => {
  return models.user_types
  .deleteMany({
    _id :{
      $in:[
        "65f3d64061496a1395461cf0",
        "65f3d65961496a1395461cf1",
      ],
    },
  })
  .then((res) =>{
    console.log(res.deletedCount)
  });
  },
};
