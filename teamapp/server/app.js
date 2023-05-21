const { response } = require("express");
const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const app = express();
const jsonParser = express.json();

const userSchema = new Schema({email: String, username: String,
    role: String, password: String, projects: []}, {versionKey: false});
const User = mongoose.model("user", userSchema);

const projectSchema = new Schema({projectname: String, teamlead: Object, customer: Object, 
    members: [], lists:[{id: mongoose.Types.ObjectId,listname:String,
    tasks:[{id:mongoose.Types.ObjectId,name:String,status:String}]}]}, {versionKey: false});
const Project = mongoose.model("project", projectSchema);

const taskSchema = new Schema({listid: mongoose.Types.ObjectId, taskname: String, startdate: Date, duedate: Date, mainmember: String, description: String,
    status: String, percent: Number, reccomendation: String, comments:[]}, {versionKey: false});
const Task = mongoose.model("task", taskSchema);


mongoose.connect("mongodb://localhost:27017/teamdb",
    {useUnifiedTopology: true, useNewUrlParser: true});

app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
    });

app.get("/", function(request, responce) {
    responce.send("Server works");
    return("Status code 200: OK");
});

app.post("/signup", jsonParser, function(request,responce) {
    const userEmail = request.body.email;
    const userUsername = request.body.username;
    const userRole = request.body.role;
    const userPassword = request.body.password;
    const user = new User({email: userEmail,username: userUsername, role: userRole, password: userPassword, projects: []});
    User.count({email: userEmail})
        .then(count => {
            if(count>0) {
            responce.send({message: "bademail"});
            } else {
                User.count({username: userUsername})
                    .then(count2 => {
                        if(count2>0) {
                            responce.send({message: "badname"});
                        } else {
                            user.save()
                                .then(item => {
                                    responce.send({message: "saved"});
                                });
                        }
                    });
            }
        })
        .catch(err => {
            responce.send({message: "unable"});
        });
});

app.post("/login", jsonParser, function(request,responce) {
    const userUsername = request.body.username;
    const userPassword = request.body.password;
    User.count({username: userUsername, password: userPassword})
        .then(count => {
            if(count==0) {
                responce.send({message: "baddata"});
            } else {
                User.find({username: userUsername})
                    .then(cursor => {
                        responce.send({message: "login", userinf: cursor});
                    });
            }
        })
        .catch(err => {
            responce.send({message: "unable"});
        });     
});

app.get("/getuser", function(request,responce) {
    User.find({_id:request.query.id},{password:0})
        .then(docs => {
            responce.send(docs);
        })
        .catch(err => {
            responce.send({message: "unable"});
        });
});

app.get("/getproject", function(request,responce) {
    Project.find({_id:request.query.id})
        .then(docs => {
            responce.send(docs);
        })
        .catch(err => {
            responce.send({message: "unable"});
        });
});

app.get("/gettask", function(request,responce) {
    Task.find({_id:request.query.id})
        .then(docs => {
            responce.send(docs);
        })
        .catch(err => {
            responce.send({message: "unable"});
        });
});

app.post("/addproject", jsonParser, function(request,responce) {
    const newprojectname = request.body.projectname;
    const newteamlead = request.body.teamlead;
    const newemail = request.body.email;
    const project = new Project({projectname: newprojectname, teamlead: {name: newteamlead, email: newemail},
        customer: { }, members: [], lists: []});
    project.save()
    .then(item => {
        User.updateOne({username:newteamlead},{$push:{projects:{projectname:newprojectname,id:item._id}}})
            .then(item => {
                responce.send({message: "saved"});
            });
    })
    .catch(err => {
        responce.send({message: "unable"});
    });
});

app.put("/addlist", jsonParser, function(request,responce) {
    const idproject = request.body.projectid;
    const nameoflist = request.body.listname;
    Project.updateOne({_id:idproject},{$push:{lists:{id: new mongoose.Types.ObjectId(),listname:nameoflist,tasks:[]}}})
        .then(item => {
            responce.send({message: "saved"});
        })
        .catch(err => {
            responce.send({message: "unable"});
        });
});

