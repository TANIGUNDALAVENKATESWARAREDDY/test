const cookiesSameSite = process.env.NODE_ENV === 'production' ? 'None' : 'Lax';
const cookiesMaxAge =5*3600000;

module.exports={
    cookiesSameSite,
    cookiesMaxAge
}