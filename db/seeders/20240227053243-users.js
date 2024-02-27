'use strict';

module.exports = {
  
  up: (models, mongoose) => {
    return models.users
    .insertMany([
      {
        _id:"65dd74e1dd27c926301148",
        personel_details :{
          first_name:"Aswin",
          last_name:"Ajith",
          phone:"12324524",
          email:"aswinajith@gmail.com",
        },
      }
    ])
    .then(res=>{

      console.log(res.insertMany)
    })
  },

  down: (models, mongoose) => {
  

      return models.users
      .deleteMany({
        _id: {
          $in:[
            "65dd74e1dd27c926301148",
          ],
        },
      })
      .then((res)=> {


        console.log(res.deleteMany);
      });
  },
};
