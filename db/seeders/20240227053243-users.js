'use strict';

module.exports = {
  
  up: (models, mongoose) => {
    return models.users
    .insertMany([
      {
        _id:"65dda564c23086ab33b1e78c",
          firstname:"Aswin",
          lastname:"Ajith",
          email:"aswinajith@gmail.com",
          password:"$2a$12$oNAzpZpkL9iFLQKJ3n7uc.i4AINYCl7fJcuOMUUJRzBIRGVshmBG6"
      }
    ])
    .then((res)=>{

      console.log(res.insertMany)
    })
  },

  down: (models, mongoose) => {
  

      return models.users
      .deleteMany({
        _id: {
          $in:[
            "65dda564c23086ab33b1e78c",
          ],
        },
      })
      .then((res)=> {


        console.log(res.deleteMany);
      });
  },
};
