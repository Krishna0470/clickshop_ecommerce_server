'use strict';

module.exports = {
  
  up: (models, mongoose) => {
    return models.users
    .insertMany([
      {
        _id:"662b61af864235380c44972c",
         username:"Admin1",
          email:"admin1@gmail.com",
          password:"$2a$12$g6oNDLntmOhJT2kqqAVZv.ik/PqR5lFGd.PvvTvxBnTBaYyAGtPZu",
          user_type : "65f3d64061496a1395461cf0",
          type:"Admin"
          
      },
      {
        _id: "6627ba80a901b533a2b7df6b",
        username: "User1",
        email: 'user1@gmail.com',
        password: "$2a$12$C37JrwK.IqbvOlVoEPzUiej/FibDQUKpgutn8VDA6Z9vTg5uwazpq",
        user_type : "65f3d65961496a1395461cf1",
        type:"Seller"
      }
    ])
    .then((res)=>{

      console.log(res.insertedCount)
    })
  },

  down: (models, mongoose) => {
  

      return models.users
      .deleteMany({
        _id: {
          $in:[
            "662b61af864235380c44972c",
          ],
        },
      })
      .then((res)=> {


        console.log(res.deletedCount);
      });
  },
};
