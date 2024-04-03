'use strict';

module.exports = {
  
  up: (models, mongoose) => {
    return models.users
    .insertMany([
      {
        _id:"660d62fa6a916a7207f9f6ee",
          firstname:"Admin123",
          lastname:"admin123",
          email:"admin123@gmail.com",
          password:"$2a$12$oNAzpZpkL9iFLQKJ3n7uc.i4AINYCl7fJcuOMUUJRzBIRGVshmBG6",
          user_type : "65f3d64061496a1395461cf0"
          
      },
      {
        _id: "660d63346a916a7207f9f6ef",
        firstname: "jack",
        lastname: "antony",
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
            "660d62fa6a916a7207f9f6ee",
          ],
        },
      })
      .then((res)=> {


        console.log(res.deletedCount);
      });
  },
};
