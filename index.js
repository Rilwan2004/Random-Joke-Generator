import express from "express"
import axios from "axios"
import bodyParser from "body-parser"

const app = express()
const port = "3000"

app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log(`Request URL: ${req.protocol}://${req.get('host')}${req.originalUrl} - Method: ${req.method}`);
    next(); // Call the next middleware or route handler
  });

const jokeAPI = "https://v2.jokeapi.dev/joke"


app.get("/", async (req,res) => {
        try {
        const joke = await axios.get(jokeAPI + "/Any")
        res.render("index.ejs", {
            setup : joke.data.setup,
            delivery : joke.data.delivery
        })    
    } catch (error) {
        console.error("Failed to make request:", error.message);
    }
})

app.post("/get-joke", async (req,res) => {
    var jokeCategory = req.body.category
    var jokeType = req.body.type
    var filterOption = req.body.filter

    if (!filterOption) {
        filterOption = ""; // Set a default value if it's undefined or null
      } else if (Array.isArray(filterOption)) {
        // Convert array to a comma-separated string
        filterOption = filterOption.join(",");
      } else if (typeof filterOption !== "string") {
        // Handle case where filterOption is not a string or array
        filterOption = String(filterOption); // Convert it to a string just in case
      }
    try {
    const joke = await axios.get(jokeAPI + "/" + jokeCategory, {
        params: {
            blacklistFlags : filterOption,
            type : jokeType
            }
        
      });
      if (joke.data.type == "single") {
        res.render("index.ejs", {
          setup : joke.data.joke,
          delivery : null,
             })   
      } else {
        res.render("index.ejs", {
          setup : joke.data.setup,
          delivery : joke.data.delivery,
          
              }) 
      }
      
            console.log(filterOption)  
} catch (error) {
    console.error("Failed to make request:", error.message);
   
}
})





app.listen(port , (req,res) => {
    console.log(`Server running on port ${port}`)
})