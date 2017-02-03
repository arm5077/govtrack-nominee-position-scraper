var request = require('request'),
  async = require('async');

congresses = [],
  offices = [],
  start = 114,
  end = 105
  
for( i=start; i>= end; i--){
  congresses.push(i);
}
  

// Run through congresses
async.eachSeries(congresses, function(congress, callback){
  console.log(congress);
  request.get(`https://www.govtrack.us/api/v2/vote?congress=${congress}&chamber=senate&limit=1000`, 
  function(err, res, body){
      if(err) throw err;
      var data = JSON.parse(body).objects;
      // Filter down to just nominations that were confirmed
      data = data.filter(function(d){ return d.result == "Nomination Confirmed"})

      // Strip out the nominee's job from the description text
      data.forEach(function(d){
        try{
          job = (d.question + ".").match(/to be.*?(,|\.)/)[0]
          .replace(/(to be )|( an )|,|\./g, "");
        }
        catch (e){
          console.log(`Couldn't parse: ${d.question}`);
          return
        }
        if( offices.indexOf(job) == -1)
          offices.push(job);
      })
    
      callback();
    }
  )
}, function(callback){
  offices.sort();
  offices.forEach( d=> console.log(d) );
})
