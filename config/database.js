if (process.env.NODE_ENV === 'production') {
  console.log('production');
  module.exports = {
    mongoURI:
      'mongodb+srv://lvioleg:MLAolwwEpPZQ55p3@cluster0-lc718.gcp.mongodb.net/test?retryWrites=true&w=majority'
  };
} else {
  module.exports = {
    mongoURI: 'mongodb://localhost/vidjot-dev'
  };
}
