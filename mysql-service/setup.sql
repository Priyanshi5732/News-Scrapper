CREATE database if not exists priyanshi;
use priyanshi;
CREATE TABLE college_news(
   my_id       int(16) auto_increment, 
   title VARCHAR (20)     NOT NULL,
   PRIMARY KEY (my_id)
);

INSERT INTO college_news (title)
VALUES ('Title Sample 1');

INSERT INTO college_news (title)
VALUES ('Title Sample 2');

INSERT INTO college_news (title)
VALUES ('Title Sample 3');

INSERT INTO college_news (title)
VALUES ('Title Sample 4');
