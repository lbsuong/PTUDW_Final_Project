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

#--------------------------------------------------------------------------------

#----------------------------------admin-----------------------------------------
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
#--------------------------------------------------------------------------------


#----------------------------------users-----------------------------------------
INSERT INTO `users` (
  `username`,
  `password`,
  `name`,
  `email`
)
VALUES (
  "theson",
  "$2a$10$7vQgaayHtzepqU/TUJ7Z4u9w/RKvN6lNeXkHT8PuttKYBvnQmQFhW",
  "Vo The Son",
  "abc@gmail.com"
);

INSERT INTO `users` (
  `username`,
  `password`,
  `name`,
  `email`
)
VALUES (
  "a",
  "$2a$10$7vQgaayHtzepqU/TUJ7Z4u9w/RKvN6lNeXkHT8PuttKYBvnQmQFhW",
  "a",
  "abc@gmail.com"
);

INSERT INTO `users` (
  `username`,
  `password`,
  `name`,
  `email`
)
VALUES (
  "b",
  "$2a$10$7vQgaayHtzepqU/TUJ7Z4u9w/RKvN6lNeXkHT8PuttKYBvnQmQFhW",
  "b",
  "abc@gmail.com"
);

INSERT INTO `users` (
  `username`,
  `password`,
  `name`,
  `email`
)
VALUES (
  "c",
  "$2a$10$7vQgaayHtzepqU/TUJ7Z4u9w/RKvN6lNeXkHT8PuttKYBvnQmQFhW",
  "c",
  "abc@gmail.com"
);
#--------------------------------------------------------------------------------


#----------------------------------category--------------------------------------
INSERT INTO `category`
(`name`, `level`, `countinaweek`)
VALUES
("Development", 1, 0);

INSERT INTO `category`
(`name`, `level`, `countinaweek`)
VALUES
("Python", 2, 0);

INSERT INTO `category`
(`name`, `level`, `countinaweek`)
VALUES
("Machine Learning", 2, 0);

INSERT INTO `category`
(`name`, `level`, `countinaweek`)
VALUES
("Business", 1, 0);

INSERT INTO `category`
(`name`, `level`, `countinaweek`)
VALUES
("Entrepreneuship", 2, 0);

INSERT INTO `category`
(`name`, `level`, `countinaweek`)
VALUES
("Communications", 2, 0);

INSERT INTO `category`
(`name`, `level`, `countinaweek`)
VALUES
("Management", 2, 0);

INSERT INTO `category`
(`name`, `level`, `countinaweek`)
VALUES
("Sales", 2, 0);

INSERT INTO `category`
(`name`, `level`, `countinaweek`)
VALUES
("Business Strategy", 2, 0);

INSERT INTO `category`
(`name`, `level`, `countinaweek`)
VALUES
("Lập trình hướng đối tượng", 2, 0);
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

INSERT INTO `subcat`
(`parentid`, `subid`)
VALUES
(1, 10);
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
  "$2a$10$7vQgaayHtzepqU/TUJ7Z4u9w/RKvN6lNeXkHT8PuttKYBvnQmQFhW",
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
  "$2a$10$7vQgaayHtzepqU/TUJ7Z4u9w/RKvN6lNeXkHT8PuttKYBvnQmQFhW",
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
  "$2a$10$7vQgaayHtzepqU/TUJ7Z4u9w/RKvN6lNeXkHT8PuttKYBvnQmQFhW",
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
  "$2a$10$7vQgaayHtzepqU/TUJ7Z4u9w/RKvN6lNeXkHT8PuttKYBvnQmQFhW",
  "Ardit Sulce",
  "arditsulce@gmail.com",
  "012",
  "Ardit Sulce"
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
  "alsweigart",
  "$2a$10$7vQgaayHtzepqU/TUJ7Z4u9w/RKvN6lNeXkHT8PuttKYBvnQmQFhW",
  "Al Sweigart",
  "alsweigart@gmail.com",
  "012",
  "Al Sweigart"
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
  "andreineagoie",
  "$2a$10$7vQgaayHtzepqU/TUJ7Z4u9w/RKvN6lNeXkHT8PuttKYBvnQmQFhW",
  "Andrei Neagoie",
  "andreineagoie@gmail.com",
  "012",
  "Andrei Neagoie"
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
  "ziyadyehia",
  "$2a$10$7vQgaayHtzepqU/TUJ7Z4u9w/RKvN6lNeXkHT8PuttKYBvnQmQFhW",
  "Ziyad Yehia",
  "ziyadyehia@gmail.com",
  "012",
  "Ziyad Yehia"
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
  "coltsteele",
  "$2a$10$7vQgaayHtzepqU/TUJ7Z4u9w/RKvN6lNeXkHT8PuttKYBvnQmQFhW",
  "Colt Steele",
  "coltsteele@gmail.com",
  "012",
  "Colt Steele"
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
  "zaidsabih",
  "$2a$10$7vQgaayHtzepqU/TUJ7Z4u9w/RKvN6lNeXkHT8PuttKYBvnQmQFhW",
  "Zaid Sabih",
  "zaidsabih@gmail.com",
  "012",
  "Zaid Sabih"
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
  "angelayu",
  "$2a$10$7vQgaayHtzepqU/TUJ7Z4u9w/RKvN6lNeXkHT8PuttKYBvnQmQFhW",
  "Angela Yu",
  "angelayu@gmail.com",
  "012",
  "Angela Yu"
);
#--------------------------------------------------------------------------------


