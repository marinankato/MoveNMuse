import dotenv from "dotenv";
dotenv.config();

const conf = {
  MONGODB_URI: String(process.env.MONGO_DB_URL),
  STRIPE_SECRET_KEY: String(process.env.STRIPE_SECRET_KEY),
  PORT: String(process.env.PORT),
  JWT_SECRET: String(process.env.JWT_SECRET), 
  CORS_ORIGIN1: String(process.env.CORS_ORIGIN1),
  CORS_ORIGIN2: String(process.env.CORS_ORIGIN2),
  CORS_ORIGIN3: String(process.env.CORS_ORIGIN3),
};
// to check
// console.log("JWT_SECRET Loaded:", process.env.JWT_SECRET);

export default conf;