app.post("/addtask", jsonParser, function(request,responce) {
    const idproject = request.body.projectid;
    const idlist = request.body.listid;
    const correctidlist = new mongoose.Types.ObjectId(idlist);
    const newtaskname = request.body.taskname;
    const newstartdate = request.body.startdate;
    const newduedate = request.body.duedate;
    const newmainmember = request.body.mainmember;
    const newdescription = request.body.description;
    const newtask = new Task({listid:correctidlist,taskname:newtaskname,startdate:newstartdate,duedate:newduedate,mainmember:newmainmember,
        description:newdescription,status:"NOT STARTED",percent:0,reccomendation:"",comments:[]});
    newtask.save()
    .then(item => {
        Project.updateOne({_id:idproject,'lists.id':item.listid},{$push:{'lists.$.tasks':{id:item._id,name:item.taskname,status:item.status}}})
            .then(item2 => {
                responce.send({message: "saved"});
            });
    })
    .catch(err => {
        responce.send({message: "unable"});
    })
});


/*В наступних чотирьох запитах замінено request.body.projectid на new mongoose.Types.ObjectId(request.body.projectid)*/
app.put("/addcustomer", jsonParser, function(request,responce) {
    const projectid = new mongoose.Types.ObjectId(request.body.projectid);
    const nameproject = request.body.projectname;
    const customer = request.body.user;
    User.find({username:customer, role: "Customer"})
        .then(item => {
            if(Object.keys(item).length == 0) {
                responce.send({message: "badcustomername"});
            }
            else {
                Project.updateOne({_id:projectid},{$set:{customer:{name:customer,email:item[0].email}}})
                    .then(item2 => {
                        User.updateOne({username:customer},{$push:{projects:{projectname: nameproject, id: projectid}}})
                            .then(item3 => {
                                responce.send({message: "saved"});
                            });
                    });
            }
        })
        .catch(err => {
            responce.send({message: "unable"});
        });
});

app.put("/addmember", jsonParser, function(request,responce) {
    const projectid = new mongoose.Types.ObjectId(request.body.projectid);
    const nameproject = request.body.projectname;
    const member = request.body.user;
    User.find({username:member, role: "Team Member"})
        .then(item => {
            if(Object.keys(item).length == 0) {
                responce.send({message: "badmembername"});
            }
            else {
                Project.updateOne({_id:projectid},{$push:{members:{name:member,email:item[0].email}}})
                    .then(item2 => {
                        User.updateOne({username:member},{$push:{projects:{projectname: nameproject, id: projectid}}})
                            .then(item3 => {
                                responce.send({message: "saved"});
                            });
                    });
            }
        })
        .catch(err => {
            responce.send({message: "unable"});
        });
});

app.put("/removecustomer", jsonParser, function(request,responce) {
    const projectid = new mongoose.Types.ObjectId(request.body.projectid);
    const nameuser = request.body.username;
    Project.updateOne({_id:projectid},{$set:{customer:{}}})
        .then(item => {
            User.updateOne({username:nameuser},{$pull:{projects:{id:projectid}}})
                .then(item2 => {
                    responce.send({message: "removed"});
                })
        })
        .catch(err => {
            responce.send({message: "unable"});
        });
});

app.put("/removemember", jsonParser, function(request,responce) {
    const projectid = new mongoose.Types.ObjectId(request.body.projectid);
    const nameuser = request.body.username;
    Project.updateOne({_id:projectid},{$pull:{members:{name:nameuser}}})
        .then(item => {
            console.log(nameuser);
            console.log(projectid);
            User.updateOne({username:nameuser},{$pull:{projects:{id:projectid}}})
                .then(item2 => {
                    responce.send({message: "removed"});
                })
        })
        .catch(err => {
            responce.send({message: "unable"});
        });
});

app.put("/removelist", jsonParser, function(request,responce) {
    const idproject = request.body.projectid;
    const idlist = request.body.listname;
    const correctidlist = new mongoose.Types.ObjectId(idlist);
    Project.updateOne({_id:idproject},{$pull:{lists:{id:correctidlist}}})
        .then(item => {
            Task.deleteMany({listid: correctidlist})
                .then(item2 => {
                    responce.send({message: "removed"});
                })
        })
        .catch(err => {
            responce.send({message: "unable"});
        });
});

