'use strict';

module.exports = {
  
  up: (models, mongoose) => {
    return models.users
    .insertMany([
      {
        _id:"65f15c502d4df9de07a9f765",
          firstname:"Aswin",
          lastname:"Ajith",
          email:"aswinajith@gmail.com",
          password:"$2a$12$oNAzpZpkL9iFLQKJ3n7uc.i4AINYCl7fJcuOMUUJRzBIRGVshmBG6",
          user_type : "65f3d64061496a1395461cf0"
      },
      {
        _id: "65e57767b4afea6e91b76783",
        first_name: "jack",
        last_name: "antony",
        email: 'jack@gmail.com',
        password: "$2a$12$3o8yS0RR7CpWvtVyJX2D2.NZHMht2AC1xvdYCsPIW9MIjaUh2nL8u",
        user_type : "65f3d65961496a1395461cf1"
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
            "65f15c502d4df9de07a9f765",
            "65f15e592d4df9de07a9f766"
          ],
        },
      })
      .then((res)=> {


        console.log(res.deletedCount);
      });
  },
};
