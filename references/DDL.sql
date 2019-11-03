-- DB만들고 drop 아래 create부터 실행하세요
-- backend/DB_config에 데이터베이스 정보 넣어놧으니까 로컬환경에 맞춰서 바꿔야 실행되요


-- 돼지테이블
DROP TABLE pig;

-- 수질테이블
DROP TABLE water;

-- RFID
DROP TABLE IoT_RFID;

-- 신고
DROP TABLE report;

-- water
DROP TABLE IoT_water;

-- RFID
CREATE TABLE IoT_RFID (
	iot_ID  INTEGER     NOT NULL PRIMARY KEY AUTO_INCREMENT, -- 기기번호
	address VARCHAR(50) NULL      -- 주소
);

-- 신고
CREATE TABLE report (
	report_ID INTEGER       NOT NULL PRIMARY KEY AUTO_INCREMENT, -- 신고번호
	comments  VARCHAR(5000) NULL,     -- 신고내용
	mail      VARCHAR(25)   NULL,     -- 메일
	address   VARCHAR(50)   NULL,     -- 신고지역
	time      DATE          NULL      -- 신고시간
);

-- water
CREATE TABLE IoT_water (
	iot_ID  INTEGER     NOT NULL PRIMARY KEY AUTO_INCREMENT, -- 기기번호
	address VARCHAR(50) NULL      -- 주소
);

-- 새 테이블
CREATE TABLE pig (
	iot_ID INTEGER NULL , -- 기기번호
	pig    INTEGER NULL, -- 돼지수
	time   DATE    NULL  -- 등록날짜
);

-- 새 테이블2
CREATE TABLE water (
	iot_ID      INTEGER      NULL, -- 기기번호
	turbidity   INTEGER      NULL, -- 탁도
	time        DATE         NULL, -- 등록시간
	waterq      DOUBLE       NULL, -- 탁도/기준치
	trans VARCHAR(256) NULL  -- 블록번호
);

-- 새 테이블
ALTER TABLE pig
	ADD
		CONSTRAINT FK_IoT_RFID_TO_pig -- RFID -> 새 테이블
		FOREIGN KEY (
			iot_ID -- 기기번호
		)
		REFERENCES IoT_RFID ( -- RFID
			iot_ID -- 기기번호
		);

-- 새 테이블2
ALTER TABLE water
	ADD
		CONSTRAINT FK_IoT_water_TO_water -- water -> 새 테이블2
		FOREIGN KEY (
			iot_ID -- 기기번호
		)
		REFERENCES IoT_water ( -- water
			iot_ID -- 기기번호
		);