#----------------------------------course----------------------------------------
INSERT INTO `course` (
  `categoryid`,
  `title`,
  `lecturer`,
  `tinydes`,
  `fulldes`,
  `bigthumbnaillink`,
  `smallthumbnaillink`,
  `lastupdatedate`,
  `numstudent`,
  `numstudentinaweek`,
  `numview`,
  `rate`,
  `numrate`,
  `originalprice`,
  `promotionalprice`,
  `status`
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
  "/public/courses/1/big_thumbnail.jpg",
  "/public/courses/1/small_thumbnail.jpg",
  "2020-12-1",
  1184493,
  1184493,
  1184493,
  4.6,
  338109,
  129.99,
  9.99,
  0
);

INSERT INTO `course` (
  `categoryid`,
  `title`,
  `lecturer`,
  `tinydes`,
  `fulldes`,
  `bigthumbnaillink`,
  `smallthumbnaillink`,
  `lastupdatedate`,
  `numstudent`,
  `numstudentinaweek`,
  `numview`,
  `rate`,
  `numrate`,
  `originalprice`,
  `promotionalprice`,
  `status`
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
  "/public/courses/2/big_thumbnail.jpg",
  "/public/courses/2/small_thumbnail.jpg",
  "2020-12-2",
  729703,
  729703,
  729703,
  4.5,
  138093,
  129.99,
  9.99,
  0
);

INSERT INTO `course` (
  `categoryid`,
  `title`,
  `lecturer`,
  `tinydes`,
  `fulldes`,
  `bigthumbnaillink`,
  `smallthumbnaillink`,
  `lastupdatedate`,
  `numstudent`,
  `numstudentinaweek`,
  `numview`,
  `rate`,
  `numrate`,
  `originalprice`,
  `promotionalprice`,
  `status`
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
  "/public/courses/3/big_thumbnail.jpg",
  "/public/courses/3/small_thumbnail.jpg",
  "2020-12-3",
  414917,
  414917,
  414917,
  4.6,
  92855,
  129.99,
  9.99,
  0
);

INSERT INTO `course` (
  `categoryid`,
  `title`,
  `lecturer`,
  `tinydes`,
  `fulldes`,
  `bigthumbnaillink`,
  `smallthumbnaillink`,
  `lastupdatedate`,
  `numstudent`,
  `numstudentinaweek`,
  `numview`,
  `rate`,
  `numrate`,
  `originalprice`,
  `promotionalprice`,
  `status`
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
  "/public/courses/4/big_thumbnail.jpg",
  "/public/courses/4/small_thumbnail.jpg",
  "2020-12-4",
  268725,
  268725,
  268725,
  4.5,
  65451,
  129.99,
  9.99,
  0
);

