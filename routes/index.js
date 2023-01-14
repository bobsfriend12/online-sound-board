const deleteBoard = require("./deleteBoard");
const getBoards = require("./getBoards");
const newBoard = require("./newBoard");
const updateBoard = require("./updateBoard");
const uploadFile = require("./uploadFile");
const root = require("./root");

module.exports = {
  root,
  getBoards,
  newBoard,
  uploadFile,
  updateBoard,
  deleteBoard,
};
