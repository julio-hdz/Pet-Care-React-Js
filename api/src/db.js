require('dotenv').config();
const { Sequelize, Op} = require('sequelize');
const fs = require('fs');
const path = require('path');
const {
  DB_USER, DB_PASSWORD, DB_HOST,DATABASE,
} = process.env;

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DATABASE}`, {
  logging: false, 
  native: false, 
});
const basename = path.basename(__filename);

const modelDefiners = [];


fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });
modelDefiners.forEach(model => model(sequelize));

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

const { User, Post, Review } = sequelize.models;

User.hasMany(Post, {as: "posteos", foreignKey: {name:"author_id", allowNull: false}})
Post.belongsTo(User,{as: "author", foreignKey: {name:"author_id", allowNull: false}})
User.hasMany(Review, {as: "reviews", foreignKey: "reviewedUser_id" })
Review.belongsTo(User, {as: 'reviwedUser', foreignKey: 'reviewedUser_id'})



module.exports = {
  ...sequelize.models, 
  conn: sequelize,
  Op,     
};