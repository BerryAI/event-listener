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


CREATE TABLE `music_event` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `block_id` VARCHAR(45) NOT NULL,
  `contract_address` VARCHAR(80) NULL,
  `user_address` VARCHAR(80) NULL,
  `event_type` VARCHAR(45) NULL,
  `description` TEXT NULL,
  `datetime` DATETIME NULL,
  PRIMARY KEY (`id`));
