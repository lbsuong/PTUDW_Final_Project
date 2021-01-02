DROP DATABASE IF EXISTS `udemy`;
CREATE DATABASE `udemy` CHARACTER SET utf8mb4;
USE `udemy`;

CREATE TABLE `users` (
  `username` VARCHAR(30) NOT NULL,
  `password` VARCHAR(60) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `picture` varchar(100),
  PRIMARY KEY (`username`)
);
  
CREATE TABLE `lecturer` (
  `username` VARCHAR(30) NOT NULL,
  `password` VARCHAR(60) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `bankid` BIGINT NOT NULL,
  `bankname` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`username`)
);

CREATE TABLE `moderator` (
  `username` VARCHAR(30) NOT NULL,
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
  `title` VARCHAR(100) NOT NULL,
  `lecturer` VARCHAR(30) NOT NULL,
  `tinydes` VARCHAR(500) NOT NULL,
  `fulldes` VARCHAR(1000) NOT NULL,
  `lastupdatedate` DATETIME NOT NULL,
  `thumbnailsmall` VARCHAR(100) NOT NULL,
  `thumbnailbig` VARCHAR(100) NOT NULL,
  `numstudent` INT NOT NULL,
  `numview` INT NOT NULL,
  `rate` FLOAT NOT NULL,
  `numrate` INT NOT NULL,
  `price` FLOAT NOT NULL,
  CONSTRAINT `fk_c_1` FOREIGN KEY (`lecturer`) REFERENCES `lecturer`(`username`) ON DELETE CASCADE,
  CONSTRAINT `fk_c_2` FOREIGN KEY (`categoryid`) REFERENCES `category`(`id`) ON DELETE CASCADE,
  PRIMARY KEY (`id`)
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

#----------------------------------moderator-------------------------------------
INSERT INTO `moderator` (
  `username`,
  `password`,
  `name`
)
VALUES (
  "admin",
  "$2a$10$7vQgaayHtzepqU/TUJ7Z4u9w/RKvN6lNeXkHT8PuttKYBvnQmQFhW",
  "admin"
);

INSERT INTO `users` (
  `username`,
  `password`,
  `name`,
  `email`
)
VALUES (
  "thesonvo",
  "$2a$10$7vQgaayHtzepqU/TUJ7Z4u9w/RKvN6lNeXkHT8PuttKYBvnQmQFhW",
  "Vo The Son",
  "abc@gmail.com"
);
#--------------------------------------------------------------------------------


#----------------------------------category--------------------------------------
INSERT INTO `category`
(`name`, `level`)
VALUES
("Development", 1);

INSERT INTO `category`
(`name`, `level`)
VALUES
("Python", 2);

INSERT INTO `category`
(`name`, `level`)
VALUES
("Machine Learning", 2);

INSERT INTO `category`
(`name`, `level`)
VALUES
("Business", 1);

INSERT INTO `category`
(`name`, `level`)
VALUES
("Entrepreneuship", 2);

INSERT INTO `category`
(`name`, `level`)
VALUES
("Communications", 2);

INSERT INTO `category`
(`name`, `level`)
VALUES
("Management", 2);

INSERT INTO `category`
(`name`, `level`)
VALUES
("Sales", 2);

INSERT INTO `category`
(`name`, `level`)
VALUES
("Business Strategy", 2);
#--------------------------------------------------------------------------------


#----------------------------------subcat----------------------------------------
INSERT INTO `subcat`
(`parentid`, `subid`)
VALUES
(1, 2);

INSERT INTO `subcat`
(`parentid`, `subid`)
VALUES
(1, 3);

INSERT INTO `subcat`
(`parentid`, `subid`)
VALUES
(4, 5);

INSERT INTO `subcat`
(`parentid`, `subid`)
VALUES
(4, 6);

INSERT INTO `subcat`
(`parentid`, `subid`)
VALUES
(4, 7);

INSERT INTO `subcat`
(`parentid`, `subid`)
VALUES
(4, 8);

INSERT INTO `subcat`
(`parentid`, `subid`)
VALUES
(4, 9);
#--------------------------------------------------------------------------------


#----------------------------------lecturer--------------------------------------
INSERT INTO `lecturer` (
  `username`,
  `password`,
  `name`,
  `email`,
  `bankid`,
  `bankname`
)
VALUES (
  "joseportilla",
  "a",
  "Jose Portilla",
  "joseportilla@gmail.com",
  "123",
  "Jose Portilla"
);

INSERT INTO `lecturer` (
  `username`,
  `password`,
  `name`,
  `email`,
  `bankid`,
  `bankname`
)
VALUES (
  "kirilleremenko",
  "a",
  "Kirill Eremenko",
  "kirilleremenko@gmail.com",
  "456",
  "Kirill Eremenko"
);

INSERT INTO `lecturer` (
  `username`,
  `password`,
  `name`,
  `email`,
  `bankid`,
  `bankname`
)
VALUES (
  "timbuchalka",
  "a",
  "Tim Buchalka",
  "timbuchalka@gmail.com",
  "789",
  "Tim Buchalka"
);

INSERT INTO `lecturer` (
  `username`,
  `password`,
  `name`,
  `email`,
  `bankid`,
  `bankname`
)
VALUES (
  "arditsulce",
  "a",
  "Ardit Sulce",
  "arditsulce@gmail.com",
  "012",
  "Ardit Sulce"
);
#--------------------------------------------------------------------------------


#----------------------------------course----------------------------------------
INSERT INTO `course` (
  `categoryid`,
  `title`,
  `lecturer`,
  `tinydes`,
  `fulldes`,
  `lastupdatedate`,
  `thumbnailsmall`,
  `thumbnailbig`,
  `numstudent`,
  `numview`,
  `rate`,
  `numrate`,
  `price`
)
VALUES (
  2,
  "2020 Complete Python Bootcamp From Zero to Hero in Python",
  "joseportilla",
  "Learn Python like a Professional Start from the basics and go all the way to creating your own applications and games",
  "Learn to use Python professionally, learning both Python 2 and Python 3!
Create games with Python, like Tic Tac Toe and Blackjack!
Learn advanced Python features, like the collections module and how to work with timestamps!
Learn to use Object Oriented Programming with classes!
Understand complex topics, like decorators.
Understand how to use both the Jupyter Notebook and create .py files
Get an understanding of how to create GUIs in the Jupyter Notebook system!
Build a complete understanding of Python from the ground up!",
  "2020-12-1",
  "public/img/thumnail/small/1.jpg",
  "public/img/thumnail/big/1.jpg",
  1184493,
  1184493,
  4.6,
  338109,
  9.99
);

INSERT INTO `course` (
  `categoryid`,
  `title`,
  `lecturer`,
  `tinydes`,
  `fulldes`,
  `lastupdatedate`,
  `thumbnailsmall`,
  `thumbnailbig`,
  `numstudent`,
  `numview`,
  `rate`,
  `numrate`,
  `price`
)
VALUES (
  2,
  "Machine Learning A-Z™: Hands-On Python & R In Data Science",
  "kirilleremenko",
  "Learn to create Machine Learning Algorithms in Python and R from two Data Science experts. Code templates included.",
  "Master Machine Learning on Python & R
Have a great intuition of many Machine Learning models
Make accurate predictions
Make powerful analysis
Make robust Machine Learning models
Create strong added value to your business
Use Machine Learning for personal purpose
Handle specific topics like Reinforcement Learning, NLP and Deep Learning
Handle advanced techniques like Dimensionality Reduction
Know which Machine Learning model to choose for each type of problem
Build an army of powerful Machine Learning models and know how to combine them to solve any problem",
  "2020-12-2",
  "public/img/thumnail/small/2.jpg",
  "public/img/thumnail/big/2.jpg",
  729703,
  729703,
  4.5,
  138093,
  9.99
);

INSERT INTO `course` (
  `categoryid`,
  `title`,
  `lecturer`,
  `tinydes`,
  `fulldes`,
  `lastupdatedate`,
  `thumbnailsmall`,
  `thumbnailbig`,
  `numstudent`,
  `numview`,
  `rate`,
  `numrate`,
  `price`
)
VALUES (
  3,
  "Python for Data Science and Machine Learning Bootcamp",
  "joseportilla",
  "Learn how to use NumPy, Pandas, Seaborn , Matplotlib , Plotly , Scikit-Learn , Machine Learning, Tensorflow , and more!",
  "Use Python for Data Science and Machine Learning
Use Spark for Big Data Analysis
Implement Machine Learning Algorithms
Learn to use NumPy for Numerical Data
Learn to use Pandas for Data Analysis
Learn to use Matplotlib for Python Plotting
Learn to use Seaborn for statistical plots
Use Plotly for interactive dynamic visualizations
Use Plotly for interactive dynamic visualizations
K-Means Clustering
Logistic Regression
Linear Regression
Random Forest and Decision Trees
Natural Language Processing and Spam Filters
Neural Networks
Support Vector Machines",
  "2020-12-3",
  "public/img/thumnail/small/3.jpg",
  "public/img/thumnail/big/3.jpg",
  414917,
  414917,
  4.6,
  92855,
  9.99
);

INSERT INTO `course` (
  `categoryid`,
  `title`,
  `lecturer`,
  `tinydes`,
  `fulldes`,
  `lastupdatedate`,
  `thumbnailsmall`,
  `thumbnailbig`,
  `numstudent`,
  `numview`,
  `rate`,
  `numrate`,
  `price`
)
VALUES (
  2,
  "Learn Python Programming Masterclass",
  "timbuchalka",
  "This Python For Beginners Course Teaches You The Python Language Fast. Includes Python Online Training With Python 3",
  "Have a fundamental understanding of the Python programming language.
Have the skills and understanding of Python to confidently apply for Python programming jobs.
Acquire the pre-requisite Python skills to move into specific branches - Machine Learning, Data Science, etc..
Add the Python Object-Oriented Programming (OOP) skills to your résumé.
Understand how to create your own Python programs.
Learn Python from experienced professional software developers.
Understand both Python 2 and Python 3.",
  "2020-12-4",
  "public/img/thumnail/small/4.jpg",
  "public/img/thumnail/big/4.jpg",
  268725,
  268725,
  4.5,
  65451,
  9.99
);

INSERT INTO `course` (
  `categoryid`,
  `title`,
  `lecturer`,
  `tinydes`,
  `fulldes`,
  `lastupdatedate`,
  `thumbnailsmall`,
  `thumbnailbig`,
  `numstudent`,
  `numview`,
  `rate`,
  `numrate`,
  `price`
)
VALUES (
  2,
  "The Python Mega Course: Build 10 Real World Applications",
  "arditsulce",
  "A complete practical Python course for both beginners & intermediates! Master Python 3 by making 10 amazing Python apps.",
  "Go from a total beginner to a confident Python programmer
Create 10 real-world Python programs (no toy programs)
Strengthen your skills with bonus practice activities throughout the course
Create an English Thesaurus app that returns definitions of English words
Create a personal website entirely in Python
Create a mobile app that improves your mood
Create a portfolio website and publish it on a real server
Create a desktop app for storing data for books
Create a webcam app that detects moving objects
Create a web scraper that extracts real-estate data
Create a data visualization app
Create a database app
Create a geocoding web app
Send automated emails
Analyze and visualize data
Use Python to schedule programs based on computer events.
Learn OOP (Object-Oriented Programming)
Learn GUIs (Graphical-User Interfaces)",
  "2020-12-5",
  "public/img/thumnail/small/5.jpg",
  "public/img/thumnail/big/5.jpg",
  207919,
  207919,
  4.5,
  45246,
  9.99
);
#--------------------------------------------------------------------------------