app.put("/renamelist", jsonParser, function(request,responce) {
    const idproject = request.body.projectid;
    const idlist = request.body.listid;
    const nameoflist = request.body.listname;
    const correctidlist = new mongoose.Types.ObjectId(idlist);
    Project.updateOne({_id:idproject, 'lists.id':correctidlist},{$set:{'lists.$.listname': nameoflist}})
        .then(item => {
            responce.send({message: "saved"});
        })
        .catch(err => {
            responce.send({message: "unable"});
        });
});

app.put("/updatetaskinf", jsonParser, function(request,responce) {
    const idproject = request.body.projectid;
    const idtask = request.body.taskid;
    const newname = request.body.name;
    const newstartdate = request.body.startdate;
    const newduedate = request.body.duedate;
    const newmainmember = request.body.mainmember;
    const newdescription = request.body.description;
    Task.findOneAndUpdate({_id:idtask},{$set:{taskname:newname,startdate:newstartdate,duedate:newduedate,
        mainmember:newmainmember,description:newdescription}})
        .then(item => {
            Project.updateOne({_id:idproject,'lists.id':item.listid,'lists.tasks.id':item._id},
                {$set:{'lists.$.tasks.$[task].name':newname}},{arrayFilters:[{'task.id':item._id}]})
                .then(item2 => {
                    responce.send({message: "saved"});
                })
        })
        .catch(err => {
            responce.send({message: "unable"});
        });
});

app.put("/updatetaskstatus", jsonParser, function(request,responce) {
    const idproject = request.body.projectid;
    const idtask = request.body.taskid;
    const newstatus = request.body.taskstatus;
    const newpercent = request.body.taskpercent;
    Task.findOneAndUpdate({_id:idtask},{$set:{status:newstatus,percent:newpercent}})
        .then(item => {
            Project.updateOne({_id:idproject,'lists.id':item.listid,'lists.tasks.id':item._id},
                {$set:{'lists.$.tasks.$[task].status':newstatus}},{arrayFilters:[{'task.id':item._id}]})
                .then(item2 => {
                    responce.send({message: "saved"});
                })
        })
        .catch(err => {
            responce.send({message: "unable"});
        });
});

app.put("/updatetaskreccomendation", jsonParser, function(request,responce) {
    const idtask = request.body.taskid;
    const newreccomendation = request.body.reccomendation;
    Task.updateOne({_id:idtask},{$set:{reccomendation:newreccomendation}})
        .then(item => {
            responce.send({message: "saved"});
        })
        .catch(err => {
            responce.send({message: "unable"});
        });
});

app.put("/addcomment", jsonParser, function(request,responce) {
    const idtask = request.body.taskid;
    const user = request.body.name;
    const newcomment = request.body.comment;
    Task.findOneAndUpdate({_id:idtask},{$push:{comments:{name:user,comment:newcomment}}})
        .then(item => {
            responce.send({message: "saved"});
        })
        .catch(err => {
            responce.send({message: "unable"});
        });
});

app.delete("/deletetask", function(request,responce) {
    const idtask = request.query.taskid;
    const idproject = request.query.projectid;
    Task.findOneAndDelete({_id:idtask})
        .then(item => {
            Project.updateOne({_id:idproject},{$pull:{'lists.$[].tasks':{id:idtask}}})
                .then(item2 => {
                    responce.send({message:"deleted"});
                })
        })
        .catch(err => {
            responce.send({message:"unable"});
        });
});

app.delete("/deleteproject", function(request,responce) {
    const idproject = new mongoose.Types.ObjectId(request.query.projectid);
    User.updateMany({},{$pull:{projects:{id:idproject}}})
        .then(item1 => {
            Project.findOneAndDelete({_id:idproject})
                .then(item2 => {
                    const arraylistid = item2.lists.map((list) => list.id);
                    Task.deleteMany({listid:{$in:arraylistid}})
                        .then(item3 => {
                            User.updateOne({username:item2.teamlead.name},{$pull:{projects:{id:idproject}}})
                            .then(item4 => {
                                responce.send({message:"deleted"});
                            })
                        })
                })
        })
        .catch(err => {
            responce.send({message:"unable"});
        })
});

app.listen(3000);