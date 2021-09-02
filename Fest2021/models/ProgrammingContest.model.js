const mongoose = require("mongoose");
const PCSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true,
        unique: true,
    },
    institution: {
        type: String,
        required: true,
    },
    category:{
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
        unique: true,
    },
    coach:{
        name: {
            type: String,
            required: true,
        },
        contact: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        tshirt: {
            type: String,
            required: true,
        }
    },

    teamLeader:{
        name: {
            type: String,
            required: true,
        },
        contact: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        tshirt: {
            type: String,
            required: true,
        }
    },


    teamMember1:{
            name: {
                type: String,
                required: true,
            },
            contact: {
                type: String,
                required: true,
            },
            email: {
                type: String,
                required: true,
            },
            tshirt: {
                type: String,
                required: true,
            }
    },

    teamMember2:{
        name: {
            type: String,
            required: true,
        },
        contact: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        tshirt: {
            type: String,
            required: true,
        }
    },
    total: {
        type: Number,
        required: true,
    },
    paid: {
        type: Number,
        required: true,
    },
    selected: {
        type: Boolean,
        default:false
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

const Team = mongoose.model("Team", PCSchema);
module.exports = Team;
