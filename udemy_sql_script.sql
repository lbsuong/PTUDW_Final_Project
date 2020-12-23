CREATE database `udemy` character set utf8mb4;
CREATE TABLE `udemy`.`users` (
  `username` VARCHAR(10) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`username`));
  
  CREATE TABLE `udemy`.`lecturer` (
  `username` VARCHAR(10) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `bankid` INT NOT NULL,
  `bankname` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`username`));
  
  CREATE TABLE `udemy`.`category` (
  `id` VARCHAR(10) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`));
  
  CREATE TABLE `udemy`.`subcat`(
  `parentid` varchar(10) not null,
  `subid` varchar(10) not null,
  constraint fk1 foreign key (`parentid`) references category(`id`) on delete cascade,
  constraint fk2 foreign key (`subid`) references category(`id`) on delete cascade
  );
  
CREATE TABLE `udemy`.`course` (
  `id` VARCHAR(10) NOT NULL,
  `category` varchar(10) not null,
  `title` VARCHAR(45) NOT NULL,
  `lecturer` VARCHAR(45) NOT NULL,
  `tinydes` varchar(100) NOT NULL,
  `fulldes` varchar(1000) NOT NULL,
  `numstudent` int NOT NULL,
  `rate` float not null,
  `numrate` int not null,
  `price` float not null,
  constraint fk_c_1 foreign key (`lecturer`) references lecturer(`username`) on delete cascade,
  constraint fk_c_2 foreign key (`category`) references category(`id`) on delete cascade,
  PRIMARY KEY (`id`));
  
  CREATE TABLE `udemy`.`ownedcourse`(
  `id` varchar(10) not null,
  `userid` varchar(10) not null,
  `courseid` varchar(10) not null,
  `date` datetime not null,
  constraint fk_o_1 foreign key (`userid`) references users(`username`) on delete cascade,
  constraint fk_o_2 foreign key (`courseid`) references course(`id`) on delete cascade,
  primary key(`id`)
  );
  
CREATE TABLE `udemy`.`rating`(
 `id` varchar(10) not null,
 `courseid` varchar(10) not null,
 `studentid` varchar(10) not null,
 `piadid` varchar(10) not null,
 `rate` int not null,
 `ratedetail` varchar(500) not null,
 `hidden` boolean not null,
 constraint fk_r_1 foreign key (`courseid`) references course(`id`) on delete cascade,
 constraint fk_r_2 foreign key (`studentid`) references users(`username`) on delete cascade,
 constraint fk_r_3 foreign key (`piadid`) references ownedcourse(`id`) on delete cascade,
 primary key(`id`)
);