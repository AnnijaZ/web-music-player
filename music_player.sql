-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Jun 03, 2024 at 05:25 AM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `music_player`
--

-- --------------------------------------------------------

--
-- Table structure for table `music_info`
--

CREATE TABLE `music_info` (
  `info_id` int(11) NOT NULL,
  `info_name` varchar(200) NOT NULL,
  `info_artist` varchar(200) NOT NULL,
  `info_length` varchar(200) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `cover_path` varchar(255) NOT NULL,
  `id_playlist` int(11) DEFAULT NULL,
  `is_favorite` tinyint(1) NOT NULL,
  `id_user` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `music_info`
--

INSERT INTO `music_info` (`info_id`, `info_name`, `info_artist`, `info_length`, `file_path`, `cover_path`, `id_playlist`, `is_favorite`, `id_user`) VALUES
(6, 'Drum and Bass', 'PeanutSound', '2:01', 'uploads/Drum_and_Bass_-_Peanut.mp3', 'covers/Drum_and_Bass_-_Peanut.mp3.jpg', NULL, 0, 1),
(9, 'Rhythms of Love', 'Caleb Lemond', '4:13', 'uploads/Caleb_Lemond_-_Rhythms_of_Love.mp3', 'covers/Caleb_Lemond_-_Rhythms_of_Love.mp3.jpg', 11, 1, 1),
(14, 'Effects of Elevation (Citizen Prime Remix)', 'Revolution Void', '7:24', 'uploads/Effects_of_Elevation_%28Citizen_Prime_Remix%29_-_revolutionvoid.mp3', '', 10, 0, 1),
(16, '100% Housegemacht', 'Mike Huckebein', '5:15', 'uploads/100%25_Housegemacht_-_DJ_Soulblade.mp3', '', 1, 0, 1),
(56, 'Effects of Elevation (Citizen Prime Remix)', 'Revolution Void', '7:24', 'uploads/Effects_of_Elevation_%28Citizen_Prime_Remix%29_-_revolutionvoid.mp3', '', 1, 1, 1),
(57, 'Effects of Elevation (Citizen Prime Remix)', 'Revolution Void', '7:24', 'uploads/Effects_of_Elevation_%28Citizen_Prime_Remix%29_-_revolutionvoid.mp3', '', NULL, 1, 1),
(58, 'Drum and Bass', 'PeanutSound', '2:01', 'uploads/Drum_and_Bass_-_Peanut.mp3', 'covers/6641132e62b19.mp3', 1, 0, 1),
(59, 'I Just Can\'t Get Enough You', 'noexit.', '3:29', 'uploads/noexit._-_I_Just_Can%27t_Get_Enough_You.mp3', '', NULL, 0, 1),
(60, 'I Just Can\'t Get Enough You', 'noexit.', '3:29', 'uploads/noexit._-_I_Just_Can%27t_Get_Enough_You.mp3', '', NULL, 0, 1),
(61, 'Rhythms of Love', 'Caleb Lemond', '4:13', 'uploads/Caleb_Lemond_-_Rhythms_of_Love.mp3', 'covers/6654fac053897.mp3', 1, 0, 1),
(62, 'Effects of Elevation (Citizen Prime Remix)', 'Revolution Void', '7:24', 'uploads/Effects_of_Elevation_%28Citizen_Prime_Remix%29_-_revolutionvoid.mp3', '', 16, 0, 2),
(63, 'Drum and Bass', 'PeanutSound', '2:01', 'uploads/Drum_and_Bass_-_Peanut.mp3', 'covers/665ce041435ae.mp3', 16, 1, 2),
(64, 'I Just Can\'t Get Enough You', 'noexit.', '3:29', 'uploads/noexit._-_I_Just_Can%27t_Get_Enough_You.mp3', '', NULL, 0, 2),
(65, 'Rhythms of Love', 'Caleb Lemond', '4:13', 'uploads/Caleb_Lemond_-_Rhythms_of_Love.mp3', 'covers/665ce416c96c4.mp3', NULL, 0, 2),
(66, 'I Just Can\'t Get Enough You', 'noexit.', '3:29', 'uploads/noexit._-_I_Just_Can%27t_Get_Enough_You.mp3', '', NULL, 0, 1),
(67, '100% Housegemacht', 'Mike Huckebein', '5:15', 'uploads/100%25_Housegemacht_-_DJ_Soulblade.mp3', '', NULL, 0, 1),
(68, 'Rhythms of Love', 'Caleb Lemond', '4:13', 'uploads/Caleb_Lemond_-_Rhythms_of_Love.mp3', 'covers/665cf5f22468a.mp3', NULL, 0, 1),
(69, 'Drum and Bass', 'PeanutSound', '2:01', 'uploads/Drum_and_Bass_-_Peanut.mp3', 'covers/665cf5fa2b8ee.mp3', NULL, 0, 1),
(70, 'Drum and Bass', 'PeanutSound', '2:01', 'uploads/Drum_and_Bass_-_Peanut.mp3', 'covers/665cf602d77c0.mp3', NULL, 1, 1),
(71, '100% Housegemacht', 'Mike Huckebein', '5:15', 'uploads/100%25_Housegemacht_-_DJ_Soulblade.mp3', '', NULL, 1, 1),
(72, 'Rhythms of Love', 'Caleb Lemond', '4:13', 'uploads/Caleb_Lemond_-_Rhythms_of_Love.mp3', 'covers/665cfc44a11d9.mp3', NULL, 0, 1),
(73, 'Drum and Bass', 'PeanutSound', '2:01', 'uploads/Drum_and_Bass_-_Peanut.mp3', 'covers/665cfc47e36e5.mp3', NULL, 1, 1),
(74, 'Drum and Bass', 'PeanutSound', '2:01', 'uploads/Drum_and_Bass_-_Peanut.mp3', 'covers/665cfc4a512e0.mp3', NULL, 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `playlist_info`
--

CREATE TABLE `playlist_info` (
  `playlist_id` int(11) NOT NULL,
  `playlist_name` varchar(200) NOT NULL,
  `playlist_cover` varchar(255) NOT NULL,
  `id_user` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `playlist_info`
--

INSERT INTO `playlist_info` (`playlist_id`, `playlist_name`, `playlist_cover`, `id_user`) VALUES
(1, 'Test Playlist23436222', 'covers/noImage.jpg', 1),
(10, 'Test Playlist523', 'covers/noImage.jpg', 1),
(11, 'Test Playlist564', 'covers/noImage.jpg', 1),
(13, 'Test Playlist2334342', 'covers/noImage.jpg', 1),
(14, 'Test Playlist234564564', 'covers/noImage.jpg', 1),
(16, 'TestPlaylist for TestUser1', 'covers/665cf04b35c6a.jpg', 2);

-- --------------------------------------------------------

--
-- Table structure for table `user_info`
--

CREATE TABLE `user_info` (
  `user_id` int(11) NOT NULL,
  `user_name` varchar(200) NOT NULL,
  `user_password` varchar(60) NOT NULL,
  `user_created` datetime NOT NULL DEFAULT current_timestamp(),
  `user_status` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_info`
--

INSERT INTO `user_info` (`user_id`, `user_name`, `user_password`, `user_created`, `user_status`) VALUES
(1, 'Admin', '$2y$10$7/FO.HYdE413xycT8vT8VOIlbVOaEXeaN4fMF1.gwm3xM2pk2ekfW', '2024-02-27 08:30:15', 1),
(2, 'TestUser', '$2y$10$UVgXlx4eIp8iZ2FbryDGMO/As3YRUqB0gODqo53ExLP3d5OxMFf3G', '2024-06-02 18:28:20', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `music_info`
--
ALTER TABLE `music_info`
  ADD PRIMARY KEY (`info_id`),
  ADD KEY `id_playlist` (`id_playlist`),
  ADD KEY `user_id` (`id_user`);

--
-- Indexes for table `playlist_info`
--
ALTER TABLE `playlist_info`
  ADD PRIMARY KEY (`playlist_id`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `user_info`
--
ALTER TABLE `user_info`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `music_info`
--
ALTER TABLE `music_info`
  MODIFY `info_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;

--
-- AUTO_INCREMENT for table `playlist_info`
--
ALTER TABLE `playlist_info`
  MODIFY `playlist_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `user_info`
--
ALTER TABLE `user_info`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `music_info`
--
ALTER TABLE `music_info`
  ADD CONSTRAINT `music_info_ibfk_1` FOREIGN KEY (`id_playlist`) REFERENCES `playlist_info` (`playlist_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `music_info_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `user_info` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `playlist_info`
--
ALTER TABLE `playlist_info`
  ADD CONSTRAINT `playlist_info_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user_info` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
