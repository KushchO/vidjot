const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ensureAuthentication } = require('../helper/auth');

//Load Idea model
require('../models/ideas');
const Idea = mongoose.model('ideas');

//Idea Index Page
router.get('/', ensureAuthentication, (req, res) => {
  Idea.find({ user: req.user.id })
    .sort({ date: 'desc' })
    .then(ideas => {
      res.render('ideas/index', {
        ideas: ideas
      });
    });
});

//Add Idea Form
router.get('/add', ensureAuthentication, (req, res) => {
  res.render('./ideas/add');
});

//Add Idea Form
router.get('/edit/:id', ensureAuthentication, (req, res) => {
  Idea.findOne({ _id: req.params.id }).then(idea => {
    if (idea.user != req.user.id) {
      req.flash('error_msg', 'Not Authorized for this Idea');
      res.redirect('/ideas');
    } else {
      res.render('./ideas/edit', {
        idea: idea
      });
    }
  });
});

//Process Form
router.post('/', ensureAuthentication, (req, res) => {
  let errors = [];
  if (!req.body.title) {
    errors.push({ text: 'Please add a title' });
  }
  if (!req.body.details) {
    errors.push({ text: 'Please add a details' });
  }
  if (errors.length > 0) {
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newIdea = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    };
    new Idea(newIdea).save().then(idea => {
      req.flash('success_msg', 'Video Idea Added');
      res.redirect('/ideas');
    });
  }
});

//Edit Form Process
router.put('/:id', ensureAuthentication, (req, res) => {
  //Another way to do it
  // Idea.findOne({
  //   _id: req.params.id
  // }).then(idea => {
  //   idea.title = req.body.title;
  //   idea.details = req.body.details;
  //   idea.save().then(idea => {
  //     res.redirect('/ideas');
  //   });
  // });
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    if (idea.user != req.user.id) {
      req.flash('error_msg', 'Not Authorized for this Idea');
      res.redirect('/ideas');
    } else {
      idea.title = req.body.title;
      idea.details = req.body.details;
      idea.save();

      req.flash('success_msg', 'Video Idea Updated');
      res.redirect('/ideas');
    }
  });
});

//My delete realization
router.get('/delete/:id', ensureAuthentication, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    if (idea.user != req.user.id) {
      req.flash('error_msg', 'Not Authorized for this Idea');
      res.redirect('/ideas');
    } else {
      idea.remove();
      req.flash('success_msg', 'Video Idea Removed');
      res.redirect('/ideas');
    }
  });
});

module.exports = router;