INSERT INTO `course` (
  `categoryid`,
  `title`,
  `lecturer`,
  `tinydes`,
  `fulldes`,
  `bigthumbnaillink`,
  `smallthumbnaillink`,
  `lastupdatedate`,
  `numstudent`,
  `numstudentinaweek`,
  `numview`,
  `rate`,
  `numrate`,
  `originalprice`,
  `promotionalprice`,
  `status`
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
  "/public/courses/5/big_thumbnail.jpg",
  "/public/courses/5/small_thumbnail.jpg",
  "2020-12-5",
  207919,
  207919,
  207919,
  4.5,
  45246,
  129.99,
  9.99,
  0
);

INSERT INTO `course` (
  `categoryid`,
  `title`,
  `lecturer`,
  `tinydes`,
  `fulldes`,
  `bigthumbnaillink`,
  `smallthumbnaillink`,
  `lastupdatedate`,
  `numstudent`,
  `numstudentinaweek`,
  `numview`,
  `rate`,
  `numrate`,
  `originalprice`,
  `promotionalprice`,
  `status`
)
VALUES (
  2,
  "Learning Python for Data Analysis and Visualization",
  "joseportilla",
  "Learn python and how to use it to analyze,visualize and present data. Includes tons of sample code and hours of video!",
  "Have an intermediate skill level of Python programming.
Use the Jupyter Notebook Environment.
Use the numpy library to create and manipulate arrays.
Use the pandas module with Python to create and structure data.
Learn how to work with various data formats within python, including: JSON,HTML, and MS Excel Worksheets.
Create data visualizations using matplotlib and the seaborn modules with python.
Have a portfolio of various data analysis projects.",
  "/public/courses/6/big_thumbnail.jpg",
  "/public/courses/6/small_thumbnail.jpg",
  "2020-12-5",
  164854,
  164854,
  164854,
  4.3,
  15537,
  129.99,
  9.99,
  0
);

INSERT INTO `course` (
  `categoryid`,
  `title`,
  `lecturer`,
  `tinydes`,
  `fulldes`,
  `bigthumbnaillink`,
  `smallthumbnaillink`,
  `lastupdatedate`,
  `numstudent`,
  `numstudentinaweek`,
  `numview`,
  `rate`,
  `numrate`,
  `originalprice`,
  `promotionalprice`,
  `status`
)
VALUES (
  2,
  "Automate the Boring Stuff with Python Programming",
  "alsweigart",
  "A practical programming course for office workers, academics, and administrators who want to improve their productivity.",
  "Automate tasks on their computer by writing simple Python programs.
Write programs that can do text pattern recognition with \"regular expressions\".
Programmatically generate and update Excel spreadsheets.
Parse PDFs and Word documents.
Crawl web sites and pull information from online sources.
Write programs that send out email notifications.
Use Python's debugging tools to quickly figure out bugs in your code.
Programmatically control the mouse and keyboard to click and type for you.",
  "/public/courses/7/big_thumbnail.jpg",
  "/public/courses/7/small_thumbnail.jpg",
  "2020-12-5",
  772271,
  772271,
  772271,
  4.6,
  77623,
  50.39,
  10.79,
  0
);

INSERT INTO `course` (
  `categoryid`,
  `title`,
  `lecturer`,
  `tinydes`,
  `fulldes`,
  `bigthumbnaillink`,
  `smallthumbnaillink`,
  `lastupdatedate`,
  `numstudent`,
  `numstudentinaweek`,
  `numview`,
  `rate`,
  `numrate`,
  `originalprice`,
  `promotionalprice`,
  `status`
)
VALUES (
  2,
  "Python and Django Full Stack Web Developer Bootcamp",
  "joseportilla",
  "Learn to build websites with HTML , CSS , Bootstrap , Javascript , jQuery , Python 3 , and Django!",
  "Create a fully functional web site using the Full-Stack with Django 1.11
Learn how to use HTML to create website content
Use CSS to create beautifully styled sites
Learn how to take advantage of Bootstrap to quickly style sites
Use Javascript to interact with sites on the Front-End
Learn how to use jQuery to quickly work with the DOM
Understand HTTP requests
Create fantastic landing pages
Learn the power of Python to code out your web applications
Use Django as a back end for the websites
Implement a full Models-Views-Templates structure for your site",
  "/public/courses/8/big_thumbnail.jpg",
  "/public/courses/8/small_thumbnail.jpg",
  "2020-12-5",
  140316,
  140316,
  140316,
  4.6,
  35933,
  129.99,
  9.99,
  0
);

