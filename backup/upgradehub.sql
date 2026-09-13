-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: upgradehub
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `upgradehub`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `upgradehub` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `upgradehub`;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK9emlp6m95v5er2bcqkjsw48he` (`user_id`),
  CONSTRAINT `FKl70asp4l4w0jmbm1tqyofho4o` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (1,2),(2,3);
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_item`
--

DROP TABLE IF EXISTS `cart_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_item` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `quantity` int NOT NULL,
  `cart_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_cart_item_cart_product` (`cart_id`,`product_id`),
  KEY `FKjcyd5wv4igqnw413rgxbfu4nv` (`product_id`),
  CONSTRAINT `FK1uobyhgl1wvgt1jpccia8xxs3` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`),
  CONSTRAINT `FKjcyd5wv4igqnw413rgxbfu4nv` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_item`
--

LOCK TABLES `cart_item` WRITE;
/*!40000 ALTER TABLE `cart_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `my_pc`
--

DROP TABLE IF EXISTS `my_pc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `my_pc` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `cpu_id` bigint DEFAULT NULL,
  `gpu_id` bigint DEFAULT NULL,
  `ram_id` bigint DEFAULT NULL,
  `ssd_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `motherboard_id` bigint DEFAULT NULL,
  `power_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKie3o0qsq7ggixccaw494pdyve` (`user_id`),
  KEY `FKbkcagcen7pwqfph03wpaoeym7` (`cpu_id`),
  KEY `FKqv441t0xgyus9pcancnu3ad9g` (`gpu_id`),
  KEY `FK41gs9nfu4vyg0cev44l33il1k` (`ram_id`),
  KEY `FKj14ylw616oq0actbhgmkkhtfp` (`ssd_id`),
  KEY `FKfvy1nkqvgtypjnrpjgbmmjh1v` (`motherboard_id`),
  KEY `FK8pg2spqcif1iu4m0gxks2kkrr` (`power_id`),
  CONSTRAINT `FK41gs9nfu4vyg0cev44l33il1k` FOREIGN KEY (`ram_id`) REFERENCES `product` (`id`),
  CONSTRAINT `FK8pg2spqcif1iu4m0gxks2kkrr` FOREIGN KEY (`power_id`) REFERENCES `product` (`id`),
  CONSTRAINT `FKbkcagcen7pwqfph03wpaoeym7` FOREIGN KEY (`cpu_id`) REFERENCES `product` (`id`),
  CONSTRAINT `FKfvy1nkqvgtypjnrpjgbmmjh1v` FOREIGN KEY (`motherboard_id`) REFERENCES `product` (`id`),
  CONSTRAINT `FKj14ylw616oq0actbhgmkkhtfp` FOREIGN KEY (`ssd_id`) REFERENCES `product` (`id`),
  CONSTRAINT `FKnahr2g6qe1bpmjwb7c3tyt4c7` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FKqv441t0xgyus9pcancnu3ad9g` FOREIGN KEY (`gpu_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `my_pc`
--

LOCK TABLES `my_pc` WRITE;
/*!40000 ALTER TABLE `my_pc` DISABLE KEYS */;
INSERT INTO `my_pc` VALUES (1,2,1,3,NULL,1,NULL,NULL),(2,2,1,3,NULL,2,NULL,NULL),(3,NULL,1,NULL,NULL,3,NULL,NULL);
/*!40000 ALTER TABLE `my_pc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_item`
--

DROP TABLE IF EXISTS `order_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_item` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_price` bigint NOT NULL,
  `quantity` int NOT NULL,
  `subtotal` bigint NOT NULL,
  `order_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKt4dc2r9nbvbujrljv3e23iibt` (`order_id`),
  KEY `FK551losx9j75ss5d6bfsqvijna` (`product_id`),
  CONSTRAINT `FK551losx9j75ss5d6bfsqvijna` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `FKt4dc2r9nbvbujrljv3e23iibt` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_item`
--

LOCK TABLES `order_item` WRITE;
/*!40000 ALTER TABLE `order_item` DISABLE KEYS */;
INSERT INTO `order_item` VALUES (1,799000,1,799000,1,1),(2,1100000,1,1100000,2,4);
/*!40000 ALTER TABLE `order_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ordered_at` datetime(6) NOT NULL,
  `status` enum('CANCELLED','COMPLETED','ORDERED') NOT NULL,
  `total_price` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKel9kyl84ego2otj2accfd8mr7` (`user_id`),
  CONSTRAINT `FKel9kyl84ego2otj2accfd8mr7` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'2026-09-13 02:34:22.639193','ORDERED',799000,3),(2,'2026-09-13 21:54:07.204435','ORDERED',1100000,2);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `brand` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` bigint DEFAULT NULL,
  `stock` int DEFAULT NULL,
  `performance_score` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,'NVIDIA','GPU','RTX 4070 Ti',799000,9,82),(2,'Intel','CPU','i5-14600K',349000,20,78),(3,'Samsung','RAM','DDR5 32GB',159000,50,70),(4,'NVIDIA','GPU','RTX 5070',1100000,9,95),(6,'NVIDIA','GPU','RTX 5090',3299000,5,180),(7,'NVIDIA','GPU','RTX 5090',3299000,5,180);
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_spec`
--

DROP TABLE IF EXISTS `product_spec`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_spec` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `cpu_socket` varchar(255) DEFAULT NULL,
  `gpu_interface` varchar(255) DEFAULT NULL,
  `memory_type` varchar(255) DEFAULT NULL,
  `power_capacity` int DEFAULT NULL,
  `power_consumption` int DEFAULT NULL,
  `recommended_power` int DEFAULT NULL,
  `storage_interface` varchar(255) DEFAULT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK3h76kmof47u7pyvdw4eb302c5` (`product_id`),
  CONSTRAINT `FKe1voctn4pw0tw1sxq6gvaaant` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_spec`
--

LOCK TABLES `product_spec` WRITE;
/*!40000 ALTER TABLE `product_spec` DISABLE KEYS */;
INSERT INTO `product_spec` VALUES (1,'LGA1700',NULL,NULL,NULL,125,NULL,NULL,2),(2,NULL,'PCIe 5.0 x16',NULL,NULL,260,800,NULL,4);
/*!40000 ALTER TABLE `product_spec` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('ADMIN','USER') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'test@test.com','윤찬영','1234','ADMIN'),(2,'newuser@test.com','새사용자','$2a$10$z9PqVjaTGOymuSR76mu1cemdXwwO8gTXU1liy/JCqkDhr9vvvf20a','ADMIN'),(3,'user2@test.com','테스트사용자','$2a$10$E4PGJ6FOBVRrT6JYvFj.WuNY63dlW9Vhs0s5C33yDKyV1//gLCwky','USER');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'upgradehub'
--

--
-- Dumping routines for database 'upgradehub'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-14  1:45:21
