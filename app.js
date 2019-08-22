var expressSantizer = require('express-sanitizer'),
    methodOverride  = require('method-override'),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    express         = require('express'),
    app             = express();


mongoose.connect("mongodb://localhost/blog_app");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSantizer());
app.use(methodOverride("_method")); 


var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
     body: String,
  created: {type: Date, default:Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Test Blog",
//     image: "https://images.unsplash.com/photo-1536722138786-c6ea8e7461c4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
//     body: "This is the body of the blog"
// });

app.get("/", function(req,res){
    res.redirect("/blogs")
});

app.get("/blogs", function(req,res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        }else{
            res.render("index",{blogs:blogs});
        }
    });
});

app.get("/blogs/new", function(req,res){
    res.render("new");
});

app.post("/blogs",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err,newBlog){
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    });
    
});

app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
       if(err){
        console.log(err);
       }else{
        res.render("show",{blog:foundBlog});
       }
    });
});

app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id, function(err,foundBlog){
        if(err){
            console.log(err);

        }else{
            res.render("edit",{blog:foundBlog});
        }
    });  
});

app.put("/blogs/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog, function(err, UpdatedBlog){
        if(err){
            console.log(err);
        }else{
            res.redirect("/blogs/" +req.params.id);
        }
    });
});

app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect("/");
        }
    });
});

app.listen(8080, process.env.IP,function(){
    console.log('server is up and running');
});
    