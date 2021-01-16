DROP DATABASE IF EXISTS `udemy`;
CREATE DATABASE `udemy` CHARACTER SET utf8mb4;
USE `udemy`;	

CREATE TABLE `users` (
  `username` VARCHAR(30) NOT NULL,
  `password` VARCHAR(60) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `picture` varchar(100),
  `verification` boolean NOT NULL,
  PRIMARY KEY (`username`)
);
  
CREATE TABLE `lecturer` (
  `username` VARCHAR(30) NOT NULL,
  `password` VARCHAR(60) NOT NULL,
  `picture` VARCHAR(100),
  `name` VARCHAR(45) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `bankid` BIGINT NOT NULL,
  `bankname` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`username`)
);

CREATE TABLE `admin` (
  `username` VARCHAR(30) NOT NULL,
  `password` VARCHAR(60) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `email` VARCHAR(100) NOT NULL
);

CREATE TABLE `otp` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(100) NOT NULL,
  `code` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_ot_1` FOREIGN KEY (`username`) REFERENCES `user`(`username`) ON DELETE CASCADE
)
CREATE TABLE `category` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `level` INT NOT NULL,
  `countinaweek` INT NOT NULL,
  PRIMARY KEY (`id`),
  FULLTEXT (`name`)
);

CREATE TABLE `subcat`(
  `parentid` INT NOT NULL,
  `subid` INT NOT NULL
);
  
CREATE TABLE `course` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `categoryid` INT NOT NULL,
  `title` VARCHAR(100) NOT NULL,
  `lecturer` VARCHAR(30) NOT NULL,
  `tinydes` VARCHAR(500) NOT NULL,
  `fulldes` VARCHAR(1000) NOT NULL,
  `bigthumbnaillink` VARCHAR(100),
  `smallthumbnaillink` VARCHAR(100),
  `lastupdatedate` DATETIME NOT NULL,
  `numstudent` INT NOT NULL,
  `numstudentinaweek` INT NOT NULL,
  `numview` INT NOT NULL,
  `rate` FLOAT NOT NULL,
  `numrate` INT NOT NULL,
  `originalprice` FLOAT NOT NULL,
  `promotionalprice` FLOAT NOT NULL,
  `status` boolean NOT NULL,
  CONSTRAINT `fk_c_1` FOREIGN KEY (`lecturer`) REFERENCES `lecturer`(`username`) ON DELETE CASCADE,
  CONSTRAINT `fk_c_2` FOREIGN KEY (`categoryid`) REFERENCES `category`(`id`) ON DELETE CASCADE,
  PRIMARY KEY (`id`),
  FULLTEXT (`title`)
);

CREATE TABLE `lesson`(
  `id` INT NOT NULL AUTO_INCREMENT,
  `course` INT NOT NULL,
  `title` VARCHAR(100) NOT NULL,
  `rank` INT NOT NULL, 
  `detail` VARCHAR(1000) NOT NULL,
  `date` DATETIME NOT NULL,
  `video` VARCHAR(1000) NOT NULL,
  CONSTRAINT `fk_l_1` FOREIGN KEY (`course`) REFERENCES `course`(`id`) ON DELETE CASCADE,
  PRIMARY KEY(`id`)
);

CREATE TABLE `ownedcourse` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userid` VARCHAR(30) NOT NULL,
  `courseid` INT NOT NULL,
  `date` DATETIME NOT NULL,
  CONSTRAINT `fk_o_1` FOREIGN KEY (`userid`) REFERENCES `users`(`username`) ON DELETE CASCADE,
  CONSTRAINT `fk_o_2` FOREIGN KEY (`courseid`) REFERENCES `course`(`id`) ON DELETE CASCADE,
  PRIMARY KEY(`id`)
);
  
CREATE TABLE `rating`(
 `id` INT NOT NULL AUTO_INCREMENT,
 `courseid` INT NOT NULL,
 `studentid` VARCHAR(30) NOT NULL,
 `rate` FLOAT NOT NULL,
 `ratedetail` VARCHAR(500) NOT NULL,
 `date` DATETIME NOT NULL,
 CONSTRAINT `fk_r_1` FOREIGN KEY (`courseid`) REFERENCES `course`(`id`) ON DELETE CASCADE,
 CONSTRAINT `fk_r_2` FOREIGN KEY (`studentid`) REFERENCES `users`(`username`) ON DELETE CASCADE,
 PRIMARY KEY(`id`)
);

CREATE TABLE `cart` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `studentid` VARCHAR(30) NOT NULL,
  `courseid` INT NOT NULL,
  PRIMARY KEY(`id`),
  CONSTRAINT `fk_ca_1` FOREIGN KEY (`courseid`) REFERENCES `course`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ca_2` FOREIGN KEY (`studentid`) REFERENCES `users`(`username`) ON DELETE CASCADE
);


CREATE TABLE `wish` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `studentid` VARCHAR(30) NOT NULL,
  `courseid` INT NOT NULL,
  PRIMARY KEY(`id`),
  CONSTRAINT `fk_wi_1` FOREIGN KEY (`courseid`) REFERENCES `course`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_wi_2` FOREIGN KEY (`studentid`) REFERENCES `users`(`username`) ON DELETE CASCADE
);

CREATE TABLE `progress` (
  `username` VARCHAR(30) NOT NULL,
  `courseid` INT NOT NULL,
  `lessonid` INT NOT NULL
);

#----------------------------------------------------

INSERT INTO `admin` (
  `username`,
  `password`,
  `name`,
  `email`
)
VALUES (
  "admin",
  "$2a$10$7vQgaayHtzepqU/TUJ7Z4u9w/RKvN6lNeXkHT8PuttKYBvnQmQFhW",
  "admin",
  "admin@gmail.com"
);