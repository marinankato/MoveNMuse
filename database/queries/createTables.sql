DROP TABLE IF EXISTS Users;
CREATE TABLE "Users" (
    "userID"    INTEGER,
    "firstName"    VARCHAR(50),
    "lastName"    VARCHAR(50),
    "email" VARCHAR(150) UNIQUE,
    "password" VARCHAR(50),
    "role" VARCHAR(25),
    "phoneNo" VARCHAR(10),
    "loginDate" TEXT,
    "logoutDate" TEXT,
    PRIMARY KEY("userID" AUTOINCREMENT)
);