INSERT INTO `course` (
  `categoryid`,
  `title`,
  `lecturer`,
  `tinydes`,
  `fulldes`,
  `bigthumbnaillink`,
  `smallthumbnaillink`,
  `lastupdatedate`,
  `numstudent`,
  `numstudentinaweek`,
  `numview`,
  `rate`,
  `numrate`,
  `originalprice`,
  `promotionalprice`,
  `status`
)
VALUES (
  2,
  "Python for Financial Analysis and Algorithmic Trading",
  "joseportilla",
  "Learn numpy , pandas , matplotlib , quantopian , finance , and more for algorithmic trading with Python!",
  "Use NumPy to quickly work with Numerical Data
Use Pandas for Analyze and Visualize Data
Use Matplotlib to create custom plots
Learn how to use statsmodels for Time Series Analysis
Calculate Financial Statistics, such as Daily Returns, Cumulative Returns, Volatility, etc..
Use Exponentially Weighted Moving Averages
Use ARIMA models on Time Series Data
Calculate the Sharpe Ratio
Optimize Portfolio Allocations
Understand the Capital Asset Pricing Model
Learn about the Efficient Market Hypothesis
Conduct algorithmic Trading on Quantopian",
  "/public/courses/9/big_thumbnail.jpg",
  "/public/courses/9/small_thumbnail.jpg",
  "2020-12-5",
  97305,
  97305,
  97305,
  4.5,
  14463,
  129.99,
  9.99,
  0
);

INSERT INTO `course` (
  `categoryid`,
  `title`,
  `lecturer`,
  `tinydes`,
  `fulldes`,
  `bigthumbnaillink`,
  `smallthumbnaillink`,
  `lastupdatedate`,
  `numstudent`,
  `numstudentinaweek`,
  `numview`,
  `rate`,
  `numrate`,
  `originalprice`,
  `promotionalprice`,
  `status`
)
VALUES (
  2,
  "Python for Financial Analysis and Algorithmic Trading",
  "joseportilla",
  "Learn numpy , pandas , matplotlib , quantopian , finance , and more for algorithmic trading with Python!",
  "Use NumPy to quickly work with Numerical Data
Use Pandas for Analyze and Visualize Data
Use Matplotlib to create custom plots
Learn how to use statsmodels for Time Series Analysis
Calculate Financial Statistics, such as Daily Returns, Cumulative Returns, Volatility, etc..
Use Exponentially Weighted Moving Averages
Use ARIMA models on Time Series Data
Calculate the Sharpe Ratio
Optimize Portfolio Allocations
Understand the Capital Asset Pricing Model
Learn about the Efficient Market Hypothesis
Conduct algorithmic Trading on Quantopian",
  "/public/courses/10/big_thumbnail.jpg",
  "/public/courses/10/small_thumbnail.jpg",
  "2020-12-5",
  97305,
  97305,
  97305,
  4.5,
  14463,
  129.99,
  9.99,
  0
);

INSERT INTO `course` (
  `categoryid`,
  `title`,
  `lecturer`,
  `tinydes`,
  `fulldes`,
  `bigthumbnaillink`,
  `smallthumbnaillink`,
  `lastupdatedate`,
  `numstudent`,
  `numstudentinaweek`,
  `numview`,
  `rate`,
  `numrate`,
  `originalprice`,
  `promotionalprice`,
  `status`
)
VALUES (
  2,
  "Complete Python Developer in 2021: Zero to Mastery",
  "andreineagoie",
  "How to become a Python 3 Developer and get hired! Build 12+ projects, learn Web Development, Machine Learning + more!",
  "Become a professional Python Developer and get hired
Master modern Python 3.9(latest) fundamentals as well as advanced topics",
  "/public/courses/11/big_thumbnail.jpg",
  "/public/courses/11/small_thumbnail.jpg",
  "2020-12-5",
  96474,
  96474,
  96474,
  4.7,
  23456,
  129.99,
  9.99,
  0
);

