function converToSlug(str){
  // Replace all special characters | symbol by a space
  str = str.replace(/[^a-zA-Z0-9]/m, ' ').toLowerCase();
  // Replace space with a dash
  str = str.replace(/\s+/m, '-');

  return str;
}

module.exports = converToSlug;