const express = require('express');
const { log } = require('node:console');
const fs = require('node:fs')
const app = express()

const path = require('path');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname,"public")));

app.get('/', function (req, res) {
  fs.readdir(`./files`, function(err,files){
     res.render('index.ejs' , {files: files});

  })
})

app.get('/file/:username', function (req, res) {
    fs.readFile(`./files/${req.params.username}`, 'utf-8', function(err,data){
      res.render('content',{title:req.params.username , data: data});
      console.log(err);
    })
  });

  app.post('/delete/:username', function (req, res) {
    fs.unlink(`./files/${req.params.username}`, function (err) {
      if (err) {
        console.error(`Error deleting file: ${err}`);
        res.status(500).send('An error occurred while deleting the file.');
        return;
      }
      res.redirect('/');
    });
  });

app.post('/create', function (req, res) {
  fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`,req.body.content,function(err){
    res.redirect('/');
    console.log(err);
  })
})




// Assuming you're using Express.js
app.get('/edit/:username', function (req, res) {
  // Retrieve the file content to populate the edit form
  fs.readFile(`./files/${req.params.username}`, 'utf8', function (err, data) {
    if (err) {
      console.error(`Error reading file: ${err}`);
      res.status(500).send('An error occurred while reading the file.');
      return;
    }
    // Render the edit form with the retrieved data
    res.render('edit.ejs', { title: req.params.username, content: data });
  });
});


app.post('/edit/:username', function (req, res) {
  // Extract the updated title and content from the form submission
  const updatedTitle = req.body.title;
  const updatedContent = req.body.content;
  
  // Rename the file to match the updated title
  fs.rename(`./files/${req.params.username}`, `./files/${updatedTitle}`, function (err) {
    if (err) {
      console.error(`Error renaming file: ${err}`);
      res.status(500).send('An error occurred while renaming the file.');
      return;
    }
    
    // Write the updated content to the new file path
    fs.writeFile(`./files/${updatedTitle}`, updatedContent, function (err) {
      if (err) {
        console.error(`Error updating file content: ${err}`);
        res.status(500).send('An error occurred while updating the file content.');
        return;
      }
      
      // Redirect the user back to the home page or wherever you want
      res.redirect('/');
    });
  });
});


app.listen(3000)