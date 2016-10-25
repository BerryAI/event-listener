CREATE TABLE `contract_event` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `block_id` varchar(20) DEFAULT NULL,
  `msg_sender` varchar(45) DEFAULT NULL,
  `msg_value` varchar(60) DEFAULT NULL,
  `contract_address` varchar(50) DEFAULT NULL,
  `block_hash` varchar(90) DEFAULT NULL,
  `log_index` varchar(45) DEFAULT NULL,
  `transaction_hash` varchar(90) DEFAULT NULL,
  `transaction_index` int(11) DEFAULT NULL,
  `event_name` varchar(45) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `datetime` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;


--
-- All DB tables that will record blockchain events
--

CREATE TABLE `music_play` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `block_id` VARCHAR(45) NOT NULL,
  `contract_address` VARCHAR(80) NULL,
  `play_count` INT NULL,
  `datetime` DATETIME NULL,
  PRIMARY KEY (`id`));


CREATE TABLE `music_work_release_bc` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `block_id` VARCHAR(45) NOT NULL,
  `contract_address` VARCHAR(80) NULL,
  `owner_address` VARCHAR(80) NULL,
  `title` VARCHAR(255) NULL,
  `artist` VARCHAR(255) NULL,
  `work_type` VARCHAR(45) NULL,
  `image_url` VARCHAR(255) NULL,
  `metadata_url` VARCHAR(255) NULL,
  `is_processed` INT(1) NULL,
  `datetime` DATETIME NULL,
  PRIMARY KEY (`id`));


CREATE TABLE `music_license_release_bc` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `block_id` VARCHAR(45) NOT NULL,
  `contract_address` VARCHAR(80) NULL,
  `work_id` VARCHAR(80) NULL,
  `is_processed` INT(1) NULL,
  `datetime` DATETIME NULL,
  PRIMARY KEY (`id`));


CREATE TABLE `music_license_update_bc` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `block_id` VARCHAR(45) NOT NULL,
  `contract_address` VARCHAR(80) NULL,
  `owner_address` VARCHAR(80) NULL,
  `version` VARCHAR(45) NULL,
  `artist_name` VARCHAR(150) NULL,
  `song_name` VARCHAR(255) NULL,
  `album_name` VARCHAR(255) NULL,
  `resource_url` VARCHAR(150) NULL,
  `artwork_url` VARCHAR(150) NULL,
  `is_processed` INT(1) NULL,
  `datetime` DATETIME NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `music_tip` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `block_id` VARCHAR(45) NULL,
  `contract_address` VARCHAR(80) NULL,
  `tip_amount` VARCHAR(45) NULL,
  `tip_count` VARCHAR(45) NULL,
  `datetime` DATETIME NULL,
  PRIMARY KEY (`id`));