INSERT INTO `course` (
  `categoryid`,
  `title`,
  `lecturer`,
  `tinydes`,
  `fulldes`,
  `bigthumbnaillink`,
  `smallthumbnaillink`,
  `lastupdatedate`,
  `numstudent`,
  `numstudentinaweek`,
  `numview`,
  `rate`,
  `numrate`,
  `originalprice`,
  `promotionalprice`,
  `status`
)
VALUES (
  2,
  "The Python Bible™ | Everything You Need to Program in Python",
  "ziyadyehia",
  "Build 11 Projects and go from Beginner to Pro in Python with the World's Most Fun Project-Based Python Course!",
  "Gain a Solid & Unforgettable Understanding of the Python Programming Language.
Gain the Python Skills Necessary to Learn In-Demand Topics, such as Data Science, Web Development, AI and more.",
  "/public/courses/12/big_thumbnail.jpg",
  "/public/courses/12/small_thumbnail.jpg",
  "2020-12-5",
  108906,
  108906,
  108906,
  4.6,
  30971,
  129.99,
  9.99,
  0
);

INSERT INTO `course` (
  `categoryid`,
  `title`,
  `lecturer`,
  `tinydes`,
  `fulldes`,
  `bigthumbnaillink`,
  `smallthumbnaillink`,
  `lastupdatedate`,
  `numstudent`,
  `numstudentinaweek`,
  `numview`,
  `rate`,
  `numrate`,
  `originalprice`,
  `promotionalprice`,
  `status`
)
VALUES (
  2,
  "The Modern Python 3 Bootcamp",
  "coltsteele",
  "A Unique Interactive Python Experience With Nearly 200 Exercises and Quizzes",
  "Learn all the coding fundamentals in Python!
Work through nearly 200 exercises and quizzes!",
  "/public/courses/13/big_thumbnail.jpg",
  "/public/courses/13/small_thumbnail.jpg",
  "2020-12-5",
  79895,
  79895,
  79895,
  4.7,
  21478,
  129.99,
  9.99,
  0
);

INSERT INTO `course` (
  `categoryid`,
  `title`,
  `lecturer`,
  `tinydes`,
  `fulldes`,
  `bigthumbnaillink`,
  `smallthumbnaillink`,
  `lastupdatedate`,
  `numstudent`,
  `numstudentinaweek`,
  `numview`,
  `rate`,
  `numrate`,
  `originalprice`,
  `promotionalprice`,
  `status`
)
VALUES (
  2,
  "Learn Python & Ethical Hacking From Scratch",
  "zaidsabih",
  "Start from 0 & learn both topics simultaneously from scratch by writing 20+ hacking programs",
  "170+ videos on Python programming & ethical hacking
Install hacking lab & needed software (on Windows, OS X and Linux)",
  "/public/courses/14/big_thumbnail.jpg",
  "/public/courses/14/small_thumbnail.jpg",
  "2020-12-5",
  68214,
  68214,
  68214,
  4.6,
  12156,
  129.99,
  9.99,
  0
);

INSERT INTO `course` (
  `categoryid`,
  `title`,
  `lecturer`,
  `tinydes`,
  `fulldes`,
  `bigthumbnaillink`,
  `smallthumbnaillink`,
  `lastupdatedate`,
  `numstudent`,
  `numstudentinaweek`,
  `numview`,
  `rate`,
  `numrate`,
  `originalprice`,
  `promotionalprice`,
  `status`
)
VALUES (
  2,
  "100 Days of Code - The Complete Python Pro Bootcamp for 2021",
  "angelayu",
  "Master Python by building 100 projects in 100 days. Learn to build websites, games, apps, plus scraping and data science",
  "Be able to program in Python professionally
Master the Python programming language by building 100 projects over 100 days
Create a portfolio of 100 Python projects to apply for developer jobs
Be able to build fully fledged websites and web apps with Python
Be able to use Python for data science and machine learning
Build games like Blackjack, Pong and Snake using Python
Build GUIs and Desktop applications with Python
Learn to use modern frameworks like Selenium, Beautiful Soup, Request, Flask, Pandas, NumPy, Scikit Learn, Plotly, Matplotlib, Seaborn,",
  "/public/courses/15/big_thumbnail.jpg",
  "/public/courses/15/small_thumbnail.jpg",
  "2020-12-5",
  65022,
  65022,
  65022,
  4.8,
  10849,
  129.99,
  9.99,
  0
);
#--------------------------------------------------------------------------------