DROP DATABASE IF EXISTS `udemy`;
CREATE DATABASE `udemy` CHARACTER SET utf8mb4;
USE `udemy`;

CREATE TABLE `users` (
  `username` VARCHAR(10) NOT NULL,
  `password` VARCHAR(60) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `picture` varchar(100),
  PRIMARY KEY (`username`)
);
  
CREATE TABLE `lecturer` (
  `username` VARCHAR(10) NOT NULL,
  `password` VARCHAR(60) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `bankid` BIGINT NOT NULL,
  `bankname` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`username`)
);

CREATE TABLE `moderator` (
  `username` VARCHAR(10) NOT NULL,
  `password` VARCHAR(60) NOT NULL,
  `name` VARCHAR(45) NOT NULL
);
  
CREATE TABLE `category` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `level` INT NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `subcat`(
  `parentid` INT NOT NULL,
  `subid` INT NOT NULL,
  CONSTRAINT `fk1` FOREIGN KEY (`parentid`) REFERENCES category(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk2` FOREIGN KEY (`subid`) REFERENCES category(`id`) ON DELETE CASCADE
);
  
CREATE TABLE `course` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `categoryid` INT NOT NULL,
  `title` VARCHAR(45) NOT NULL,
  `lecturer` VARCHAR(10) NOT NULL,
  `tinydes` VARCHAR(100) NOT NULL,
  `fulldes` VARCHAR(1000) NOT NULL,
  `numstudent` INT NOT NULL,
  `rate` FLOAT NOT NULL,
  `numrate` INT NOT NULL,
  `price` FLOAT NOT NULL,
  CONSTRAINT `fk_c_1` FOREIGN KEY (`lecturer`) REFERENCES `lecturer`(`username`) ON DELETE CASCADE,
  CONSTRAINT `fk_c_2` FOREIGN KEY (`categoryid`) REFERENCES `category`(`id`) ON DELETE CASCADE,
  PRIMARY KEY (`id`)
);
  
CREATE TABLE `ownedcourse` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userid` VARCHAR(10) NOT NULL,
  `courseid` INT NOT NULL,
  `date` DATETIME NOT NULL,
  CONSTRAINT `fk_o_1` FOREIGN KEY (`userid`) REFERENCES `users`(`username`) ON DELETE CASCADE,
  CONSTRAINT `fk_o_2` FOREIGN KEY (`courseid`) REFERENCES `course`(`id`) ON DELETE CASCADE,
  PRIMARY KEY(`id`)
);
  
CREATE TABLE `rating`(
 `id` INT NOT NULL AUTO_INCREMENT,
 `courseid` INT NOT NULL,
 `studentid` VARCHAR(10) NOT NULL,
 `paidid` INT NOT NULL,
 `rate` INT NOT NULL,
 `ratedetail` VARCHAR(500) NOT NULL,
 `hidden` boolean NOT NULL,
 CONSTRAINT `fk_r_1` FOREIGN KEY (`courseid`) REFERENCES `course`(`id`) ON DELETE CASCADE,
 CONSTRAINT `fk_r_2` FOREIGN KEY (`studentid`) REFERENCES `users`(`username`) ON DELETE CASCADE,
 CONSTRAINT `fk_r_3` FOREIGN KEY (`paidid`) REFERENCES `ownedcourse`(`id`) ON DELETE CASCADE,
 PRIMARY KEY(`id`)
);


#--------------------------------------------------------------------------------

INSERT INTO `moderator` (`username`, `password`, `name`) VALUES ("admin", "$2a$10$7vQgaayHtzepqU/TUJ7Z4u9w/RKvN6lNeXkHT8PuttKYBvnQmQFhW", "admin");
INSert into `users` (`username`, `password`, `name`, `email`) value("thesonvo", "$2a$10$7vQgaayHtzepqU/TUJ7Z4u9w/RKvN6lNeXkHT8PuttKYBvnQmQFhW", "Vo The Son", "abc@gmail.com");

INSERT INTO `category` (`name`, `level`) VALUES ("IT", 1);
INSERT INTO `category` (`name`, `level`) VALUES ("Lập trình Web", 2);
INSERT INTO `category` (`name`, `level`) VALUES ("Lập trình thiết bị di động", 2);
INSERT INTO `category` (`name`, `level`) VALUES ("Business", 1);
INSERT INTO `category` (`name`, `level`) VALUES ("Entrepreneuship", 2);
INSERT INTO `category` (`name`, `level`) VALUES ("Communications", 2);
INSERT INTO `category` (`name`, `level`) VALUES ("Management", 2);
INSERT INTO `category` (`name`, `level`) VALUES ("Sales", 2);
INSERT INTO `category` (`name`, `level`) VALUES ("Business Strategy", 2);

INSERT INTO `subcat` (`parentid`, `subid`) VALUES (1, 2);
INSERT INTO `subcat` (`parentid`, `subid`) VALUES (1, 3);
INSERT INTO `subcat` (`parentid`, `subid`) VALUES (4, 5);
INSERT INTO `subcat` (`parentid`, `subid`) VALUES (4, 6);
INSERT INTO `subcat` (`parentid`, `subid`) VALUES (4, 7);
INSERT INTO `subcat` (`parentid`, `subid`) VALUES (4, 8);
INSERT INTO `subcat` (`parentid`, `subid`) VALUES (4, 9);
