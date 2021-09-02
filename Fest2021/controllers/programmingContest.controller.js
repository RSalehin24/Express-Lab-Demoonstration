const contestTeam = require("../models/ProgrammingContest.model");
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
  service : "Gmail",
  auth: {
      user: "ictfestcse@gmail.com",
      pass: "r1124.S@96#"
  }
});

const getPC = (req, res) => {
  res.render("programming-contest/register.ejs", { error: req.flash("error") });
};

const postPC = (req, res) => {
const { 
    teamname,
    institution, 
    category, 
    coachname,
    coachcontact, 
    coachemail, 
    coachtshirt,
    leadername,
    leadercontact,
    leaderemail,
    leadertshirt,
    monename,
    monecontact,
    moneemail,
    monetshirt,
    mtwoname, 
    mtwocontact,
    mtwoemail,
    mtwotshirt 
} = req.body;

let registrationFee = 0;
if (category == "School") {
    registrationFee = 250;
} else if (category == "College") {
    registrationFee = 400;
} else {
    registrationFee = 500;
}

const total = registrationFee;
const paid = 0;
const selected = false;
const code = crypto.randomBytes(8).toString("hex");

let error = "";

contestTeam.findOne({ name: teamname, institution: institution }).then((team) => {
    if (team) {
    error = "Team with this name already exists!";
    req.flash("error", error);
    res.redirect("/ProgrammingContest/register");
    } else {
    const team = new contestTeam({
        teamName: teamname,
        institution: institution,
        category: category,
        code: code,
        coach: {
            name: coachname,
            contact: coachcontact,
            email: coachemail,
            tshirt: coachtshirt,
        },
        teamLeader: {
            name: leadername,
            contact: leadercontact,
            email: leaderemail,
            tshirt: leadertshirt,
        },
        teamMember1: {
            name: monename,
            contact: monecontact,
            email: moneemail,
            tshirt: monetshirt,
        },
        teamMember2: {
            name: mtwoname,
            contact: mtwocontact,
            email: mtwoemail,
            tshirt: mtwotshirt,
        },
        total: total,
        paid: paid,
        selected: selected,
    });
    team
        .save()
        .then(() => {
          
          transporter.sendMail({
            from: "ictfest@outlook.com", 
            to: team.coach.email,
            subject: "ICTFest Programming Contest's code for your team",
            html: "<h2> Hi "+`${team.coach.name}`+"!</h2><br><p>Here is the unique identification code for your Programming Contest's team competition in this year's ICTFest: <br><br>"+`${team.code}`+"<br><br><br>The team details is given below:<br><br>Name: "+`${team.teamName}`+"<br>Coach: You are the Coach<br>Leader: "+`${team.teamLeader.name}`+"<br>Member 1: "+`${team.teamMember1.name}`+"<br>Member 2: "+`${team.teamMember2.name}`+"<br><br>Please preserve the code for future use.</p>"
          });

          transporter.sendMail({
            from: "ictfest@outlook.com", 
            to: team.teamLeader.email,
            subject: "ICTFest Programming Contest's code for your team",
            html: "<h2> Hi "+`${team.teamLeader.name}`+"!</h2><br><p>Here is the unique identification code for your Programming Contest's team competition in this year's ICTFest: <br><br>"+`${team.code}`+"<br><br><br>The team details is given below:<br><br>Name: "+`${team.teamName}`+"<br>Coach: "+`${team.coach.name}`+"<br>Leader: You are the team leader"+"<br>Member 1: "+`${team.teamMember1.name}`+"<br>Member 2: "+`${team.teamMember2.name}`+"<br><br>Please preserve the code for future use.</p>"
          });
        
          transporter.sendMail({
            from: "ictfest@outlook.com", 
            to: team.teamMember1.email,
            subject: "ICTFest Programming Contest's code for your team",
            html: "<h2> Hi "+`${team.teamMember1.name}`+"!</h2><br><p>Here is the unique identification code for your Programming Contest's team competition in this year's ICTFest: <br><br>"+`${team.code}`+"<br><br><br>The team details is given below:<br><br>Name: "+`${team.teamName}`+"<br>Coach: "+`${team.coach.name}`+"<br>Leader:"+`${team.teamLeader.name}`+"<br>Member 1: You are the Member One"+"<br>Member 2: "+`${team.teamMember2.name}`+"<br><br>Please preserve the code for future use.</p>"
          });
        
          transporter.sendMail({
            from: "ictfest@outlook.com", 
            to: team.teamMember2.email,
            subject: "ICTFest Programming Contest's code for your team",
            html: "<h2> Hi "+`${team.teamMember2.name}`+"!</h2><br><p>Here is the unique identification code for your Programming Contest's team competition in this year's ICTFest: <br><br>"+`${team.code}`+"<br><br><br>The team details is given below:<br><br>Name: "+`${team.teamName}`+"<br>Coach: "+`${team.coach.name}`+"<br>Leader:"+`${team.teamLeader.name}`+"<br>Member 1:"+`${team.teamMember1.name}`+"<br>Member 2: You are the Member Two"+"<br><br>Please preserve the code for future use.</p>"
          });       

          error = "Team has been registered successfully!";
          req.flash("error", error);
          res.redirect("/ProgrammingContest/register");
        })
        .catch((err) => {
        console.log(`${err}`);
          error = "An unexpected error occured while registering the team";
          req.flash("error", error);
          res.redirect("/ProgrammingContest/register");
        });
    }
});
};
  
  const getTeamList = (req, res) => {
    let all_teams = [];
    let error = "";
    contestTeam.find()
      .then((data) => {
        all_teams = data;
        res.render("programming-contest/list.ejs", {
          error: req.flash("error"),
          teams: all_teams,
        });
      })
      .catch(() => {
        error = "Failed to retrieve data!";
        res.render("programming-contest/list.ejs", {
          error: req.flash("error", error),
          teams: all_teams,
        });
      });
  };
  
  const deleteTeam = (req, res) => {
    let error = "";
  
    contestTeam.deleteOne({ _id: req.params.id })
      .then(() => {
        let error = "Data has been deleted successfully!";
        req.flash("error", error);
        res.redirect("/ProgrammingContest/list");
      })
      .catch(() => {
        let error = "Failed to delete data";
        req.flash("error", error);
        res.redirect("/ProgrammingContest/list");
      });
  };
  
  const paymentDoneTeam = (req, res) => {
    const id = req.params.id;
  
    contestTeam.findOne({ _id: id })
      .then((participant) => {
        participant.paid = participant.total;
        participant
          .save()
          .then(() => {
            let error = "Payment completed successfully!";
            req.flash("error", error);
            res.redirect("/ProgrammingContest/list");
          })
          .catch(() => {
            let error = "Data could not be updated!";
            req.flash("error", error);
            res.redirect("/ProgrammingContest/list");
          });
      })
      .catch(() => {
        let error = "Data could not be updated!";
        req.flash("error", error);
        res.redirect("/ProgrammingContest/list");
      });
  };
  
  const selectTeam = (req, res) => {
    const id = req.params.id;
  
    contestTeam.findOne({ _id: id })
      .then((participant) => {
        participant.selected = true;
        participant
          .save()
          .then(() => {
            let error = "Team has been selected successfully!";
            req.flash("error", error);
            res.redirect("/ProgrammingContest/list");
          })
          .catch(() => {
            let error = "Data could not be updated!";
            req.flash("error", error);
            res.redirect("/ProgrammingContest/list");
          });
      })
      .catch(() => {
        let error = "Data could not be updated!";
        req.flash("error", error);
        res.redirect("/ProgrammingContest/list");
      });
  };
  
  const getEditTeam = (req, res) => {
    let error = "";
    contestTeam.findById(req.params.id)
      .then((team) => {
        res.render("programming-contest/edit-team.ejs", {
          error: req.flash("error"),
          team: team,
        });
      })
      .catch(() => {
        let error = "Failed to retrieve the teams!";
        req.flash("error", error);
        res.redirect("/ProgrammingContest/list");
      });
  };
  
  const postEditTeam = (req, res) => {
    const { 
        teamname,
        institution, 
        category, 
        coachname,
        coachcontact, 
        coachemail, 
        coachtshirt,
        leadername,
        leadercontact,
        leaderemail,
        leadertshirt,
        monename,
        monecontact,
        moneemail,
        monetshirt,
        mtwoname, 
        mtwocontact,
        mtwoemail,
        mtwotshirt 
    } = req.body;
    
    let registrationFee = 0;
    if (category == "School") {
      registrationFee = 250;
    } else if (category == "College") {
      registrationFee = 400;
    } else {
      registrationFee = 500;
    }
    const total = registrationFee;
  
    let error = "";
    
    contestTeam.findOne({ _id: req.body._id })
      .then((team) => {
        team.teamName = teamname;
        team.institution = institution;
        team.category = category;
        team.coach.name = coachname;
        team.coach.contact = coachcontact;
        team.coach.email = coachemail;
        team.coach.tshirt = coachtshirt;
        team.teamLeader.name = leadername;
        team.teamLeader.contact = leadercontact;
        team.teamLeader.email = leaderemail;
        team.teamLeader.tshirt = leadertshirt;
        team.teamMember1.name = monename;
        team.teamMember1.contact = monecontact;
        team.teamMember1.email = moneemail;
        team.teamMember1.tshirt = monetshirt;
        team.teamMember2.name = mtwoname;
        team.teamMember2.contact = mtwocontact;
        team.teamMember2.email = mtwoemail;
        team.teamMember2.tshirt = mtwotshirt;
        team.total = total;
        team
          .save()
          .then(() => {
            transporter.sendMail({
              from: "ictfest@outlook.com", 
              to: team.coach.email,
              subject: "ICTFest Programming Contest's code for your team",
              html: "<h2> Hi "+`${team.coach.name}`+"!</h2><br><p>Here is the unique identification code for your Programming Contest's team competition in this year's ICTFest: <br><br>"+`${team.code}`+"<br><br><br>The team details is given below:<br><br>Name: "+`${team.teamName}`+"<br>Coach: You are the Coach<br>Leader: "+`${team.teamLeader.name}`+"<br>Member 1: "+`${team.teamMember1.name}`+"<br>Member 2: "+`${team.teamMember2.name}`+"<br><br>Please preserve the code for future use.<br>You have received this email because something in your team details have been changed.</p>"
            });
  
            transporter.sendMail({
              from: "ictfest@outlook.com", 
              to: team.teamLeader.email,
              subject: "ICTFest Programming Contest's code for your team",
              html: "<h2> Hi "+`${team.teamLeader.name}`+"!</h2><br><p>Here is the unique identification code for your Programming Contest's team competition in this year's ICTFest: <br><br>"+`${team.code}`+"<br><br><br>The team details is given below:<br><br>Name: "+`${team.teamName}`+"<br>Coach: "+`${team.coach.name}`+"<br>Leader: You are the team leader"+"<br>Member 1: "+`${team.teamMember1.name}`+"<br>Member 2: "+`${team.teamMember2.name}`+"<br><br>Please preserve the code for future use.<br>You have received this email because something in your team details have been changed.</p>"
            });

            transporter.sendMail({
              from: "ictfest@outlook.com", 
              to: team.teamMember1.email,
              subject: "ICTFest Programming Contest's code for your team",
              html: "<h2> Hi "+`${team.teamMember1.name}`+"!</h2><br><p>Here is the unique identification code for your Programming Contest's team competition in this year's ICTFest: <br><br>"+`${team.code}`+"<br><br><br>The team details is given below:<br><br>Name: "+`${team.teamName}`+"<br>Coach: "+`${team.coach.name}`+"<br>Leader:"+`${team.teamLeader.name}`+"<br>Member 1: You are the Member One"+"<br>Member 2: "+`${team.teamMember2.name}`+"<br><br>Please preserve the code for future use.<br>You have received this email because something in your team details have been changed.</p>"
            });
          
            transporter.sendMail({
              from: "ictfest@outlook.com", 
              to: team.teamMember2.email,
              subject: "ICTFest Programming Contest's code for your team",
              html: "<h2> Hi "+`${team.teamMember2.name}`+"!</h2><br><p>Here is the unique identification code for your Programming Contest's team competition in this year's ICTFest: <br><br>"+`${team.code}`+"<br><br><br>The team details is given below:<br><br>Name: "+`${team.teamName}`+"<br>Coach: "+`${team.coach.name}`+"<br>Leader:"+`${team.teamLeader.name}`+"<br>Member 1:"+`${team.teamMember1.name}`+"<br>Member 2: You are the Member Two"+"<br><br>Please preserve the code for future use.<br>You have received this email because something in your team details have been changed.</p>"
            });

          
         
            let error =  "Team has been edited successfully!";
            req.flash("error", error);
            res.redirect("/ProgrammingContest/list");
          })
          .catch(() => {
            let error =  "Team could not be edited!";
            req.flash("error", error);
            res.redirect("/ProgrammingContest/list");
          });
      })
      .catch((err) => {
        console.log(`${err}`);
        let error =  "Team could not be found!";
        req.flash("error", error);
        res.redirect("/ProgrammingContest/list");
      });   
  
  };
  
  module.exports = {
    getPC,
    postPC,
    getTeamList,
    deleteTeam,
    paymentDoneTeam,
    selectTeam,
    getEditTeam,
    postEditTeam
  };
  