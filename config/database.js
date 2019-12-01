if (process.env.NODE_ENV === 'production') {
  module.exports = {
    mongoURI:
      'mongodb+srv://lvioleg:MLAolwwEpPZQ55p3@cluster0-lc718.gcp.mongodb.net/vidjot-prod?retryWrites=true&w=majority'
  };
} else {
  module.exports = {
    mongoURI: 'mongodb://localhost/vidjot-dev'
  };
}
