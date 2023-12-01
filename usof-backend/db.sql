CREATE DATABASE IF NOT EXISTS usof;
CREATE USER IF NOT EXISTS 'amorozenko'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON usof.* TO 'amorozenko'@'localhost';

USE usof;

CREATE TABLE IF NOT EXISTS users(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    login VARCHAR(15) NOT NULL UNIQUE,
    password VARCHAR(75) NOT NULL,
    name VARCHAR(255) DEFAULT '',
    email VARCHAR(200) NOT NULL UNIQUE,
    photo VARCHAR(256) DEFAULT 'avatar/avatar.png',
    rating INT NOT NULL DEFAULT 0,
    register_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    about LONGTEXT,
    role ENUM('admin', 'user') DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS posts(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    title VARCHAR(300) NOT NULL,
    publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    type ENUM('active', 'inactive') DEFAULT 'active',
    content LONGTEXT NOT NULL,
    photo VARCHAR(256),
    rating INT NOT NULL DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS categories(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(256) NOT NULL UNIQUE,
    description VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS post_categories (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    category_id INT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    content MEDIUMTEXT NOT NULL,
    post_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS avatars(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    file VARCHAR(256) NOT NULL DEFAULT "avatar.png",
    size INT NOT NULL,
    path VARCHAR(256) NOT NULL DEFAULT 'avatar/avatar.png',
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- CREATE TABLE IF NOT EXISTS posts_covers(
--     id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
--     file VARCHAR(256) NOT NULL,
--     size INT NOT NULL,
--     path VARCHAR(256) NOT NULL,
--     post_id INT,
--     FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
-- );

CREATE TABLE IF NOT EXISTS likeposts(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    post_id INT,
    publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    type ENUM('like', 'dislike'),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS likecomments(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT ,
    comment_id INT,
    publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    type ENUM('like', 'dislike'),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS blockedposts(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS favoriteposts(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS favoriteauthors(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    author_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pinnedcategories (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);