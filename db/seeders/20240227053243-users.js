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
          password:"aswin123@ASD",
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
