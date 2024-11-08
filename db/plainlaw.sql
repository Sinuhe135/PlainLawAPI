create database plainlaw;
use plainlaw;

create table USER(
	id int primary key auto_increment,
    name varchar(30) not null,
    patLastName varchar(30) not null,
    matLastName varchar(30) null,
    phone varchar(15) not null,
    status enum('active','unactive') not null default 'active',
	registerDate timestamp  not null default current_timestamp
);

create table AUTH(
	id int primary key,
    username varchar(20) unique not null,
    password varchar(60) not null,
    foreign key (id) references USER (id)
);

create table SESSION(
	id int primary key auto_increment,
    idAuth int not null,
    startDate timestamp  not null default current_timestamp,
    foreign key (idAuth) references AUTH(id)
);

create table SUMMARY(
	id int primary key auto_increment,
    site varchar(50) not null,
    content text not null,
    notes tinytext null,
	registerDate timestamp  not null default current_timestamp,
    idUser int not null,
    foreign key (idUser) references USER	(id)
);

