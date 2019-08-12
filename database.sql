CREATE TABLE `piano_music_record` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `music_name` varchar(64) NOT NULL DEFAULT '' COMMENT '名称',
  `music_feel` varchar(256) DEFAULT NULL COMMENT '感受',
  `music_create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `music_tune` int(11) NOT NULL DEFAULT '0' COMMENT '音调',
  `music_author` varchar(32) NOT NULL DEFAULT '' COMMENT '作者',
  `music_play_count` int(11) NOT NULL DEFAULT '0' COMMENT '播放次数',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT '录音表';

CREATE TABLE `piano_record_detail` (
   `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
   `music_id` int(11) DEFAULT NULL COMMENT '录音 ID',
   `record_time` int(11) DEFAULT NULL,
   `record_tunes` varchar(128) DEFAULT NULL,
   PRIMARY KEY (`id`),
   KEY `music_id` (`music_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT '录音按键明细';